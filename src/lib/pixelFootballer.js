const UPPER_BODY = [
  "...H.H.H...",
  "..HHhHhHH..",
  ".HhHHHHhHH.",
  ".HHhHSSSS..",
  "..HHSSSES..",
  "..H.SSSS...",
  "...TTTTTT..",
  "..TTTTTTTT.",
  "..S.TTTT.S.",
  "....TTTT...",
];

const SPRITES = {
  stand: [...UPPER_BODY, "....PPPP...", "....Q..Q...", "....S..S...", "....K..K...", "....KK.KK.."],
  strideOpen: [...UPPER_BODY, "....PPPP...", "...QQ..QQ..", "..SS....SS.", ".KK......KK", "..........."],
  stridePass: [...UPPER_BODY, "....PPPP...", "....QQQ....", "...SS.S....", "..KK..S....", "......KK..."],
  windup: [...UPPER_BODY, "....PPPP...", "...QQ..Q...", "..SS...S...", ".KK....K...", ".......KK.."],
  kick: [...UPPER_BODY, "....PPPP...", "....Q..QQ..", "....S...SS.", "....S....KK", "....KK....."],
};
const RUN_CYCLE = [SPRITES.strideOpen, SPRITES.stridePass];
const SPRITE_WIDTH = 11;
const SPRITE_HEIGHT = SPRITES.stand.length;
const SPRITE_CENTER_COLUMN = 5;

const BALL_SIZE = 5;
const BALL_PATCH_RING = [
  [1, 1], [2, 1], [3, 1], [3, 2], [3, 3], [2, 3], [1, 3], [1, 2],
];

