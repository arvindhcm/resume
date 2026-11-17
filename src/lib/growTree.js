import { createSeededRandom } from "./seededRandom.js";

const UPWARD_PULL = 0.2;
const TRUNK_DEPTH = 4;

const DEEP_GREEN = 0;
const TEAL_GREEN = 1;
const SAGE = 2;
const LIGHT_SAGE = 3;

export function growTree(seed) {
  const random = createSeededRandom(seed);
  const between = (min, max) => min + random() * (max - min);
  const branches = [];
  const clumps = [];

  const growBranch = (x, y, angle, length, width, depth, startTime, duration) => {
    const stepCount = Math.max(4, Math.round(length / 8));
    const totalBend = between(-0.28, 0.28);
    const points = [[x, y]];
    const angles = [angle];
    let currentX = x;
    let currentY = y;
    let currentAngle = angle;

    for (let step = 1; step <= stepCount; step++) {
      currentAngle += totalBend / stepCount + between(-0.05, 0.05);
      currentX += (Math.cos(currentAngle) * length) / stepCount;
      currentY += (Math.sin(currentAngle) * length) / stepCount;
      points.push([currentX, currentY]);
      angles.push(currentAngle);
    }

    const endTime = startTime + duration;
    branches.push({ points, widthStart: width, widthEnd: width * 0.58, startTime, endTime });

    if (depth === 0) {
      clumps.push({ x: currentX, y: currentY - 6, radius: between(30, 42), appearAt: endTime - duration * 0.4 });
      return;
    }

    if (depth <= 3) {
      for (let pointIndex = Math.ceil(stepCount * 0.55); pointIndex < points.length; pointIndex += 2) {
        if (random() < 0.4) {
          const [pointX, pointY] = points[pointIndex];
          clumps.push({
            x: pointX + between(-10, 10),
            y: pointY + between(-12, 4),
            radius: between(22, 32),
            appearAt: startTime + (pointIndex / stepCount) * duration + 0.15,
          });
        }
      }
    }

    const isCrownSplit = depth === TRUNK_DEPTH;
    const childCount = isCrownSplit ? 4 : random() < 0.4 ? 3 : 2;
    const fanSpread = isCrownSplit ? 0.78 : 0.58;

    for (let child = 0; child < childCount; child++) {
      const fanPosition = child / (childCount - 1) - 0.5;
      const forkAt = isCrownSplit ? 1 : child === 0 ? 1 : between(0.6, 0.98);
      const forkIndex = Math.round(forkAt * stepCount);
      const [forkX, forkY] = points[forkIndex];
      let childAngle = angles[forkIndex] + fanPosition * 2 * fanSpread + between(-0.12, 0.12);
      childAngle += (-Math.PI / 2 - childAngle) * UPWARD_PULL;
      const widthAtFork = width + (width * 0.58 - width) * forkAt;
      const lengthRatio = isCrownSplit ? between(0.72, 0.92) * (1 - Math.abs(fanPosition) * 0.25) : between(0.64, 0.78);

      growBranch(
        forkX,
        forkY,
        childAngle,
        length * lengthRatio,
        widthAtFork * (isCrownSplit ? 0.62 : 0.74),
        depth - 1,
        startTime + forkAt * duration,
        duration * 0.85,
      );
    }
  };

  const trunkLength = 125;
  const trunkAngle = -Math.PI / 2 + between(-0.05, 0.05);
  growBranch(0, 0, trunkAngle, trunkLength, 11, TRUNK_DEPTH, 0, 1);

  const sideLimbDirection = random() < 0.5 ? -1 : 1;
  const sideLimbBase = branches[0].points[Math.round((branches[0].points.length - 1) * 0.85)];
  growBranch(
    sideLimbBase[0],
    sideLimbBase[1],
    -Math.PI / 2 + sideLimbDirection * between(0.8, 0.95),
    trunkLength * 0.58,
    4.5,
    2,
    0.75,
    0.85,
  );

  const finishTime = Math.max(
    ...branches.map((branch) => branch.endTime),
    ...clumps.map((clump) => clump.appearAt + 0.3),
  );
  for (const branch of branches) {
    branch.startTime /= finishTime;
    branch.endTime /= finishTime;
  }
  for (const clump of clumps) clump.appearAt /= finishTime;

  let halfWidth = 1;
  let height = 1;
  for (const branch of branches) {
    for (const [pointX, pointY] of branch.points) {
      halfWidth = Math.max(halfWidth, Math.abs(pointX));
      height = Math.max(height, -pointY);
    }
  }
  for (const clump of clumps) {
    halfWidth = Math.max(halfWidth, Math.abs(clump.x) + clump.radius * 1.15);
    height = Math.max(height, -clump.y + clump.radius * 1.15);
  }
  const canopyTop = -height;
  for (const clump of clumps) {
    clump.heightRatio = clump.y / canopyTop;
    clump.sideRatio = Math.abs(clump.x) / halfWidth;
  }

  return { branches, clumps, halfWidth, height };
}

