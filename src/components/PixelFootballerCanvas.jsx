import { useEffect, useRef } from "react";
import { PixelFootballer } from "../lib/pixelFootballer.js";
import { readCssColor } from "../lib/cssTokens.js";
import footballerSprite from "./assets/footballer.png";

const CANVAS_HEIGHT = 150;
const currentPixelRatio = () => Math.min(2, window.devicePixelRatio || 1);

const readBallPalette = () => ({
  K: readCssColor("--ink", "#0D0D0D"),
  W: readCssColor("--surface", "#FFFFFE"),
});

const loadImage = (source) => {
  const image = new Image();
  image.src = source;
  return image;
};

export default function PixelFootballerCanvas({ sceneRef, treeRef, pileRef, isCompact }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const scene = sceneRef.current;
    const canvas = canvasRef.current;
    if (!scene || !canvas) return;
    const footballer = new PixelFootballer({
      playerImage: loadImage(footballerSprite),
      palette: readBallPalette(),
      pixelSize: isCompact ? 1.5 : 2,
      ballPixelSize: isCompact ? 2 : 2.5,
    });
    let sceneHeight = 0;
    let isVisible = false;

    // The player stays left of the tree trunk so they never run under the links column.
    const measure = () => {
      const sceneRect = scene.getBoundingClientRect();
      const treeRect = treeRef.current?.getBoundingClientRect();
      const fieldEnd = treeRect
        ? treeRect.left + treeRect.width / 2 - sceneRect.left
        : sceneRect.width;
      sceneHeight = sceneRect.height;
      const pixelRatio = currentPixelRatio();
      canvas.width = Math.round(sceneRect.width * pixelRatio);
      canvas.height = Math.round(CANVAS_HEIGHT * pixelRatio);
      footballer.resize({ fieldStart: 0, fieldEnd, groundY: sceneRect.height - 1 });
    };
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(scene);

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    visibilityObserver.observe(canvas);

    let frame = 0;
    let lastTime = performance.now();
    const tick = (now) => {
      const deltaSeconds = Math.min(0.033, (now - lastTime) / 1000);
      lastTime = now;
      if (isVisible) {
        footballer.step(deltaSeconds, pileRef.current);
        footballer.draw(canvas.getContext("2d"), currentPixelRatio(), CANVAS_HEIGHT - sceneHeight);
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, [isCompact]);

  return (
    // h-[150px] must equal CANVAS_HEIGHT.
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[150px] w-full"
    />
  );
}
