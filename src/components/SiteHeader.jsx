import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ImageLightbox from "./ImageLightbox.jsx";
import profilePic from "./assets/myprofilepic.jpeg";
import resumePdf from "../assets/Arvindhcm_Designer_resume.pdf";

// EDIT: header nav links. `to` = in-app route, `href` = plain link.
const NAV_LINKS = [
  { label: "Work", to: { pathname: "/", hash: "#work" }, activePath: "/" },
  { label: "About", to: "/about", activePath: "/about" },
  // { label: "Contact", href: "#contact" },
  { label: "Resume", href: resumePdf, isExternal: true },
];

// Text colors need `!`: the global unlayered `a { color: inherit }` in index.css outranks utilities.
const NAV_LINK_CLASS =
  "rounded-full px-3.5 py-1.5 text-sm transition-colors hover:bg-ink hover:text-surface! max-[420px]:px-2.5 max-[420px]:text-[13px]";

export default function SiteHeader() {
  const { pathname } = useLocation();
  const [isProfilePreviewOpen, setIsProfilePreviewOpen] = useState(false);

  return (
    <header className="pointer-events-auto mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-4 px-[25px] pt-12">
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="font-['Lora'] text-[22px] font-medium tracking-[-0.01em] text-ink"
        >
          Arvindh C M
        </Link>
        <button
          type="button"
          className="cursor-zoom-in appearance-none rounded-full border-0 bg-transparent p-0 transition-transform duration-150 ease-in-out hover:scale-110"
          onClick={() => setIsProfilePreviewOpen(true)}
          aria-label="Open full preview of profile picture"
        >
          <img
            src={profilePic}
            alt="Arvindh C M"
            className="size-7 rounded-full object-cover"
          />
        </button>
      </div>

      <nav
        aria-label="Primary"
        className="flex items-center gap-0.5 rounded-full border border-border-strong bg-surface/70 p-1 backdrop-blur-md"
      >
        {NAV_LINKS.map((link) => {
          const isActive = link.activePath === pathname;
          const className = `${NAV_LINK_CLASS} ${isActive ? "bg-ink text-surface!" : "text-muted!"}`;

          return link.to ? (
            <Link
              key={link.label}
              to={link.to}
              aria-current={isActive ? "page" : undefined}
              className={className}
            >
              {link.label}
            </Link>
          ) : (
            <a
              key={link.label}
              href={link.href}
              target={link.isExternal ? "_blank" : undefined}
              rel={link.isExternal ? "noopener noreferrer" : undefined}
              className={className}
            >
              {link.label}
            </a>
          );
        })}
      </nav>

      {isProfilePreviewOpen && (
        <ImageLightbox
          src={profilePic}
          alt="Arvindh C M"
          onClose={() => setIsProfilePreviewOpen(false)}
        />
      )}
    </header>
  );
}