const GRAVITY = 1400;
const ROLL_FRICTION = 1.1;
const BOUNCE = 0.45;
const MIN_BOUNCE_SPEED = 120;
const WALL_BOUNCE = 0.55;
const RUN_SPEED = 125;
const WINDUP_DURATION = 0.13;
const KICK_DURATION = 0.22;
const SETTLED_BALL_SPEED = 40;
const LEAF_HIT_SPEED = 50;
const LEAF_HIT_REACH = 14;
const RUN_FRAME_RATE = 9;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export class PixelFootballer {
  constructor({ palette, pixelSize, random = Math.random }) {
    this.palette = palette;
    this.pixelSize = pixelSize;
    this.random = random;
    this.ballRadius = (BALL_SIZE / 2) * pixelSize;
    this.fieldStart = 0;
    this.fieldEnd = 0;
    this.groundY = 0;
    this.hasLayout = false;
    this.ball = { x: 0, y: 0, velocityX: 0, velocityY: 0, roll: 0 };
    this.player = {
      x: 0,
      facing: 1,
      state: "rest",
      stateTime: 0,
      restFor: 1.2,
      kickDirection: 1,
      isRunning: false,
      strideTime: 0,
      runFrame: 0,
    };
  }

  get kickStandoff() {
    return 5.5 * this.pixelSize;
  }

  resize({ fieldStart, fieldEnd, groundY }) {
    const spriteReach = SPRITE_CENTER_COLUMN * this.pixelSize + 8;
    this.fieldStart = fieldStart + spriteReach;
    this.fieldEnd = Math.max(this.fieldStart + 120, fieldEnd - spriteReach);
    this.groundY = groundY;
    const { ball, player } = this;
    if (!this.hasLayout) {
      this.hasLayout = true;
      player.x = fieldStart + 30;
      ball.x = player.x + this.kickStandoff;
    }
    ball.x = clamp(ball.x, this.fieldStart + this.ballRadius, this.fieldEnd - this.ballRadius);
    ball.y = Math.min(ball.y || Infinity, this.floorY);
    player.x = clamp(player.x, this.fieldStart, this.fieldEnd);
  }

  get floorY() {
    return this.groundY - this.ballRadius;
  }

  get isBallGrounded() {
    return this.ball.y >= this.floorY - 0.5;
  }

  step(deltaSeconds, pile) {
    if (!this.hasLayout) return;
    this.stepBall(deltaSeconds, pile);
    this.stepPlayer(deltaSeconds, pile);
  }

  stepBall(deltaSeconds, pile) {
    const { ball, ballRadius } = this;
    ball.velocityY += GRAVITY * deltaSeconds;
    ball.x += ball.velocityX * deltaSeconds;
    ball.y += ball.velocityY * deltaSeconds;

    if (ball.y >= this.floorY) {
      ball.y = this.floorY;
      ball.velocityY = ball.velocityY > MIN_BOUNCE_SPEED ? -ball.velocityY * BOUNCE : 0;
      ball.velocityX *= Math.exp(-ROLL_FRICTION * deltaSeconds);
      if (Math.abs(ball.velocityX) < 4) ball.velocityX = 0;
    }

    const minX = this.fieldStart + ballRadius;
    const maxX = this.fieldEnd - ballRadius;
    if (ball.x < minX) {
      ball.x = minX;
      ball.velocityX = Math.abs(ball.velocityX) * WALL_BOUNCE;
    } else if (ball.x > maxX) {
      ball.x = maxX;
      ball.velocityX = -Math.abs(ball.velocityX) * WALL_BOUNCE;
    }
    ball.roll += (ball.velocityX * deltaSeconds) / ballRadius;

    const speed = Math.hypot(ball.velocityX, ball.velocityY);
    if (!pile || speed < LEAF_HIT_SPEED) return;
    const tossedCount = pile.toss(ball.x, ball.y, clamp(speed / 420, 0.2, 1), {
      radius: ballRadius + LEAF_HIT_REACH,
      pushX: ball.velocityX * 0.6,
    });
    if (tossedCount) ball.velocityX *= 0.96;
  }

  stepPlayer(deltaSeconds, pile) {
    const { ball, player } = this;
    player.stateTime += deltaSeconds;
    player.isRunning = false;

    if (player.state === "windup") {
      if (player.stateTime > WINDUP_DURATION) this.strike();
      return;
    }

    if (player.state === "strike") {
      if (player.stateTime > KICK_DURATION) {
        this.setPlayerState("rest");
        player.restFor = 0.3 + this.random() * 1.1;
      }
      return;
    }

    if (player.state === "rest") {
      player.facing = Math.sign(ball.x - player.x) || player.facing;
      if (player.stateTime > player.restFor) {
        this.setPlayerState("chase");
        player.kickDirection = this.pickKickDirection();
      }
      return;
    }

    const wallMargin = Math.min(90, (this.fieldEnd - this.fieldStart) * 0.2);
    if (ball.x - this.fieldStart < wallMargin) player.kickDirection = 1;
    else if (this.fieldEnd - ball.x < wallMargin) player.kickDirection = -1;

    const targetX = ball.x - player.kickDirection * this.kickStandoff;
    const distance = targetX - player.x;
    const isBallSettled = this.isBallGrounded && Math.abs(ball.velocityX) < SETTLED_BALL_SPEED;

    if (Math.abs(distance) < 4 && isBallSettled) {
      player.facing = player.kickDirection;
      this.setPlayerState("windup");
      return;
    }
    if (Math.abs(distance) < 1) {
      player.facing = player.kickDirection;
      return;
    }

    player.x += Math.sign(distance) * Math.min(Math.abs(distance), RUN_SPEED * deltaSeconds);
    player.facing = Math.sign(distance);
    player.isRunning = true;
    player.strideTime += deltaSeconds;

    const runFrame = Math.floor(player.strideTime * RUN_FRAME_RATE) % RUN_CYCLE.length;
    if (runFrame !== player.runFrame) {
      player.runFrame = runFrame;
      pile?.rustle(player.x + player.facing * this.pixelSize * 2, this.groundY - 4, player.facing * 10);
    }
  }

  pickKickDirection() {
    const awayFromPlayer = Math.sign(this.ball.x - this.player.x) || 1;
    return this.random() < 0.75 ? awayFromPlayer : -awayFromPlayer;
  }

  setPlayerState(state) {
    this.player.state = state;
    this.player.stateTime = 0;
  }

  strike() {
    const { ball, player, random } = this;
    this.setPlayerState("strike");
    ball.velocityX = player.facing * (170 + random() * 280);
    ball.velocityY = random() < 0.35 ? -(260 + random() * 260) : -(20 + random() * 60);
  }

  currentSprite() {
    const { player } = this;
    if (player.state === "windup") return SPRITES.windup;
    if (player.state === "strike") return SPRITES.kick;
    if (player.isRunning) return RUN_CYCLE[player.runFrame];
    return SPRITES.stand;
  }

  snap(value) {
    return Math.round(value / this.pixelSize) * this.pixelSize;
  }

  draw(context, pixelRatio, offsetY) {
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    if (!this.hasLayout) return;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, pixelRatio * offsetY);

    const { ball, player, pixelSize, groundY } = this;
    const ballLeft = this.snap(ball.x) - Math.floor(BALL_SIZE / 2) * pixelSize;
    const ballLift = this.snap(this.floorY - ball.y);
    const ballTop = groundY - BALL_SIZE * pixelSize - ballLift;
    const playerLeft = this.snap(player.x) - SPRITE_CENTER_COLUMN * pixelSize;

    context.globalAlpha = 0.12;
    context.fillStyle = this.palette.K;
    const shadowWidth = this.snap(Math.max(pixelSize * 2, BALL_SIZE * pixelSize * (1 - ballLift / 160)));
    context.fillRect(this.snap(ball.x) - shadowWidth / 2, groundY - pixelSize / 2, shadowWidth, pixelSize);
    context.fillRect(playerLeft + 3 * pixelSize, groundY - pixelSize / 2, 6 * pixelSize, pixelSize);
    context.globalAlpha = 1;

    this.drawSprite(context, this.currentSprite(), playerLeft, groundY - SPRITE_HEIGHT * pixelSize, player.facing < 0);
    this.drawBall(context, ballLeft, ballTop);
  }

  drawSprite(context, rows, left, top, isFlipped) {
    const size = this.pixelSize;
    rows.forEach((row, rowIndex) => {
      for (let column = 0; column < SPRITE_WIDTH; column++) {
        const key = row[isFlipped ? SPRITE_WIDTH - 1 - column : column];
        if (key === ".") continue;
        context.fillStyle = this.palette[key];
        context.fillRect(left + column * size, top + rowIndex * size, size, size);
      }
    });
  }

  drawBall(context, left, top) {
    const size = this.pixelSize;
    const ringStep = Math.PI / 4;
    const patchIndex =
      ((Math.floor(this.ball.roll / ringStep) % BALL_PATCH_RING.length) + BALL_PATCH_RING.length) %
      BALL_PATCH_RING.length;
    const patches = [
      BALL_PATCH_RING[patchIndex],
      BALL_PATCH_RING[(patchIndex + BALL_PATCH_RING.length / 2) % BALL_PATCH_RING.length],
    ];

    for (let row = 0; row < BALL_SIZE; row++) {
      for (let column = 0; column < BALL_SIZE; column++) {
        const isCorner = (row === 0 || row === BALL_SIZE - 1) && (column === 0 || column === BALL_SIZE - 1);
        if (isCorner) continue;
        const isEdge = row === 0 || row === BALL_SIZE - 1 || column === 0 || column === BALL_SIZE - 1;
        const isPatch = patches.some(([patchColumn, patchRow]) => patchColumn === column && patchRow === row);
        context.fillStyle = isEdge || isPatch ? this.palette.K : this.palette.W;
        context.fillRect(left + column * size, top + row * size, size, size);
      }
    }
  }
}
