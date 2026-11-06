import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CaseStudyRunbooks.css";

import ImageLightbox from "../../components/ImageLightbox";

import runbookDemo from "./assets/runbookDemo.mp4";
import consistentService from "./assets/consistentService.mp4";
import completeAdherence from "./assets/completeAdherence.mp4";
import canvasWide from "./assets/canvasWide.png";
import canvasOnboarding from "./assets/canvasOnboarding.png";
import nodeSpec from "./assets/nodeSpec.png";
import listView from "./assets/listView.avif";
import deckPdf from "./assets/deckPdf.pdf";
import testimonialThread from "./assets/customersatisfaction/testimonialThread.png";
import testimonial1 from "./assets/customersatisfaction/testimonial1.png";
import testimonial2 from "./assets/customersatisfaction/testimonial2.png";
import testimonial3 from "./assets/customersatisfaction/testimonial3.png";
import testimonial4 from "./assets/customersatisfaction/testimonial4.png";

const solutionMedia = [
  {
    src: canvasWide,
    alt: "Runbook canvas showing an Employee Onboarding workflow with chained task, script, and system-action nodes",
    caption:
      "An Employee Onboarding runbook — task, script, and auto-action nodes chained with unlock logic.",
    variant: "main",
  },
  {
    src: canvasOnboarding,
    alt: "Close-up of the runbook canvas with checklist and script nodes",
    caption: "Close-up: checklist and script nodes mid-run.",
    variant: "side",
  },
  {
    src: listView,
    alt: "List view of runbooks for quick scanning and management",
    caption: "List view — for scanning and managing runbooks at a glance.",
    variant: "side",
  },
  {
    src: consistentService,
    type: "video",
    alt: "Consistent service experience demo, the same runbook running the same way across clients",
    caption:
      "Consistent service experiences — the same runbook, every time, across every client.",
    variant: "side",
  },
  {
    src: completeAdherence,
    type: "video",
    alt: "Complete adherence demo, runbook steps unlocking one after another in sequence",
    caption:
      "Ensure complete adherence — steps unlock in sequence, so nothing gets skipped.",
    variant: "side",
  },
];

const glanceSteps = [
  {
    label: "Challenge",
    headline:
      "SOPs lived in documents while the work happened in the ticketing tool.",
    detail:
      "Steps got skipped, order got mixed up, and consistency depended on who was on shift.",
  },
  {
    label: "Approach",
    headline: "Started at the atomic unit, not the canvas.",
    detail:
      "Mapped five action types a step could take, and every state each one needed, before drawing a single connection.",
  },
  {
    label: "Solution",
    headline: "A drag-and-drop canvas where tasks unlock the next step.",
    detail:
      "Scripts fire real automations, and one runbook applies to any client site from a dropdown.",
  },
];

