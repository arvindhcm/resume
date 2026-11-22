export default function CarouselArrowButton({
  direction,
  label,
  controls,
  disabled,
  onClick,
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-controls={controls}
      disabled={disabled}
      onClick={onClick}
      className="pointer-events-auto grid size-11 cursor-pointer place-items-center rounded-full border border-ink bg-transparent text-ink transition-colors hover:bg-ink hover:text-surface disabled:cursor-default disabled:border-border-strong disabled:text-muted/50 disabled:hover:bg-transparent max-[560px]:size-10"
    >
      <svg
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className={`size-[18px] ${direction === "prev" ? "rotate-180" : ""}`}
      >
        <path d="M4 10h12M11 5l5 5-5 5" />
      </svg>
    </button>
  );
}
