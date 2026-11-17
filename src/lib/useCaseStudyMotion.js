const EASE_OUT = [0.22, 1, 0.36, 1];

export function useCaseStudyMotion(scrollContainerRef) {
  const viewport = { root: scrollContainerRef, once: true, amount: 0.15 };
  const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport,
    transition: { duration: 0.68, ease: EASE_OUT },
  };

  return {
    fadeUp,
    mediaFadeUp: { ...fadeUp, initial: { opacity: 0, y: 48 } },
    // The trigger lives on the clipping wrapper: the translated text itself
    // sits outside its overflow-hidden mask, so it never registers as in view.
    headingMask: { initial: "hidden", whileInView: "visible", viewport },
    headingRise: {
      variants: { hidden: { y: "110%" }, visible: { y: 0 } },
      transition: { duration: 0.68, ease: EASE_OUT },
    },
    dividerGrow: {
      initial: { scaleX: 0 },
      whileInView: { scaleX: 1 },
      viewport,
      transition: { duration: 0.9, ease: EASE_OUT },
    },
  };
}
