import { useEffect, useMemo, useRef } from "react";
import { growTree, createTreeRenderer } from "../lib/growTree.js";
import { readCssColor, readLeafColors } from "../lib/cssTokens.js";

export default function WatercolorTree({ seed = 35, shouldGrow, instant, growDuration = 3600 }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const progressRef = useRef(0);
  const tree = useMemo(() => growTree(seed), [seed]);

  const paint = () => {
    const canvas = canvasRef.current;
    if (canvas && rendererRef.current) rendererRef.current.draw(canvas.getContext("2d"), progressRef.current);
  };

  useEffect(() => {
    rendererRef.current = createTreeRenderer(
      tree,
      {
        bark: readCssColor("--bark", "#8A7258"),
        barkShadow: readCssColor("--bark-shadow", "#3F3B36"),
        foliage: readLeafColors(),
      },
      seed,
    );
    const canvas = canvasRef.current;
    const observer = new ResizeObserver(([entry]) => {
      const pixelRatio = Math.min(2, window.devicePixelRatio || 1);
      const { width, height } = entry.contentRect;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      rendererRef.current.resize(width, height, pixelRatio);
      paint();
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [tree, seed]);

  useEffect(() => {
    if (instant) {
      progressRef.current = 1;
      paint();
      return;
    }
    if (!shouldGrow) return;

    let frame = 0;
    const startedAt = performance.now();
    const tick = (now) => {
      const elapsed = Math.min(1, (now - startedAt) / growDuration);
      progressRef.current = 1 - Math.pow(1 - elapsed, 2.2);
      paint();
      if (elapsed < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [shouldGrow, instant, tree, growDuration]);

  return (
    <div ref={containerRef} className="relative h-full w-full">
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 block h-full w-full mix-blend-multiply"
      />
    </div>
  );
}
