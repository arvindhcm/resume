import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useInView,
  useReducedMotion,
} from "framer-motion";
import WatercolorTree from "./WatercolorTree.jsx";
import LeafPileCanvas from "./LeafPileCanvas.jsx";
import { PAGE_LOADER_DURATION } from "./PageLoader.jsx";
import { readCssColor, readLeafColors } from "../lib/cssTokens.js";
import { useIsCompact } from "../lib/useIsCompact.js";

// EDIT: footer copy and links
const HEADLINE = "Let's make something thoughtful together.";
const EMAIL = "arvindhcm7@gmail.com";
const LINKS = [
  { label: "LinkedIn", href: "https://linkedin.com/in/arvindhcm" },
  { label: "+91 6384769554", href: "tel:+916384769554" },
];
const SIGNOFF = "Built by hand";

const LEAF_COUNT = 170;
const TREE_SHAKE_DROP = 9;
const MAX_EXTRA_LEAVES = 90;
const REVEAL_EASE = [0.22, 1, 0.36, 1];
const REVEAL_VISIBLE_SHARE = 0.8;

/*
  The whole footer (tree, leaf pile, copy, links) is pinned to the bottom of
  the viewport behind the page, like a backdrop. An empty in-flow spacer of
  the same height gives the page room to scroll; once most of that spacer is
  on screen the copy fades in and the scene becomes interactive.
*/
export default function SiteFooter({ resumeHref }) {
  const spacerRef = useRef(null);
  const layerRef = useRef(null);
  const sceneRef = useRef(null);
  const treeRef = useRef(null);
  const pileRef = useRef(null);
  const treeShake = useAnimationControls();
  const prefersReducedMotion = useReducedMotion();
  const isCompact = useIsCompact(layerRef);

  const [layerHeight, setLayerHeight] = useState(0);
  const [shouldGrowTree, setShouldGrowTree] = useState(false);
  const [hasTossed, setHasTossed] = useState(false);
  const [hasCopiedEmail, setHasCopiedEmail] = useState(false);
  const [leafColors] = useState(readLeafColors);
  const [leafVeinColor] = useState(() =>
    readCssColor("--leaf-vein", "rgba(28, 44, 36, 0.24)"),
  );

  // On short viewports the spacer can be taller than the screen, so the
  // required visible share is capped to what can actually fit.
  const revealAmount = Math.min(
    REVEAL_VISIBLE_SHARE,
    (window.innerHeight * 0.9) / Math.max(1, layerHeight),
  );
  const isRevealed = useInView(spacerRef, { amount: revealAmount });

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) =>
      setLayerHeight(entry.borderBoxSize[0].blockSize),
    );
    observer.observe(layerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Hold the growth until the PageLoader (which grows its own tree) has faded out.
    const timer = setTimeout(
      () => setShouldGrowTree(true),
      Math.max(0, PAGE_LOADER_DURATION - performance.now()),
    );
    return () => clearTimeout(timer);
  }, []);

  const shakeTree = () => {
    treeShake.start({
      rotate: [0, -2.2, 1.8, -1.1, 0.5, 0],
      transition: { duration: 0.9, ease: "easeOut" },
    });
    const pile = pileRef.current;
    const scene = sceneRef.current;
    const treeElement = treeRef.current;
    if (!pile || !scene || !treeElement) return;
    const sceneRect = scene.getBoundingClientRect();
    const treeRect = treeElement.getBoundingClientRect();
    pile.dropFrom(
      {
        x: treeRect.left - sceneRect.left,
        y: treeRect.top - sceneRect.top,
        width: treeRect.width,
        height: treeRect.height,
      },
      TREE_SHAKE_DROP,
      pile.count + MAX_EXTRA_LEAVES,
    );
  };

  const tossFromHint = () => {
    const pile = pileRef.current;
    if (!pile) return;
    pile.toss(pile.pileX, pile.surfaceAt(pile.pileX), 1.15);
    setHasTossed(true);
  };

  const copyEmail = async (event) => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      event.preventDefault();
      setHasCopiedEmail(true);
      setTimeout(() => setHasCopiedEmail(false), 1800);
    } catch {
      // Clipboard blocked: fall through to the mailto link.
    }
  };

  const reveal = (order) => ({
    initial: { opacity: 0, y: prefersReducedMotion ? 0 : 14 },
    animate: isRevealed
      ? { opacity: 1, y: 0 }
      : { opacity: 0, y: prefersReducedMotion ? 0 : 14 },
    transition: prefersReducedMotion
      ? { duration: 0 }
      : isRevealed
        ? { duration: 0.8, ease: REVEAL_EASE, delay: 0.05 + order * 0.08 }
        : { duration: 0.25, ease: "easeOut" },
  });

  const interactiveClass = isRevealed ? "pointer-events-auto" : "";
  const isHintVisible = isRevealed && !hasTossed;

  const elsewhere = (
    <motion.div
      {...reveal(2)}
      className={`relative z-[4] flex min-w-[160px] flex-col gap-2 ${interactiveClass} ${isCompact ? "" : "pb-[18px]"}`}
    >
      <span className="text-[10px] font-medium tracking-[0.14em] text-muted">
        ELSEWHERE
      </span>
      {LINKS.map((link) => (
        <motion.a
          key={link.label}
          href={link.href}
          target={link.href.startsWith("http") ? "_blank" : undefined}
          rel="noreferrer"
          tabIndex={isRevealed ? undefined : -1}
          whileHover={{ x: 4 }}
          className="flex justify-between gap-6 border-b border-border-strong pb-1.5 text-sm text-ink"
        >
          {link.label}
          <span className="text-muted">↗</span>
        </motion.a>
      ))}
      {resumeHref && (
        <motion.a
          href={resumeHref}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={isRevealed ? undefined : -1}
          whileHover={{ x: 4 }}
          className="flex justify-between gap-6 border-b border-border-strong pb-1.5 text-sm text-ink"
        >
          Resume
          <span className="text-muted">↗</span>
        </motion.a>
      )}
    </motion.div>
  );

  return (
    <footer id="contact">
      <div ref={spacerRef} aria-hidden="true" style={{ height: layerHeight }} />

      <div className="pointer-events-none fixed inset-0 -z-10 bg-linear-to-b from-surface to-bg">
        <div
          ref={layerRef}
          aria-hidden={!isRevealed}
          className="absolute inset-x-0 bottom-0 pb-10"
        >
          <div
            className={`relative mx-auto w-full max-w-[1120px] text-ink ${
              isCompact ? "px-5 pt-20" : "px-[25px] pt-[clamp(96px,14vh,140px)]"
            }`}
          >
            <div
              ref={sceneRef}
              className={`relative grid items-end gap-x-[4vw] ${isCompact ? "grid-cols-1" : "grid-cols-[minmax(0,1fr)_auto]"}`}
            >
              <div
                className={`relative z-[4] self-start ${isCompact ? "" : "pb-[150px]"}`}
              >
                <motion.h2
                  {...reveal(0)}
                  className={`m-0 max-w-[18em] text-[min(34px,7vw)] leading-[1.15] font-medium tracking-[-0.02em] ${interactiveClass}`}
                >
                  {HEADLINE}
                </motion.h2>

                <motion.div
                  {...reveal(1)}
                  className={`relative mt-[18px] inline-block ${interactiveClass}`}
                >
                  <motion.a
                    href={`mailto:${EMAIL}`}
                    onClick={copyEmail}
                    tabIndex={isRevealed ? undefined : -1}
                    whileHover={{ x: 4 }}
                    title="Click to copy"
                    className={`relative inline-flex items-center gap-2 font-['Lora'] italic text-ink ${
                      isCompact ? "text-[22px]" : "text-[26px]"
                    }`}
                  >
                    {EMAIL}
                    <span className="font-sans text-[11px] not-italic text-muted">
                      ↗
                    </span>
                    <span
                      aria-hidden="true"
                      className="absolute right-5 bottom-px left-0 h-px bg-ink opacity-25"
                    />
                  </motion.a>
                  <AnimatePresence>
                    {hasCopiedEmail && (
                      <motion.span
                        role="status"
                        initial={{ opacity: 0, scale: 1.8, rotate: -16 }}
                        animate={{ opacity: 1, scale: 1, rotate: -8 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 420, damping: 16 }}
                        className="absolute -top-5 -right-3 rounded-[3px] border-[1.5px] border-accent bg-surface/90 px-[7px] py-[3px] text-[9.5px] font-semibold tracking-[0.14em] text-accent-ink"
                      >
                        COPIED
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>

                {isCompact && <div className="mt-7">{elsewhere}</div>}
              </div>

              <div
                className={`flex items-end justify-end gap-7 ${isCompact ? "mt-2" : ""}`}
              >
                <motion.div
                  ref={treeRef}
                  aria-hidden="true"
                  animate={treeShake}
                  onClick={shakeTree}
                  className={`relative z-[1] mb-0.5 shrink-0 origin-bottom ${
                    isCompact ? "h-[210px] w-[230px]" : "h-[350px] w-[390px]"
                  } ${isRevealed ? "pointer-events-auto cursor-pointer" : ""}`}
                >
                  <WatercolorTree
                    shouldGrow={shouldGrowTree}
                    instant={prefersReducedMotion}
                  />
                </motion.div>
                {!isCompact && elsewhere}
              </div>

              <LeafPileCanvas
                sceneRef={sceneRef}
                treeRef={treeRef}
                pileRef={pileRef}
                colors={leafColors}
                veinColor={leafVeinColor}
                count={isCompact ? Math.round(LEAF_COUNT * 0.6) : LEAF_COUNT}
                pileCenter={isCompact ? 0.28 : 0.2}
                isCompact={isCompact}
                isActive
                isInteractive={isRevealed}
                autoDrop={!prefersReducedMotion}
                onToss={() => setHasTossed(true)}
                onTreeHit={shakeTree}
              />

              <motion.button
                type="button"
                onClick={tossFromHint}
                tabIndex={isHintVisible ? 0 : -1}
                aria-hidden={!isHintVisible}
                initial={{ opacity: 0 }}
                animate={{ opacity: isHintVisible ? 1 : 0 }}
                transition={{ duration: 0.6, delay: isHintVisible ? 0.6 : 0 }}
                className={`absolute z-[4] cursor-pointer whitespace-nowrap border-0 bg-transparent p-0 font-['Lora'] text-[15px] italic text-muted ${
                  isHintVisible ? "pointer-events-auto" : ""
                } ${isCompact ? "bottom-[66px] left-[calc(28%-46px)]" : "bottom-[42px] left-[calc(20%+104px)]"}`}
              >
                {isCompact ? "↙" : "↖"} toss the leaves
              </motion.button>

              <svg
                viewBox="0 0 1000 8"
                preserveAspectRatio="none"
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 -bottom-1 z-[6] h-2 w-full"
              >
                <path
                  d="M0 5 C 140 3.2, 250 6.2, 410 4.4 S 690 3.2, 830 5.1 S 950 4.1, 1000 4.6"
                  fill="none"
                  className="stroke-ink"
                  strokeOpacity={0.5}
                  strokeWidth={1.3}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>

            <motion.div
              {...reveal(3)}
              className="mt-[18px] flex flex-wrap items-center justify-between gap-3 text-xs text-muted"
            >
              <span>{/* © {new Date().getFullYear()} · {SIGNOFF} */}</span>
              <button
                type="button"
                tabIndex={isRevealed ? undefined : -1}
                onClick={() =>
                  window.scrollTo({
                    top: 0,
                    behavior: prefersReducedMotion ? "auto" : "smooth",
                  })
                }
                className={`cursor-pointer rounded border-0 bg-ink/[0.06] px-[9px] py-1.5 text-[10.5px] tracking-[0.06em] text-ink ${interactiveClass}`}
              >
                TOP ↑
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
}
