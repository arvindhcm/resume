import { useCallback, useEffect, useRef, useState } from "react";

export function useHorizontalScroller() {
  const scrollerRef = useRef(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return undefined;

    const updateEdges = () => {
      const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth;
      setCanScrollPrev(scroller.scrollLeft > 1);
      setCanScrollNext(scroller.scrollLeft < maxScrollLeft - 1);
    };

    updateEdges();
    scroller.addEventListener("scroll", updateEdges, { passive: true });
    const resizeObserver = new ResizeObserver(updateEdges);
    resizeObserver.observe(scroller);
    return () => {
      scroller.removeEventListener("scroll", updateEdges);
      resizeObserver.disconnect();
    };
  }, []);

  const scrollToAdjacentItem = useCallback((direction) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    // The first item rests at the track's inline padding, so measuring from it
    // gives each item's snap position without parsing scroll-padding (which
    // computes to an unresolved max()/calc() string).
    const items = [...scroller.children];
    const inset = items[0]?.offsetLeft ?? 0;
    const snapOffsets = items.map((item) => item.offsetLeft - inset);
    const current = scroller.scrollLeft;
    const target =
      direction > 0
        ? snapOffsets.find((offset) => offset > current + 1)
        : snapOffsets.findLast((offset) => offset < current - 1);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    scroller.scrollTo({
      left: target ?? (direction > 0 ? scroller.scrollWidth : 0),
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, []);

  return { scrollerRef, canScrollPrev, canScrollNext, scrollToAdjacentItem };
}
