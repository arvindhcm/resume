import { useEffect } from "react";
import SiteHeader from "../components/SiteHeader.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import PlayCard from "./PlayCard.jsx";
import CarouselArrowButton from "./CarouselArrowButton.jsx";
import { SECTION_HEADING_CLASS } from "../lib/typography.js";
import { useHorizontalScroller } from "../lib/useHorizontalScroller.js";
import resumePdf from "../assets/Arvindhcm_Designer_resume.pdf";
import chatAppSnapshot from "./assets/chatApp.gif";
import cmEngineSnapshot from "./assets/cmEngine.gif";

// EDIT: play items, newest first. Snapshots are 16:10.
const PLAY_ITEMS = [
  {
    title: "CM Engine",
    description:
      "A streaming AI chat with live web search and three personas, built on the Vercel AI SDK.",
    href: "https://cm-ai-engine.vercel.app/",
    snapshot: cmEngineSnapshot,
    alt: "Cursor picking the Concise persona in CM Engine, asking it to explain vector embeddings, watching the answer stream in, then toggling light and dark mode",
  },
  {
    title: "CM Chat",
    description:
      "A chat UI with five swappable themes, from Midnight to Ember. Vibe coded with AI, design directed by me.",
    href: "https://arvindhcm.github.io/react_chatapp/",
    snapshot: chatAppSnapshot,
    alt: "Cursor browsing the CM Chat app, opening People, then cycling through the Sky, Aqua, Forest, Ember and Midnight themes",
  },
];

// Lines the first card up with the 1120px content column while letting the
// track bleed to both viewport edges. Percentages resolve against the full-width track.
const TRACK_INSET =
  "px-[max(25px,calc((100%_-_1120px)/2_+_25px))] scroll-px-[max(25px,calc((100%_-_1120px)/2_+_25px))]";

export default function PlayPage() {
  const { scrollerRef, canScrollPrev, canScrollNext, scrollToAdjacentItem } =
    useHorizontalScroller();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

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
                disabled={!canScrollPrev}
                onClick={() => scrollToAdjacentItem(-1)}
              />
              <CarouselArrowButton
                direction="next"
                label="Next project"
                controls="play-track"
                disabled={!canScrollNext}
                onClick={() => scrollToAdjacentItem(1)}
              />
            </div>
          </div>
        </section>

        <ul
          id="play-track"
          ref={scrollerRef}
          aria-label="Play projects"
          className={`pointer-events-auto relative m-0 mt-14 flex list-none snap-x snap-mandatory gap-[30px] overflow-x-auto py-0 [scrollbar-width:none] max-[560px]:mt-10 max-[560px]:gap-4 [&::-webkit-scrollbar]:hidden ${TRACK_INSET}`}
        >
          {PLAY_ITEMS.map((item) => (
            <li
              key={item.title}
              className="w-[min(768px,80vw)] shrink-0 snap-start"
            >
              <PlayCard item={item} />
            </li>
          ))}
        </ul>
      </main>

      <SiteFooter resumeHref={resumePdf} />
    </>
  );
}

