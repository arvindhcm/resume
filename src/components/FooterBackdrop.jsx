import { useEffect, useRef, useState } from "react";
import { motion, useAnimationControls, useReducedMotion } from "framer-motion";
import WatercolorTree from "./WatercolorTree.jsx";
import LeafPileCanvas from "./LeafPileCanvas.jsx";
import { PAGE_LOADER_DURATION } from "./PageLoader.jsx";
import { readCssColor, readLeafColors } from "../lib/cssTokens.js";
import { useIsCompact } from "../lib/useIsCompact.js";

const LEAF_COUNT = 170;
const TREE_SHAKE_DROP = 9;
const MAX_EXTRA_LEAVES = 90;

// SiteFooter reserves an empty slot with these same classes so its text and
// links land in the right places once the page is scrolled to the bottom.
export const SCENE_HEIGHT_CLASS = { compact: "h-[220px]", wide: "h-[352px]" };
export const SCENE_GUTTER_CLASS = { compact: "px-5", wide: "px-[25px]" };
export const SCENE_BOTTOM_ROW_CLASS = "mt-[18px] h-7";
export const ELSEWHERE_WIDTH_CLASS = "w-[180px]";

export default function FooterBackdrop({ isInteractive }) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const treeRef = useRef(null);
  const pileRef = useRef(null);
  const treeShake = useAnimationControls();
  const prefersReducedMotion = useReducedMotion();
  const isCompact = useIsCompact(containerRef);

  const [shouldGrowTree, setShouldGrowTree] = useState(false);
  const [hasTossed, setHasTossed] = useState(false);
  const [leafColors] = useState(readLeafColors);
  const [leafVeinColor] = useState(() =>
    readCssColor("--leaf-vein", "rgba(28, 44, 36, 0.24)"),
  );

  useEffect(() => {
    // Hold the growth until the PageLoader (which grows its own tree) has faded out.
    const timer = setTimeout(
      () => setShouldGrowTree(true),
      Math.max(0, PAGE_LOADER_DURATION - performance.now()),
    );
    return () => clearTimeout(timer);
  }, []);

  const layout = isCompact ? "compact" : "wide";

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

  const isHintVisible = isInteractive && !hasTossed;

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 bg-linear-to-b from-surface to-bg">
      <div ref={containerRef} className="absolute inset-x-0 bottom-0">
        <div
          className={`relative mx-auto w-full max-w-[1120px] pb-10 ${SCENE_GUTTER_CLASS[layout]}`}
        >
          <div ref={sceneRef} className={`relative ${SCENE_HEIGHT_CLASS[layout]}`}>
            <motion.div
              ref={treeRef}
              aria-hidden="true"
              animate={treeShake}
              onClick={shakeTree}
              className={`absolute bottom-0.5 z-[1] origin-bottom ${
                isCompact
                  ? "right-0 h-[210px] w-[230px]"
                  : "right-[208px] h-[350px] w-[390px]"
              } ${isInteractive ? "pointer-events-auto cursor-pointer" : ""}`}
            >
              <WatercolorTree
                shouldGrow={shouldGrowTree}
                instant={prefersReducedMotion}
              />
            </motion.div>

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
              isInteractive={isInteractive}
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
          <div className={SCENE_BOTTOM_ROW_CLASS} />
        </div>
      </div>
    </div>
  );
}
