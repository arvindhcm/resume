import { motion } from "framer-motion";

export default function PlayCard({
  item,
  isActive,
  focusWidth,
  sliverWidth,
  height,
  transition,
  onClick,
}) {
  return (
    <motion.li
      initial={false}
      animate={{ width: isActive ? focusWidth : sliverWidth }}
      transition={transition}
      style={{ height }}
      className="relative shrink-0 overflow-hidden rounded-sm bg-surface-alt ring-1 ring-border-strong/40 has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-4 has-[a:focus-visible]:outline-ink"
    >
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        draggable="false"
        aria-label={isActive ? `Open ${item.title} live` : `Show ${item.title}`}
        aria-current={isActive ? "true" : undefined}
        data-cursor-label={isActive ? "Open live" : "View"}
        onClick={onClick}
        className="group pointer-events-auto absolute inset-0 block cursor-pointer outline-none"
      >
        {/* Media keeps the expanded size at all times so a collapsed card
            reveals a centered slice instead of a squashed thumbnail. GIFs
            can't be paused, so only the focused card mounts the animated
            file; the rest show its first frame. */}
        <div
          style={{ width: focusWidth, height }}
          className={`absolute top-0 left-1/2 -translate-x-1/2 transition-[scale,opacity] duration-700 ease-cs-out ${
            isActive ? "group-hover:scale-[1.015]" : "opacity-80 group-hover:opacity-100"
          }`}
        >
          <img
            src={item.poster}
            alt={isActive ? "" : item.alt}
            draggable="false"
            className="absolute inset-0 size-full object-cover"
          />
          {isActive && (
            <img
              src={item.snapshot}
              alt={item.alt}
              draggable="false"
              className="absolute inset-0 size-full object-cover"
            />
          )}
        </div>
      </a>
    </motion.li>
  );
}
