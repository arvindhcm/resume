import { useEffect, useState } from "react";
import WatercolorTree from "./WatercolorTree.jsx";

const REVEAL_DELAY = 80;
const GROW_DURATION = 1700;
const HOLD_DURATION = GROW_DURATION + 400;
const EXIT_DURATION = 500;

export default function PageLoader() {
  const [phase, setPhase] = useState("enter");
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMounted(false);
      return;
    }

    const revealTimer = setTimeout(() => setPhase("reveal"), REVEAL_DELAY);
    const exitTimer = setTimeout(
      () => setPhase("exit"),
      REVEAL_DELAY + HOLD_DURATION,
    );
    const unmountTimer = setTimeout(
      () => setMounted(false),
      REVEAL_DELAY + HOLD_DURATION + EXIT_DURATION,
    );

    return () => {
      clearTimeout(revealTimer);
      clearTimeout(exitTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-[999] flex flex-col items-center justify-center gap-6 bg-bg transition-opacity duration-[500ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
        phase === "exit" ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="h-[230px] w-[260px]">
        <WatercolorTree shouldGrow={phase !== "enter"} growDuration={GROW_DURATION} />
      </div>
      <div className="relative overflow-hidden">
        <span
          className={`block text-[13px] font-semibold uppercase tracking-[0.3em] text-ink-soft transition-transform duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
            phase === "enter" ? "translate-y-full" : "translate-y-0"
          }`}
        >
          Arvindh C M
        </span>
      </div>
    </div>
  );
}