const clamp01 = (value) => Math.min(1, Math.max(0, value));
const easeOut = (value) => 1 - Math.pow(1 - value, 3);

function gaussian(random) {
  return (random() + random() + random() + random() - 2) * 0.87;
}

// Recursive midpoint displacement gives the ragged, bleeding edge of a watercolor wash.
function deformPolygon(points, passes, random) {
  let current = points;
  for (let pass = 0; pass < passes; pass++) {
    const next = [];
    for (let index = 0; index < current.length; index++) {
      const start = current[index];
      const end = current[(index + 1) % current.length];
      const edgeLength = Math.hypot(end.x - start.x, end.y - start.y);
      next.push(start);
      next.push({
        x: (start.x + end.x) / 2 + gaussian(random) * edgeLength * start.variance * 0.5,
        y: (start.y + end.y) / 2 + gaussian(random) * edgeLength * start.variance * 0.5,
        variance: start.variance * (0.8 + random() * 0.3),
      });
    }
    current = next;
  }
  return current;
}

function fillPolygon(context, points) {
  context.beginPath();
  context.moveTo(points[0].x, points[0].y);
  for (let index = 1; index < points.length; index++) context.lineTo(points[index].x, points[index].y);
  context.closePath();
  context.fill();
}

function paintWash(context, centerX, centerY, radius, color, random, { layers = 9, opacity = 0.07, squash = 0.86 } = {}) {
  const sides = 9;
  const outline = [];
  for (let side = 0; side < sides; side++) {
    const angle = (side / sides) * Math.PI * 2;
    const reach = radius * (0.8 + random() * 0.3);
    outline.push({
      x: centerX + Math.cos(angle) * reach,
      y: centerY + Math.sin(angle) * reach * squash,
      variance: 0.35 + random() * 0.35,
    });
  }
  const base = deformPolygon(outline, 2, random);
  context.fillStyle = color;
  context.globalAlpha = opacity;
  for (let layer = 0; layer < layers; layer++) fillPolygon(context, deformPolygon(base, 2, random));
  context.globalAlpha = 1;
}

function pickWeighted(weights, random) {
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  let roll = random() * total;
  for (let index = 0; index < weights.length; index++) {
    roll -= weights[index];
    if (roll <= 0) return index;
  }
  return weights.length - 1;
}

function paintClump(context, clump, colors, random) {
  const sunlit = clump.heightRatio > 0.8 || clump.sideRatio > 0.72;
  const weights = sunlit ? [0.12, 0.14, 0.24, 0.16, 0.22, 0.12] : [0.26, 0.24, 0.28, 0.1, 0.08, 0.04];
  const mainTone = pickWeighted(weights, random);

  const washCount = 3 + Math.floor(random() * 3);
  for (let wash = 0; wash < washCount; wash++) {
    const tone = random() < 0.6 ? mainTone : pickWeighted(weights, random);
    const angle = random() * Math.PI * 2;
    const offset = clump.radius * random() * 0.55;
    paintWash(
      context,
      clump.x + Math.cos(angle) * offset,
      clump.y + Math.sin(angle) * offset * 0.8,
      clump.radius * (0.45 + random() * 0.35),
      colors[tone],
      random,
    );
  }

  const shadowCount = 1 + Math.floor(random() * 2);
  for (let shadow = 0; shadow < shadowCount; shadow++) {
    paintWash(
      context,
      clump.x + (random() - 0.5) * clump.radius * 0.8,
      clump.y + random() * clump.radius * 0.45,
      clump.radius * (0.18 + random() * 0.16),
      colors[random() < 0.6 ? DEEP_GREEN : TEAL_GREEN],
      random,
      { layers: 7, opacity: 0.11 },
    );
  }

  const dabCount = 26 + Math.floor(random() * 22);
  for (let dab = 0; dab < dabCount; dab++) {
    const angle = random() * Math.PI * 2;
    const distance = clump.radius * (0.35 + random() * 0.8);
    const tone = random() < 0.55 ? (random() < 0.5 ? DEEP_GREEN : TEAL_GREEN) : random() < 0.5 ? SAGE : mainTone;
    context.globalAlpha = 0.28 + random() * 0.4;
    context.fillStyle = colors[tone];
    context.beginPath();
    context.ellipse(
      clump.x + Math.cos(angle) * distance,
      clump.y + Math.sin(angle) * distance * 0.85,
      1.2 + random() * 2.4,
      0.8 + random() * 1.4,
      random() * Math.PI,
      0,
      Math.PI * 2,
    );
    context.fill();
  }
  context.globalAlpha = 1;
}

