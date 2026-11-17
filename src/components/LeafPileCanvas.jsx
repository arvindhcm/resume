import { useEffect, useRef } from "react";
import { LeafPile, LEAF_SKY_HEIGHT } from "../lib/leafPile.js";

const MAX_EXTRA_LEAVES = 90;
const currentPixelRatio = () => Math.min(2, window.devicePixelRatio || 1);

export default function LeafPileCanvas({
  sceneRef,
  treeRef,
  pileRef,
  colors,
  veinColor,
  count,
  pileCenter,
  isCompact,
  isActive,
  isInteractive = true,
  autoDrop,
  onToss,
  onTreeHit,
}) {
  const canvasRef = useRef(null);
  const hitAreaRef = useRef(null);
  const lastPointerRef = useRef({ x: 0, time: 0 });
  const callbacksRef = useRef({ onToss, onTreeHit });
  callbacksRef.current = { onToss, onTreeHit };

  const getTreeRect = () => {
    const scene = sceneRef.current;
    const treeElement = treeRef.current;
    if (!scene || !treeElement) return null;
    const sceneRect = scene.getBoundingClientRect();
    const treeRect = treeElement.getBoundingClientRect();
    return {
      x: treeRect.left - sceneRect.left,
      y: treeRect.top - sceneRect.top,
      width: treeRect.width,
      height: treeRect.height,
    };
  };

  const toScenePoint = (event) => {
    const sceneRect = sceneRef.current.getBoundingClientRect();
    return { x: event.clientX - sceneRect.left, y: event.clientY - sceneRect.top };
  };

  const isOverTree = (point) => {
    const rect = getTreeRect();
    return (
      !!rect &&
      point.x > rect.x + rect.width * 0.15 &&
      point.x < rect.x + rect.width * 0.85 &&
      point.y > rect.y &&
      point.y < rect.y + rect.height
    );
  };

  useEffect(() => {
    const pile = new LeafPile({ colors, count, pileCenter, veinColor });
    pileRef.current = pile;
    const canvas = canvasRef.current;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const pixelRatio = currentPixelRatio();
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round((height + LEAF_SKY_HEIGHT) * pixelRatio);
      pile.resize(width, height);
      pile.draw(canvas.getContext("2d"), pixelRatio);
    });
    observer.observe(sceneRef.current);
    return () => {
      observer.disconnect();
      pileRef.current = null;
    };
  }, [colors.join(), veinColor, count, pileCenter]);

  useEffect(() => {
    if (!isActive) return;
    let frame = 0;
    let lastTime = performance.now();
    let nextDropAt = lastTime + 1800;

    const tick = (now) => {
      const pile = pileRef.current;
      const canvas = canvasRef.current;
      if (pile && canvas) {
        const deltaSeconds = Math.min(0.033, (now - lastTime) / 1000);
        if (autoDrop && now > nextDropAt) {
          nextDropAt = now + 2600 + Math.random() * 3200;
          const treeRect = getTreeRect();
          if (treeRect) pile.dropFrom(treeRect, 1, pile.count + MAX_EXTRA_LEAVES);
        }
        pile.step(deltaSeconds);
        if (pile.needsDraw) pile.draw(canvas.getContext("2d"), currentPixelRatio());
      }
      lastTime = now;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isActive, autoDrop]);

  const handlePointerDown = (event) => {
    const pile = pileRef.current;
    if (!pile) return;
    const point = toScenePoint(event);
    const tossedCount = pile.toss(point.x, point.y);
    if (tossedCount) callbacksRef.current.onToss();
    else if (isOverTree(point)) callbacksRef.current.onTreeHit();
  };

  const handlePointerMove = (event) => {
    const pile = pileRef.current;
    if (!pile || event.pointerType !== "mouse") return;
    const point = toScenePoint(event);
    const isNearLeaves = pile.distanceToNearestRestingLeaf(point.x, point.y) < 36;
    hitAreaRef.current.style.cursor = isNearLeaves || isOverTree(point) ? "pointer" : "default";

    const now = performance.now();
    const movementX = point.x - lastPointerRef.current.x;
    const isSwiping = Math.abs(movementX) / Math.max(1, now - lastPointerRef.current.time) > 0.6;
    if (isNearLeaves && isSwiping) pile.rustle(point.x, point.y, movementX);
    lastPointerRef.current = { x: point.x, time: now };
  };

  return (
    <>
      {/* -top / extra height must equal LEAF_SKY_HEIGHT so tossed leaves can fly above the scene. */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 -top-[220px] z-[5] h-[calc(100%+220px)] w-full"
      />
      <div
        ref={hitAreaRef}
        aria-hidden="true"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        className={`absolute inset-x-0 bottom-0 z-[3] [-webkit-tap-highlight-color:transparent] ${
          isCompact ? "h-[120px]" : "h-[150px]"
        } ${isInteractive ? "pointer-events-auto" : "pointer-events-none"}`}
      />
    </>
  );
}
