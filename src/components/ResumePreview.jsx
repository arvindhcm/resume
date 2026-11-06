import { useEffect } from "react";

const actionButtonClassName =
  "liquid-glass inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border px-4 text-sm font-medium text-ink transition-transform duration-150 ease-in-out hover:scale-105";

export default function ResumePreview({ src, fileName, onClose }) {
  useEffect(() => {
    const onKey = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="pointer-events-auto fixed inset-0 z-[1100] flex flex-col items-center justify-center gap-4 bg-black/80 p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Resume preview"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-4xl items-center justify-end gap-2"
        onClick={(event) => event.stopPropagation()}
      >
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className={actionButtonClassName}
        >
          Open
        </a>
        <a href={src} download={fileName} className={actionButtonClassName}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download
        </a>
        <button
          type="button"
          className="liquid-glass inline-flex size-10 items-center justify-center rounded-full border border-border text-ink transition-transform duration-150 ease-in-out hover:scale-105"
          onClick={onClose}
          aria-label="Close preview"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-5"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <iframe
        src={`${src}#navpanes=0&pagemode=none&view=FitH`}
        title="Arvindh CM resume"
        className="h-full max-h-[calc(100vh-7rem)] w-full max-w-4xl flex-1 rounded-md border-0 bg-surface shadow-lg"
        onClick={(event) => event.stopPropagation()}
      />
    </div>
  );
}