export function createTreeRenderer(tree, palette, seed) {
  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let foliageCanvas = null;

  const applyTreeTransform = (context) => {
    const padding = 4;
    const scale = Math.min((width / 2 - padding) / tree.halfWidth, (height - padding) / tree.height);
    context.setTransform(pixelRatio * scale, 0, 0, pixelRatio * scale, (pixelRatio * width) / 2, pixelRatio * height - pixelRatio * 2);
  };

  const paintFoliage = () => {
    foliageCanvas = document.createElement("canvas");
    foliageCanvas.width = Math.round(width * pixelRatio);
    foliageCanvas.height = Math.round(height * pixelRatio);
    const context = foliageCanvas.getContext("2d");
    applyTreeTransform(context);
    const random = createSeededRandom(seed * 7919 + 1);
    const backToFront = tree.clumps.slice().sort((a, b) => b.heightRatio - a.heightRatio);
    for (const clump of backToFront) paintClump(context, clump, palette.foliage, random);
  };

  const visiblePoints = (branch, progress) => {
    if (progress <= branch.startTime) return null;
    const grown = clamp01((progress - branch.startTime) / (branch.endTime - branch.startTime));
    const segmentCount = branch.points.length - 1;
    const visibleSegments = grown * segmentCount;
    const wholeSegments = Math.floor(visibleSegments);
    const points = branch.points.slice(0, wholeSegments + 1);
    if (wholeSegments < segmentCount) {
      const [fromX, fromY] = branch.points[wholeSegments];
      const [nextX, nextY] = branch.points[wholeSegments + 1];
      const fraction = visibleSegments - wholeSegments;
      points.push([fromX + (nextX - fromX) * fraction, fromY + (nextY - fromY) * fraction]);
    }
    return points.length > 1 ? points : null;
  };

  // Opaque strokes per segment (so overlapping round caps don't darken the joints),
  // then one continuous translucent path per branch for the shaded side.
  const drawBranches = (context, progress) => {
    context.lineCap = "round";
    context.lineJoin = "round";

    for (const branch of tree.branches) {
      const points = visiblePoints(branch, progress);
      if (!points) continue;
      const segmentCount = branch.points.length - 1;
      const isTwig = branch.widthStart < 1.6;
      context.strokeStyle = isTwig ? palette.barkShadow : palette.bark;
      for (let index = 0; index < points.length - 1; index++) {
        context.lineWidth = branch.widthStart + (branch.widthEnd - branch.widthStart) * (index / segmentCount);
        context.beginPath();
        context.moveTo(points[index][0], points[index][1]);
        context.lineTo(points[index + 1][0], points[index + 1][1]);
        context.stroke();
      }
    }

    context.globalAlpha = 0.6;
    context.strokeStyle = palette.barkShadow;
    for (const branch of tree.branches) {
      if (branch.widthStart < 1.6) continue;
      const points = visiblePoints(branch, progress);
      if (!points) continue;
      const shadeOffset = branch.widthStart * 0.3;
      context.lineWidth = branch.widthStart * 0.3;
      context.beginPath();
      for (let index = 0; index < points.length; index++) {
        const previous = points[Math.max(0, index - 1)];
        const next = points[Math.min(points.length - 1, index + 1)];
        const length = Math.hypot(next[0] - previous[0], next[1] - previous[1]) || 1;
        const shadeX = ((previous[1] - next[1]) / length) * shadeOffset;
        const shadeY = ((next[0] - previous[0]) / length) * shadeOffset;
        if (index === 0) context.moveTo(points[index][0] + shadeX, points[index][1] + shadeY);
        else context.lineTo(points[index][0] + shadeX, points[index][1] + shadeY);
      }
      context.stroke();
    }
    context.globalAlpha = 1;
  };

  const drawGroundWash = (context, progress) => {
    const spread = easeOut(clamp01(progress * 5));
    if (spread <= 0) return;
    context.globalAlpha = 0.22 * spread;
    context.fillStyle = palette.foliage[LIGHT_SAGE];
    context.beginPath();
    context.ellipse(0, 1, tree.halfWidth * 0.42 * spread, 3.5, 0, 0, Math.PI * 2);
    context.fill();
    context.globalAlpha = 1;
  };

  return {
    resize(nextWidth, nextHeight, nextPixelRatio) {
      width = nextWidth;
      height = nextHeight;
      pixelRatio = nextPixelRatio;
      if (width > 0 && height > 0) paintFoliage();
    },

    draw(context, progress) {
      if (!foliageCanvas) return;
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
      applyTreeTransform(context);

      drawGroundWash(context, progress);
      drawBranches(context, progress);

      // Reveal the pre-painted foliage through a union of growing circles, one per clump.
      context.save();
      context.beginPath();
      let hasVisibleClump = false;
      for (const clump of tree.clumps) {
        const bloom = easeOut(clamp01((progress - clump.appearAt) / 0.18));
        if (bloom <= 0) continue;
        hasVisibleClump = true;
        context.moveTo(clump.x + clump.radius * 1.35 * bloom, clump.y);
        context.arc(clump.x, clump.y, clump.radius * 1.35 * bloom, 0, Math.PI * 2);
      }
      if (hasVisibleClump) {
        context.clip();
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.drawImage(foliageCanvas, 0, 0);
      }
      context.restore();
    },
  };
}
