// Layout of assets/footballer.png: one row of 16x28 frames, feet on the bottom row.
// The source art has non-square pixels, 41:29.5 wide to tall.
const FRAME_WIDTH = 16;
const FRAME_HEIGHT = 28;
const FRAME_ANCHOR_COLUMN = 7.5;
const FRAME_FRONT_REACH = 8.5;
const KICK_TOE_COLUMN = 15;
const PIXEL_ASPECT = 41 / 29.5;
const FRAMES = { stand: 0, run: [0, 1, 2, 3], windup: 4, kick: 5 };

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
  constructor({ playerImage, palette, pixelSize, ballPixelSize, random = Math.random }) {
    this.playerImage = playerImage;
    this.palette = palette;
    this.pixelWidth = pixelSize * PIXEL_ASPECT;
    this.pixelHeight = pixelSize;
    this.ballPixelSize = ballPixelSize;
    this.random = random;
    this.ballRadius = (BALL_SIZE / 2) * ballPixelSize;
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
    return (KICK_TOE_COLUMN - FRAME_ANCHOR_COLUMN) * this.pixelWidth + this.ballRadius - 1;
  }

  resize({ fieldStart, fieldEnd, groundY }) {
    const spriteReach = FRAME_FRONT_REACH * this.pixelWidth + 8;
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

    const runFrame = Math.floor(player.strideTime * RUN_FRAME_RATE) % FRAMES.run.length;
    if (runFrame !== player.runFrame) {
      player.runFrame = runFrame;
      const isFootLanding = runFrame % 2 === 1;
      if (isFootLanding) {
        pile?.rustle(player.x + player.facing * this.pixelWidth * 2, this.groundY - 4, player.facing * 10);
      }
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

  currentFrame() {
    const { player } = this;
    if (player.state === "windup") return FRAMES.windup;
    if (player.state === "strike") return FRAMES.kick;
    if (player.isRunning) return FRAMES.run[player.runFrame];
    return FRAMES.stand;
  }

  snap(value) {
    return Math.round(value / this.ballPixelSize) * this.ballPixelSize;
  }

  draw(context, pixelRatio, offsetY) {
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    const isPlayerLoaded = this.playerImage.complete && this.playerImage.naturalWidth > 0;
    if (!this.hasLayout || !isPlayerLoaded) return;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, pixelRatio * offsetY);
    context.imageSmoothingEnabled = false;

    const { ball, player, ballPixelSize, pixelWidth, pixelHeight, groundY } = this;
    const ballLeft = this.snap(ball.x) - Math.floor(BALL_SIZE / 2) * ballPixelSize;
    const ballLift = this.snap(this.floorY - ball.y);
    const ballTop = groundY - BALL_SIZE * ballPixelSize - ballLift;
    const playerX = Math.round(player.x);

    context.globalAlpha = 0.12;
    context.fillStyle = this.palette.K;
    const shadowWidth = this.snap(Math.max(ballPixelSize * 2, BALL_SIZE * ballPixelSize * (1 - ballLift / 160)));
    context.fillRect(this.snap(ball.x) - shadowWidth / 2, groundY - 1, shadowWidth, 2);
    context.fillRect(playerX - 4 * pixelWidth, groundY - 1, 8 * pixelWidth, 2);
    context.globalAlpha = 1;

    context.save();
    context.translate(playerX, groundY);
    context.scale(player.facing * pixelWidth, pixelHeight);
    context.drawImage(
      this.playerImage,
      this.currentFrame() * FRAME_WIDTH,
      0,
      FRAME_WIDTH,
      FRAME_HEIGHT,
      -FRAME_ANCHOR_COLUMN,
      -FRAME_HEIGHT,
      FRAME_WIDTH,
      FRAME_HEIGHT,
    );
    context.restore();

    this.drawBall(context, ballLeft, ballTop);
  }

  drawBall(context, left, top) {
    const size = this.ballPixelSize;
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
