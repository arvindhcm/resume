import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import SiteHeader from "../components/SiteHeader.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import PlayCard from "./PlayCard.jsx";
import CarouselArrowButton from "./CarouselArrowButton.jsx";
import { SECTION_HEADING_CLASS } from "../lib/typography.js";
import { useElementWidth } from "../lib/useElementWidth.js";
import resumePdf from "../assets/Arvindhcm_Designer_resume.pdf";
import chatAppSnapshot from "./assets/chatApp.gif";
import chatAppPoster from "./assets/chatAppPoster.jpg";
import cmEngineSnapshot from "./assets/cmEngine.gif";
import cmEnginePoster from "./assets/cmEnginePoster.jpg";
import easingPlaygroundSnapshot from "./assets/easingPlayground.gif";
import easingPlaygroundPoster from "./assets/easingPlaygroundPoster.jpg";

// EDIT: play items, newest first. Snapshots are 16:10; posters are their first frame.
const PLAY_ITEMS = [
  {
    title: "Transition Playground",
    description:
      "Shape a cubic-bezier curve and watch it drive a toggle, a toast, a modal and a reorder you can play with, then copy it as CSS, Tailwind or Motion.",
    // EDIT: swap for the live URL once the playground is deployed.
    href: "https://arvindhcm.github.io/easing-playground/",
    snapshot: easingPlaygroundSnapshot,
    poster: easingPlaygroundPoster,
    alt: "Cursor switching the Transition Playground from Snappy to Overshoot, dragging a curve handle into a custom shape, throwing a toast and opening a modal with it, picking Anticipate, then copying the curve as Motion code",
  },
  {
    title: "AI Engine",
    description:
      "A streaming AI chat with live web search and three personas, built on the Vercel AI SDK.",
    href: "https://cm-ai-engine.vercel.app/",
    snapshot: cmEngineSnapshot,
    poster: cmEnginePoster,
    alt: "Cursor picking the Concise persona in CM Engine, asking it to explain vector embeddings, watching the answer stream in, then toggling light and dark mode",
  },
  {
    title: "Mobile friendly Chat",
    description:
      "A chat UI with five swappable themes, from Midnight to Ember. Vibe coded with AI, design directed by me.",
    href: "https://arvindhcm.github.io/react_chatapp/",
    snapshot: chatAppSnapshot,
    poster: chatAppPoster,
    alt: "Cursor browsing the CM Chat app, opening People, then cycling through the Sky, Aqua, Forest, Ember and Midnight themes",
  },
];

// Lines the first card up with the 1120px content column while letting the
// track bleed to both viewport edges. Percentages resolve against the full-width wrapper.
const TRACK_INSET = "pl-[max(25px,calc((100%_-_1120px)/2_+_25px))]";

const SLIDE_SPRING = { type: "spring", stiffness: 260, damping: 32, mass: 0.9 };
const NO_MOTION = { duration: 0 };
const SLIVER_RATIO = 0.42;
const SNAPSHOT_ASPECT = 10 / 16;
const SWIPE_DISTANCE = 40;
const SWIPE_VELOCITY = 320;

