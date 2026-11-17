import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import FooterBackdrop, {
  ELSEWHERE_WIDTH_CLASS,
  SCENE_BOTTOM_ROW_CLASS,
  SCENE_GUTTER_CLASS,
  SCENE_HEIGHT_CLASS,
} from "./FooterBackdrop.jsx";
import { useIsCompact } from "../lib/useIsCompact.js";

// EDIT: footer copy and links
const HEADLINE = "Let's make something thoughtful together.";
const EMAIL = "arvindhcm7@gmail.com";
const LINKS = [
  { label: "LinkedIn", href: "https://linkedin.com/in/arvindhcm" },
  { label: "+91 6384769554", href: "tel:+916384769554" },
];
const SIGNOFF = "Built by hand";

const REVEAL_EASE = [0.22, 1, 0.36, 1];

export default function SiteFooter({ resumeHref }) {
  const footerRef = useRef(null);
  const sceneSlotRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const isCompact = useIsCompact(footerRef);

  const isFooterVisible = useInView(footerRef, { once: true, amount: 0.15 });
  const isSceneReached = useInView(sceneSlotRef, { amount: 0.6 });

  const [hasCopiedEmail, setHasCopiedEmail] = useState(false);

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
      className={`pointer-events-auto relative z-[4] flex flex-col gap-2 ${isCompact ? "" : `pb-[18px] ${ELSEWHERE_WIDTH_CLASS}`}`}
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

  const intro = (
    <div className="relative z-[4]">
      <motion.h2
        {...reveal(0)}
        className="pointer-events-auto m-0 max-w-[18em] text-[min(34px,7vw)] leading-[1.15] font-medium tracking-[-0.02em]"
      >
        {HEADLINE}
      </motion.h2>

      <motion.div
        {...reveal(1)}
        className="pointer-events-auto relative mt-[18px] inline-block"
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
    </div>
  );

  return (
    <footer ref={footerRef} id="contact" className="pb-10">
      <FooterBackdrop isInteractive={isSceneReached} />

      <div
        className={`relative mx-auto w-full max-w-[1120px] text-ink ${
          isCompact
            ? `${SCENE_GUTTER_CLASS.compact} pt-20`
            : `${SCENE_GUTTER_CLASS.wide} pt-[clamp(96px,14vh,140px)]`
        }`}
      >
        {isCompact && (
          <>
            {intro}
            <div className="mt-7">{elsewhere}</div>
          </>
        )}

        {/* Empty slot sitting exactly over the fixed backdrop's tree + leaf pile. */}
        <div
          ref={sceneSlotRef}
          className={
            isCompact
              ? `mt-2 ${SCENE_HEIGHT_CLASS.compact}`
              : `grid grid-cols-[minmax(0,1fr)_auto] items-end gap-x-[4vw] ${SCENE_HEIGHT_CLASS.wide}`
          }
        >
          {!isCompact && (
            <>
              <div className="self-start">{intro}</div>
              <div className="flex items-end gap-7">
                <div aria-hidden="true" className="mb-0.5 h-[350px] w-[390px] shrink-0" />
                {elsewhere}
              </div>
            </>
          )}
        </div>

        <div
          className={`${SCENE_BOTTOM_ROW_CLASS} flex items-center justify-between gap-3 text-xs text-muted`}
        >
          <span>{/* © {new Date().getFullYear()} · {SIGNOFF} */}</span>
          <button
            type="button"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion ? "auto" : "smooth",
              })
            }
            className="pointer-events-auto cursor-pointer rounded border-0 bg-ink/[0.06] px-[9px] py-1.5 text-[10.5px] tracking-[0.06em] text-ink"
          >
            TOP ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
