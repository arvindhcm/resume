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
import { readCssColor, readLeafColors } from "../lib/cssTokens.js";

// EDIT: footer copy and links
const HEADLINE = "Let's make something thoughtful together.";
const EMAIL = "arvindhcm7@gmail.com";
const LINKS = [
  { label: "LinkedIn", href: "https://linkedin.com/in/arvindhcm" },
  { label: "📞 +91 6384769554", href: "tel:+916384769554" },
];
const SIGNOFF = "Built by hand";

const LEAF_COUNT = 170;
const TREE_SHAKE_DROP = 9;
const MAX_EXTRA_LEAVES = 90;
const REVEAL_EASE = [0.22, 1, 0.36, 1];

export default function SiteFooter({ resumeHref }) {
  const footerRef = useRef(null);
  const sceneRef = useRef(null);
  const treeRef = useRef(null);
  const pileRef = useRef(null);
  const treeShake = useAnimationControls();
  const prefersReducedMotion = useReducedMotion();

  const isFooterVisible = useInView(footerRef, { once: true, amount: 0.15 });
  const isSceneNear = useInView(sceneRef, { once: true, margin: "300px 0px" });
  const isSceneOnScreen = useInView(sceneRef, { margin: "240px 0px" });
  const isTreeVisible = useInView(treeRef, { once: true, amount: 0.3 });

  const [isCompact, setIsCompact] = useState(false);
  const [hasTossed, setHasTossed] = useState(false);
  const [hasCopiedEmail, setHasCopiedEmail] = useState(false);
  const [leafColors] = useState(readLeafColors);
  const [leafVeinColor] = useState(() =>
    readCssColor("--leaf-vein", "rgba(28, 44, 36, 0.24)"),
  );

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) =>
      setIsCompact(entry.contentRect.width < 720),
    );
    observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  const pileCenter = isCompact ? 0.28 : 0.2;

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
    initial: prefersReducedMotion ? false : { opacity: 0, y: 14 },
    animate: isFooterVisible ? { opacity: 1, y: 0 } : undefined,
    transition: {
      duration: 0.8,
      ease: REVEAL_EASE,
      delay: 0.05 + order * 0.08,
    },
  });

  const elsewhere = (
    <motion.div
      {...reveal(2)}
      className={`relative z-[4] flex min-w-[160px] flex-col gap-2 ${isCompact ? "" : "pb-[18px]"}`}
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
    <footer ref={footerRef} className="site-footer pointer-events-auto">
      <div
        className={`relative mx-auto w-full max-w-[1120px] text-ink ${
          isCompact
            ? "px-5 pt-20 pb-0"
            : "px-[25px] pt-[clamp(96px,14vh,140px)] pb-0"
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
              className="m-0 max-w-[18em] text-[min(34px,7vw)] leading-[1.15] font-medium tracking-[-0.02em]"
            >
              {HEADLINE}
            </motion.h2>

            <motion.div
              {...reveal(1)}
              className="relative mt-[18px] inline-block"
            >
              <motion.a
                href={`mailto:${EMAIL}`}
                onClick={copyEmail}
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
              className={`relative z-[1] mb-0.5 shrink-0 origin-bottom cursor-pointer ${
                isCompact ? "h-[210px] w-[230px]" : "h-[350px] w-[390px]"
              }`}
            >
              {(isSceneNear || prefersReducedMotion) && (
                <WatercolorTree
                  shouldGrow={isTreeVisible}
                  instant={prefersReducedMotion}
                />
              )}
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
            pileCenter={pileCenter}
            isCompact={isCompact}
            isActive={isSceneOnScreen}
            autoDrop={!prefersReducedMotion}
            onToss={() => setHasTossed(true)}
            onTreeHit={shakeTree}
          />

          <motion.button
            type="button"
            onClick={tossFromHint}
            initial={{ opacity: 0 }}
            animate={{ opacity: hasTossed ? 0 : isFooterVisible ? 1 : 0 }}
            transition={{ duration: 0.6, delay: hasTossed ? 0 : 1.4 }}
            className={`absolute z-[4] cursor-pointer whitespace-nowrap border-0 bg-transparent p-0 font-['Lora'] text-[15px] italic text-muted ${
              hasTossed ? "pointer-events-none" : ""
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

        <div className="mt-[18px] flex flex-wrap items-center justify-between gap-3 text-xs text-muted">
          <span>{/* © {new Date().getFullYear()} · {SIGNOFF} */}</span>
          <button
            type="button"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion ? "auto" : "smooth",
              })
            }
            className="cursor-pointer rounded border-0 bg-ink/[0.06] px-[9px] py-1.5 text-[10.5px] tracking-[0.06em] text-ink"
          >
            TOP ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