// EDIT: swap copy, links, and credits for your own version of this story.
export default function CaseStudyRunbooks() {
  const navigate = useNavigate();
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && !lightboxImage) navigate("/");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate, lightboxImage]);

  return (
    <div
      className="pointer-events-auto case-study"
      role="dialog"
      aria-modal="true"
      aria-label="Unified Runbooks case study"
    >
      <div className="cs-scroll">
        {/* TOPBAR */}
        <div className="liquid-glass cs-topbar">
          <div className="wrap cs-topbar-inner">
            <button className="cs-back" onClick={() => navigate("/")}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Back to Profile
            </button>
            <a
              className="cs-live-link text-red-100"
              href="https://superops.com/psa-software/unified-runbooks"
              target="_blank"
              rel="noopener noreferrer"
            >
              See announcement →
            </a>
          </div>
        </div>

        {/* HERO */}
        <header className="cs-hero">
          <div className="wrap grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
            <div className="min-w-0">
              <span className="cs-tag">Unified Runbooks · SuperOps PSA</span>
              <h1>SOPs technicians actually follow, every single time</h1>
              <p className="cs-hero-sub">
                Turning tribal-knowledge SOPs into guided, automated workflows —
                from a blank canvas to a shipped feature the team called{" "}
                <em>"a key feature of SuperOps."</em>
              </p>
              <div className="cs-meta-row">
                <div>
                  <span className="cs-meta-label">Role</span>
                  <span className="cs-meta-value">
                    Product Designer, end&#8209;to&#8209;end
                  </span>
                </div>
                <div>
                  <span className="cs-meta-label">Platform</span>
                  <span className="cs-meta-value">SuperOps PSA</span>
                </div>
                <div>
                  <span className="cs-meta-label">Team</span>
                  <span className="cs-meta-value">
                    1 designer · PM · 3 engineers
                  </span>
                </div>
              </div>
            </div>
            <div className="cs-hero-media mb-0!">
              <video src={runbookDemo} autoPlay loop muted playsInline />
            </div>
          </div>
        </header>

        {/* AT A GLANCE */}
        <section className="cs-section cs-section--tight">
          <div className="wrap cs-section-inner cs-section-inner--wide">
            <h2 className="mb-10! text-[clamp(28px,4vw,44px)]! font-semibold tracking-[-0.02em]! text-ink">
              The solution at a glance
            </h2>

            <ol className="m-0 grid list-none grid-cols-1 gap-10 p-0 md:grid-cols-3 md:gap-6">
              {glanceSteps.map((step, index) => {
                const isFinal = index === glanceSteps.length - 1;
                return (
                  <li key={step.label} className="relative">
                    <div className="mb-5 flex items-center">
                      <span
                        className={`relative z-10 grid size-11 shrink-0 place-items-center rounded-[10px] border-[1.5px] border-accent-ink text-base font-semibold ${
                          isFinal
                            ? "bg-accent-ink text-surface"
                            : "bg-bg text-accent-ink"
                        }`}
                      >
                        {isFinal ? (
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="size-4"
                            aria-hidden="true"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        ) : (
                          index + 1
                        )}
                      </span>
                      {!isFinal && (
                        <span
                          aria-hidden="true"
                          className="hidden h-0.5 flex-1 bg-border-strong md:block md:-mr-6"
                        />
                      )}
                    </div>
                    <span className="mb-3 block text-[15px] font-semibold text-accent-ink">
                      {step.label}
                    </span>
                    <h3 className="m-0 mb-3 text-[19px] font-semibold leading-snug tracking-[-0.01em] text-ink">
                      {step.headline}
                    </h3>
                    <p className="m-0 text-base leading-relaxed text-ink-soft/70">
                      {step.detail}
                    </p>
                  </li>
                );
              })}
            </ol>

            <div className="mt-16 grid grid-cols-1 items-end gap-10 rounded-lg border border-border bg-surface shadow-sm px-7 py-10 text-ink md:px-16 md:py-16 lg:grid-cols-[1.4fr_1fr] lg:gap-12 lg:px-20 lg:py-20">
              <div>
                <span className="mb-5 block text-[15px] font-semibold text-accent-ink">
                  Impact
                </span>
                <p className="m-0 text-[clamp(44px,5.5vw,76px)] font-semibold leading-[0.95] tracking-[-0.035em] text-accent-ink">
                  “Absolutely phenomenal.”
                </p>
                <p className="m-0 mt-6 text-base text-muted">
                  Customers, within days of release
                </p>
              </div>
              <ul className="m-0 list-none p-0 text-lg font-semibold">
                <li className="border-b border-accent-ink/15 pb-6">
                  Shipped as a core PSA module
                </li>
                <li className="pt-6">
                  Called “a key feature of SuperOps” internally
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* PROBLEM */}
        <section className="cs-section">
          <div className="wrap cs-section-inner">
            <p className="eyebrow">The problem</p>
            <h2>SOPs lived in documents. Work happened somewhere else.</h2>
            <p className="cs-body">
              MSP technicians run the same procedures — onboarding an employee,
              offboarding a device, patching a server — dozens of times a week,
              for dozens of different clients. Those procedures lived as static
              checklists or tribal knowledge, disconnected from the ticketing
              tool technicians actually worked in. Steps got skipped, order got
              mixed up, and consistency depended on who was on shift.
            </p>
            <p className="cs-body">
              The ask: give MSPs a way to turn a written SOP into a living
              workflow — one that could branch, unlock steps conditionally,
              trigger scripts, and apply the exact same rigor whether it ran
              once or a thousand times.
            </p>
          </div>
        </section>

        {/* PROCESS */}
        <section className="cs-section cs-section--alt">
          <div className="wrap">
            <p className="eyebrow">Process</p>
            <h2>Designing the node, not just the screen</h2>
            <p className="cs-body">
              The hardest problem wasn't the canvas — it was the atomic unit
              inside it. A runbook step needed to hold very different shapes of
              content while staying visually predictable at a glance, so most of
              early exploration went into the node itself before a single
              connection was drawn:
            </p>
            <ol className="cs-decision-list">
              <li className="cs-decision">
                <span className="cs-decision-num">01</span>
                <div>
                  <h3>Fixed anatomy</h3>
                  <p>
                    Every node reads the same way at a glance, no matter what it
                    holds — a checkbox task, a script, a captured value, or an
                    automatic system action.
                  </p>
                </div>
              </li>
              <li className="cs-decision">
                <span className="cs-decision-num">02</span>
                <div>
                  <h3>Five action types</h3>
                  <p>
                    Task, script, value capture, system action, and one more —
                    each with its own default styling so a technician can tell
                    what a step will do without opening it.
                  </p>
                </div>
              </li>
              <li className="cs-decision">
                <span className="cs-decision-num">03</span>
                <div>
                  <h3>Full state coverage</h3>
                  <p>
                    Default, hover, selected, and text-overflow specified up
                    front for every variant, so engineering never had to guess
                    how an edge case should look.
                  </p>
                </div>
              </li>
            </ol>
            <figure className="cs-figure cs-figure--full">
              <img
                src={nodeSpec}
                alt="Node component specification sheet: anatomy, five action node types, node states, and text overflow behavior"
                loading="lazy"
              />
              <figcaption>
                Node anatomy, action-type variants, and state specs — the
                building block every runbook step is made from.
              </figcaption>
            </figure>
          </div>
        </section>

        {/* SOLUTION */}
        <section className="cs-section">
          <div className="wrap cs-section-inner">
            <p className="eyebrow">The solution</p>
            <h2>
              A drag-and-drop canvas for building — and running — runbooks
            </h2>
            <p className="cs-body">
              Runbooks assemble on a connected node canvas: tasks unlock the
              next step on completion, script steps fire real automations (like
              provisioning a new employee's AD account), and the whole sequence
              can be applied to any client site from a single dropdown.
              Technicians work through it like a checklist with guardrails —
              nothing skippable, nothing out of order.
            </p>
            <div className="cs-solution-layout">
              {solutionMedia
                .filter((media) => media.variant === "main")
                .map((media) => (
                  <figure key={media.src} className="cs-figure cs-solution-main">
                    <button
                      type="button"
                      className="cs-solution-media cursor-zoom-in appearance-none border-0 p-0 transition-opacity duration-150 ease-in-out hover:opacity-90"
                      onClick={() =>
                        setLightboxImage({
                          src: media.src,
                          alt: media.alt,
                          type: media.type,
                        })
                      }
                      aria-label={`Open full preview of ${media.alt}`}
                    >
                      {media.type === "video" ? (
                        <video src={media.src} autoPlay loop muted playsInline />
                      ) : (
                        <img src={media.src} alt={media.alt} loading="lazy" />
                      )}
                    </button>
                    <figcaption>{media.caption}</figcaption>
                  </figure>
                ))}

              <div className="cs-solution-side">
                {solutionMedia
                  .filter((media) => media.variant === "side")
                  .map((media) => (
                    <figure key={media.src} className="cs-figure">
                      <button
                        type="button"
                        className="cs-solution-media cursor-zoom-in appearance-none border-0 p-0 transition-opacity duration-150 ease-in-out hover:opacity-90"
                        onClick={() =>
                          setLightboxImage({
                            src: media.src,
                            alt: media.alt,
                            type: media.type,
                          })
                        }
                        aria-label={`Open full preview of ${media.alt}`}
                      >
                        {media.type === "video" ? (
                          <video
                            src={media.src}
                            autoPlay
                            loop
                            muted
                            playsInline
                          />
                        ) : (
                          <img src={media.src} alt={media.alt} loading="lazy" />
                        )}
                      </button>
                      <figcaption>{media.caption}</figcaption>
                    </figure>
                  ))}
              </div>
            </div>
          </div>
        </section>

        {/* IMPACT */}
        <section className="cs-section cs-section--dark">
          <div className="wrap cs-section-inner">
            <p className="eyebrow">Impact</p>
            <h2>Shipped, and it landed</h2>
            <p className="cs-body cs-body--light">
              Runbooks shipped as a core PSA module. The reaction from the team
              and early customers was immediate — internally it was called out
              as "a key feature of SuperOps," and customer feedback flagged it
              as "absolutely phenomenal" within days of release.
            </p>

            <blockquote className="cs-quote">
              "Good job on the new Runbooks module, you guys smashed it, it's
              amazing!"
            </blockquote>

            <div className="cs-reaction-row">
              <span className="cs-reaction">🔥 79</span>
              <span className="cs-reaction">🎉 21</span>
              <span className="cs-reaction">👏 15</span>
              <span className="cs-reaction">🥹 7</span>
            </div>

            <div className="cs-gallery-testimonials">
              <img
                src={testimonialThread}
                alt="Slack thread announcing positive customer feedback on the Runbooks launch"
                loading="lazy"
              />
              <img
                src={testimonial4}
                alt="Slack message: I believe this will be a key feature of SuperOps"
                loading="lazy"
              />
              <img
                src={testimonial1}
                alt="Slack message calling the new Runbooks module amazing"
                loading="lazy"
              />
              <img
                src={testimonial2}
                alt="Customer message calling the new runbook system absolutely phenomenal"
                loading="lazy"
              />
              <img
                src={testimonial3}
                alt="Teammate reaction calling the runbook canvas awesome at first glance"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* DECK / CLOSE */}
        <section className="cs-section cs-section--closing">
          <div className="wrap cs-section-inner cs-closing-inner">
            <div>
              <h2>Want the full process?</h2>
              <p className="cs-body">
                The full design deck covers research, flows, and edge cases not
                shown here.
              </p>
            </div>
            <div className="cs-closing-actions">
              <a
                className="btn"
                href={deckPdf}
                target="_blank"
                rel="noopener noreferrer"
              >
                View full deck (PDF)
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </a>
              <button className="btn btn--ghost" onClick={() => navigate("/")}>
                Back to home
              </button>
            </div>
          </div>
        </section>
      </div>

      {lightboxImage && (
        <ImageLightbox
          src={lightboxImage.src}
          alt={lightboxImage.alt}
          type={lightboxImage.type}
          onClose={() => setLightboxImage(null)}
        />
      )}
    </div>
  );
}