export default function PlayPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const trackWrapperRef = useRef(null);
  const wasDraggedRef = useRef(false);
  const prefersReducedMotion = useReducedMotion();
  const viewportWidth = useElementWidth(trackWrapperRef);

  const isNarrow = viewportWidth <= 560;
  const isTouchLayout = viewportWidth < 1024;
  const gap = isNarrow ? 16 : 30;
  const focusWidth = Math.min(768, Math.round(viewportWidth * (isNarrow ? 0.72 : 0.8)));
  const sliverWidth = Math.round(focusWidth * SLIVER_RATIO);
  const cardHeight = Math.round(focusWidth * SNAPSHOT_ASPECT);
  const slideTransition = prefersReducedMotion ? NO_MOTION : SLIDE_SPRING;
  const activeItem = PLAY_ITEMS[activeIndex];

  const stepActive = useCallback(
    (direction) =>
      setActiveIndex((current) =>
        Math.min(PLAY_ITEMS.length - 1, Math.max(0, current + direction)),
      ),
    [],
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const handleCardClick = (index, event) => {
    if (wasDraggedRef.current || index !== activeIndex) event.preventDefault();
    if (wasDraggedRef.current) return;
    if (index !== activeIndex) setActiveIndex(index);
  };

  const swipeProps =
    isTouchLayout && !prefersReducedMotion
      ? {
          drag: "x",
          dragConstraints: { left: 0, right: 0 },
          dragElastic: 0.18,
          dragSnapToOrigin: true,
          onDragStart: () => {
            wasDraggedRef.current = true;
          },
          onDragEnd: (_event, { offset, velocity }) => {
            // Let the click that fires on pointer-up see the drag flag first.
            window.setTimeout(() => {
              wasDraggedRef.current = false;
            }, 300);
            if (offset.x < -SWIPE_DISTANCE || velocity.x < -SWIPE_VELOCITY) stepActive(1);
            else if (offset.x > SWIPE_DISTANCE || velocity.x > SWIPE_VELOCITY) stepActive(-1);
          },
          style: { touchAction: "pan-y" },
        }
      : {};

  return (
    <>
      <SiteHeader />

      <main className="min-h-svh pt-7 pb-[90px]">
        <section className="pointer-events-auto mx-auto max-w-[1120px] px-[25px] pt-24 max-[560px]:pt-16">
          <h1 className={SECTION_HEADING_CLASS}>Play</h1>
          <div className="mt-5 flex items-end justify-between gap-8">
            {/* EDIT: intro copy */}
            <p className="m-0 max-w-[620px] text-[15.5px] leading-[1.7] text-muted">
              Side projects, interface experiments and things I built just to
              see if they&rsquo;d feel nice to use.
            </p>
            <div className="flex shrink-0 gap-3">
              <CarouselArrowButton
                direction="prev"
                label="Previous project"
                controls="play-track"
                disabled={activeIndex === 0}
                onClick={() => stepActive(-1)}
              />
              <CarouselArrowButton
                direction="next"
                label="Next project"
                controls="play-track"
                disabled={activeIndex === PLAY_ITEMS.length - 1}
                onClick={() => stepActive(1)}
              />
            </div>
          </div>
        </section>

        <div
          ref={trackWrapperRef}
          className={`pointer-events-auto mt-14 overflow-clip max-[560px]:mt-10 ${TRACK_INSET}`}
        >
          <motion.div
            {...swipeProps}
            className={isTouchLayout ? "cursor-grab active:cursor-grabbing" : undefined}
          >
            <motion.ul
              id="play-track"
              aria-label="Play projects"
              initial={false}
              animate={{ x: -activeIndex * (sliverWidth + gap) }}
              transition={slideTransition}
              style={{ gap }}
              className="m-0 flex list-none p-0"
            >
              {PLAY_ITEMS.map((item, index) => (
                <PlayCard
                  key={item.title}
                  item={item}
                  isActive={index === activeIndex}
                  focusWidth={focusWidth}
                  sliverWidth={sliverWidth}
                  height={cardHeight}
                  transition={slideTransition}
                  onClick={(event) => handleCardClick(index, event)}
                />
              ))}
            </motion.ul>
          </motion.div>
        </div>

        <div
          aria-live="polite"
          className="pointer-events-auto mx-auto mt-5 max-w-[1120px] px-[25px]"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeItem.title}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={prefersReducedMotion ? NO_MOTION : { duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              style={{ maxWidth: focusWidth }}
            >
              <div className="flex items-baseline justify-between gap-6">
                <h2 className="m-0 text-[15.5px] font-medium text-ink">{activeItem.title}</h2>
                <a
                  href={activeItem.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor-label="Open live"
                  className="shrink-0 text-sm text-muted no-underline transition-colors hover:text-ink"
                >
                  Visit &#8599;
                </a>
              </div>
              <p className="m-0 mt-1 max-w-[560px] text-[15px] leading-[1.6] text-muted">
                {activeItem.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <SiteFooter resumeHref={resumePdf} isPinned={false} />
    </>
  );
}
