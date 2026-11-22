import { createSeededRandom } from "./seededRandom.js";

export const LEAF_SKY_HEIGHT = 220;

const BIN_WIDTH = 6;
const MAX_PILE_SLOPE = 3.2;
const GRAVITY = 1150;
const TOSS_RADIUS = 70;
const RUSTLE_RADIUS = 24;
const LEAF_PATH = "M5 0 C9.5 3.5 9.5 9.5 5 14 C0.5 9.5 0.5 3.5 5 0 Z";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export class LeafPile {
  constructor({ colors, count, pileCenter, veinColor, seed = 7 }) {
    this.colors = colors;
    this.count = count;
    this.pileCenter = pileCenter;
    this.veinColor = veinColor;
    this.random = createSeededRandom(seed);
    this.leaves = [];
    this.binHeights = new Float32Array(1);
    this.width = 0;
    this.height = 0;
    this.groundY = 0;
    this.restOrder = 0;
    this.needsDraw = true;
    this.leafPath = new Path2D(LEAF_PATH);
  }

  get binCount() {
    return this.binHeights.length;
  }

  binAt(x) {
    return clamp(Math.floor(x / BIN_WIDTH), 0, this.binCount - 1);
  }

  surfaceAt(x) {
    return this.groundY - this.binHeights[this.binAt(x)];
  }

  get pileX() {
    return this.width * this.pileCenter;
  }

  resize(width, height) {
    if (width < 10 || height < 10) return;
    const isFirstLayout = this.width === 0;
    const widthRatio = isFirstLayout ? 1 : width / this.width;
    const heightShift = height - this.height;
    this.width = width;
    this.height = height;
    this.groundY = height - 3;
    this.binHeights = new Float32Array(Math.ceil(width / BIN_WIDTH) + 1);

    if (isFirstLayout) {
      this.seedPile();
      return;
    }
    for (const leaf of this.leaves) {
      leaf.x *= widthRatio;
      leaf.restX *= widthRatio;
      leaf.y += heightShift;
      leaf.bin = this.binAt(leaf.restX);
    }
    this.restack(true);
  }

  createLeaf(x, y) {
    const random = this.random;
    return {
      x,
      y,
      velocityX: 0,
      velocityY: 0,
      angle: random() * Math.PI * 2,
      spin: 0,
      flutterPhase: random() * Math.PI * 2,
      flutterSpeed: 0,
      size: 9 + random() * 8,
      color: this.colors[Math.floor(random() * this.colors.length)],
      terminalVelocity: 60 + random() * 60,
      resting: false,
      restX: x,
      restY: y,
      restAngle: 0,
      restFlip: 1,
      bin: 0,
      thickness: 0,
      order: 0,
    };
  }

  seedPile() {
    const spread = clamp(this.width * 0.085, 46, 110);
    for (let index = 0; index < this.count; index++) {
      const bellCurve = (this.random() + this.random() + this.random() - 1.5) / 1.5;
      const leaf = this.createLeaf(clamp(this.pileX + bellCurve * spread * 1.6, 8, this.width - 8), 0);
      this.leaves.push(leaf);
      this.settle(leaf, true);
    }
    this.needsDraw = true;
  }

  // Leaves slide downhill across the height-map until the slope is gentle
  // enough, so the pile forms a natural mound instead of a single column.
  settle(leaf, instant = false) {
    const random = this.random;
    const heights = this.binHeights;
    const startBin = this.binAt(leaf.x);
    let bin = startBin;

    for (let attempt = 0; attempt < 40; attempt++) {
      const left = bin > 0 ? heights[bin - 1] : Infinity;
      const right = bin < this.binCount - 1 ? heights[bin + 1] : Infinity;
      if (heights[bin] - Math.min(left, right) <= MAX_PILE_SLOPE) break;
      const goLeft = left < right || (left === right && random() < 0.5);
      bin += goLeft ? -1 : 1;
    }

    leaf.resting = true;
    leaf.bin = bin;
    leaf.restX = bin === startBin ? leaf.x : bin * BIN_WIDTH + random() * BIN_WIDTH;
    leaf.thickness = 2.4 * (leaf.size / 13);
    leaf.restY = this.groundY - heights[bin] - leaf.size * 0.18;
    this.addToPile(bin, leaf.thickness);

    const fullTurns = Math.round(leaf.angle / (Math.PI * 2)) * Math.PI * 2;
    leaf.restAngle = (random() < 0.5 ? -1 : 1) * (Math.PI / 2) + (random() - 0.5) * 1.5 + fullTurns;
    leaf.restFlip = 0.55 + random() * 0.45;
    leaf.order = ++this.restOrder;
    leaf.velocityX = 0;
    leaf.velocityY = 0;
    leaf.spin = 0;

    if (instant) {
      leaf.x = leaf.restX;
      leaf.y = leaf.restY;
      leaf.angle = leaf.restAngle;
    }
    this.needsDraw = true;
  }

  addToPile(bin, thickness) {
    this.binHeights[bin] += thickness;
    if (bin > 0) this.binHeights[bin - 1] += thickness * 0.45;
    if (bin < this.binCount - 1) this.binHeights[bin + 1] += thickness * 0.45;
  }

  restack(snap = false) {
    this.binHeights.fill(0);
    const resting = this.leaves.filter((leaf) => leaf.resting).sort((a, b) => a.order - b.order);
    for (const leaf of resting) {
      leaf.restY = this.groundY - this.binHeights[leaf.bin] - leaf.size * 0.18;
      if (snap) leaf.y = leaf.restY;
      this.addToPile(leaf.bin, leaf.thickness);
    }
    this.needsDraw = true;
  }

  launch(leaf, velocityX, velocityY) {
    leaf.resting = false;
    leaf.velocityX = velocityX;
    leaf.velocityY = velocityY;
    leaf.spin = (this.random() - 0.5) * 14;
    leaf.flutterSpeed = 5 + this.random() * 9;
  }

  distanceToNearestRestingLeaf(x, y) {
    let nearest = Infinity;
    for (const leaf of this.leaves) {
      if (leaf.resting) nearest = Math.min(nearest, Math.hypot(leaf.x - x, (leaf.y - y) * 1.4));
    }
    return nearest;
  }

  toss(x, y, strength = 1, { radius = TOSS_RADIUS, pushX = 0 } = {}) {
    const random = this.random;
    let tossedCount = 0;
    for (const leaf of this.leaves) {
      if (!leaf.resting) continue;
      const distance = Math.hypot(leaf.x - x, (leaf.y - y) * 1.3);
      if (distance > radius) continue;
      const closeness = 1 - distance / radius;
      this.launch(
        leaf,
        (leaf.x - x) * 2.4 + (random() - 0.5) * 110 + pushX,
        -(320 + 520 * closeness * strength + random() * 190),
      );
      tossedCount++;
    }
    if (tossedCount) this.restack();
    return tossedCount;
  }

  rustle(x, y, movementX) {
    const random = this.random;
    let rustledCount = 0;
    for (const leaf of this.leaves) {
      if (!leaf.resting || random() > 0.3) continue;
      if (Math.hypot(leaf.x - x, (leaf.y - y) * 1.3) > RUSTLE_RADIUS) continue;
      this.launch(leaf, clamp(movementX * 9, -160, 160) + (random() - 0.5) * 60, -(90 + random() * 150));
      rustledCount++;
    }
    if (rustledCount) this.restack();
  }

  dropFrom(rect, amount, maxLeaves) {
    const random = this.random;
    for (let index = 0; index < amount && this.leaves.length < maxLeaves; index++) {
      const leaf = this.createLeaf(
        rect.x + rect.width * (0.15 + random() * 0.7),
        rect.y + rect.height * (0.08 + random() * 0.4),
      );
      this.leaves.push(leaf);
      this.launch(leaf, -(15 + random() * 45), -(random() * 60));
    }
  }

  step(deltaSeconds) {
    let moving = false;
    const airDrag = Math.exp(-1.3 * deltaSeconds);

    for (const leaf of this.leaves) {
      if (leaf.resting) {
        const ease = Math.min(1, deltaSeconds * 12);
        const offTarget =
          Math.abs(leaf.y - leaf.restY) > 0.2 ||
          Math.abs(leaf.x - leaf.restX) > 0.2 ||
          Math.abs(leaf.angle - leaf.restAngle) > 0.01;
        if (offTarget) {
          leaf.x += (leaf.restX - leaf.x) * ease;
          leaf.y += (leaf.restY - leaf.y) * ease;
          leaf.angle += (leaf.restAngle - leaf.angle) * ease;
          moving = true;
        }
        continue;
      }

      moving = true;
      leaf.velocityY += GRAVITY * deltaSeconds;
      if (leaf.velocityY > leaf.terminalVelocity) {
        leaf.velocityY =
          leaf.terminalVelocity + (leaf.velocityY - leaf.terminalVelocity) * Math.exp(-6 * deltaSeconds);
      }
      leaf.velocityX *= airDrag;
      leaf.flutterPhase += leaf.flutterSpeed * deltaSeconds;
      if (leaf.velocityY > 0) {
        const sway = Math.sin(leaf.flutterPhase * 0.7) * 150;
        const breeze = -14;
        leaf.velocityX += (sway + breeze - leaf.velocityX * 0.4) * deltaSeconds;
      }
      leaf.x += leaf.velocityX * deltaSeconds;
      leaf.y += leaf.velocityY * deltaSeconds;
      leaf.angle += leaf.spin * deltaSeconds;
      leaf.spin *= Math.exp(-0.6 * deltaSeconds);

      if (leaf.x < 6) {
        leaf.x = 6;
        leaf.velocityX = Math.abs(leaf.velocityX) * 0.3;
      }
      if (leaf.x > this.width - 6) {
        leaf.x = this.width - 6;
        leaf.velocityX = -Math.abs(leaf.velocityX) * 0.3;
      }
      if (leaf.velocityY > 0 && leaf.y >= this.surfaceAt(leaf.x) - leaf.size * 0.18) {
        this.settle(leaf);
      }
    }

    if (moving) this.needsDraw = true;
    return moving;
  }

  draw(context, pixelRatio) {
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    const drawOrder = this.leaves
      .slice()
      .sort((a, b) => (a.resting ? a.order : Infinity) - (b.resting ? b.order : Infinity));

    for (const leaf of drawOrder) {
      // Flying leaves squash horizontally with their flutter phase to fake a 3D tumble.
      const flip = leaf.resting ? leaf.restFlip : Math.cos(leaf.flutterPhase);
      const safeFlip = Math.abs(flip) < 0.12 ? 0.12 * Math.sign(flip || 1) : flip;
      const scale = leaf.size / 14;

      context.setTransform(pixelRatio, 0, 0, pixelRatio, pixelRatio * leaf.x, pixelRatio * (leaf.y + LEAF_SKY_HEIGHT));
      context.rotate(leaf.angle);
      context.scale(scale * safeFlip, scale);
      context.translate(-5, -7);

      context.globalAlpha = 0.94;
      context.fillStyle = leaf.color;
      context.fill(this.leafPath);
      context.globalAlpha = 1;
      context.lineWidth = 0.7;
      context.strokeStyle = this.veinColor;
      context.stroke(this.leafPath);
      context.beginPath();
      context.moveTo(5, 1.5);
      context.lineTo(5, 12.5);
      context.stroke();
    }
    this.needsDraw = false;
  }
}
