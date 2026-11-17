import { useEffect, useState } from "react";

const ITEM_HEIGHT_PX = 18;
const ITEM_GAP_PX = 10;
const SCROLL_OFFSET_PX = 48;

export default function CaseStudySectionNav({ sections, scrollContainerRef }) {
  const [activeSectionId, setActiveSectionId] = useState(sections[0]?.id);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return undefined;

    let frameId = 0;
    const updateActiveSection = () => {
      frameId = 0;
      const containerTop = scrollContainer.getBoundingClientRect().top;
      // A section becomes active once its top crosses ~35% of the viewport,
      // so short sections still get highlighted before they scroll past.
      const activationLine = containerTop + scrollContainer.clientHeight * 0.35;
      const reachedBottom =
        scrollContainer.scrollTop + scrollContainer.clientHeight >=
        scrollContainer.scrollHeight - 4;

      let currentId = sections[0]?.id;
      if (reachedBottom) {
        currentId = sections[sections.length - 1]?.id;
      } else {
        for (const section of sections) {
          const element = document.getElementById(section.id);
          if (element && element.getBoundingClientRect().top <= activationLine) {
            currentId = section.id;
          }
        }
      }
      setActiveSectionId(currentId);
    };

    const onScroll = () => {
      if (!frameId) frameId = requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    scrollContainer.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      scrollContainer.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [sections, scrollContainerRef]);

  const scrollToSection = (sectionId) => {
    const scrollContainer = scrollContainerRef.current;
    const element = document.getElementById(sectionId);
    if (!scrollContainer || !element) return;
    const targetTop =
      element.getBoundingClientRect().top -
      scrollContainer.getBoundingClientRect().top +
      scrollContainer.scrollTop -
      SCROLL_OFFSET_PX;
    scrollContainer.scrollTo({ top: targetTop, behavior: "smooth" });
  };

  const activeIndex = Math.max(
    0,
    sections.findIndex((section) => section.id === activeSectionId),
  );

  return (
    <nav
      aria-label="Case study sections"
      className="relative flex flex-col items-start gap-[10px]"
    >
      <span
        aria-hidden="true"
        className="absolute top-[2px] left-0 h-[14px] w-px bg-cs-fg transition-transform duration-[420ms] ease-cs-out"
        style={{
          transform: `translateY(${activeIndex * (ITEM_HEIGHT_PX + ITEM_GAP_PX)}px)`,
        }}
      />
      {sections.map((section) => {
        const isActive = section.id === activeSectionId;
        return (
          <div
            key={section.id}
            className="flex h-[18px] items-center overflow-hidden pr-[10px]"
          >
            <button
              type="button"
              aria-current={isActive ? "true" : undefined}
              onClick={() => scrollToSection(section.id)}
              className={`cursor-pointer text-left text-[14px] leading-none whitespace-nowrap transition-[translate,color] duration-[420ms] ease-cs-out ${
                isActive
                  ? "translate-x-[10px] text-cs-fg"
                  : "text-cs-fg-muted hover:translate-x-[10px] hover:text-cs-fg"
              }`}
            >
              {section.label}
            </button>
          </div>
        );
      })}
    </nav>
  );
}
