import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MotionConfig, motion } from "framer-motion";

import ImageLightbox from "../../components/ImageLightbox";
import CaseStudySectionNav from "../../components/CaseStudySectionNav";
import { useCaseStudyMotion } from "../../lib/useCaseStudyMotion";
import {
  CS_BODY_CLASS,
  CS_CAPTION_CLASS,
  CS_HEADING_CLASS,
  CS_HIGHLIGHT_CLASS,
  CS_MEDIA_PANEL_CLASS,
  CS_MUTED_BODY_CLASS,
  CS_PILL_CLASS,
  CS_SECTION_CLASS,
  CS_SECTION_HEAD_CLASS,
  CS_SUMMARY_ROW_CLASS,
  CS_SUMMARY_VALUE_CLASS,
} from "../../lib/caseStudyStyles";

import runbookDemo from "./assets/runbookDemo.mp4";
import consistentService from "./assets/consistentService.mp4";
import completeAdherence from "./assets/completeAdherence.mp4";
import canvasWide from "./assets/canvasWide.png";
import canvasOnboarding from "./assets/canvasOnboarding.png";
import nodeSpec from "./assets/nodeSpec.png";
import listView from "./assets/listView.avif";
import deckPdf from "./assets/deckPdf.pdf";
import canvasSketch from "./assets/sketches/canvasSketch.svg";
import canvasWireframe from "./assets/sketches/canvasWireframe.svg";
import testimonialThread from "./assets/customersatisfaction/testimonialThread.png";
import testimonial1 from "./assets/customersatisfaction/testimonial1.png";
import testimonial2 from "./assets/customersatisfaction/testimonial2.png";
import testimonial3 from "./assets/customersatisfaction/testimonial3.png";
import testimonial4 from "./assets/customersatisfaction/testimonial4.png";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "challenge", label: "Challenge" },
  { id: "impact", label: "Impact" },
  { id: "problem", label: "Problem" },
  { id: "sketches", label: "Sketches" },
  { id: "node-design", label: "Node design" },
  { id: "solution", label: "Solution" },
  { id: "feedback", label: "Feedback" },
  { id: "full-deck", label: "Full deck" },
];

const projectMeta = [
  { label: "Role", value: "Product Designer, end‑to‑end" },
  { label: "Platform", value: "SuperOps PSA" },
  { label: "Team", value: "2 designer · PM · 5 engineers" },
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

// EDIT: swap the sketch / wireframe files in assets/sketches/ for your real scans.
const processStages = [
  {
    src: canvasSketch,
    label: "Sketch",
    alt: "Hand-drawn paper sketch of the runbook canvas: chained step nodes with unlock arrows, a client selector, and a crossed-out flat checklist idea",
  },
  {
    src: canvasWireframe,
    label: "Wireframe",
    alt: "Low-fidelity grey wireframe of the runbook canvas with numbered callouts for the client selector, unlock connector, locked step, and drag-to-reorder",
  },
  {
    src: canvasWide,
    label: "Final",
    alt: "Final high-fidelity runbook canvas showing an Employee Onboarding workflow",
  },
];

const nodeDecisions = [
  {
    number: "01",
    title: "Fixed anatomy",
    body: "Every node reads the same way at a glance, no matter what it holds — a checkbox task, a script, a captured value, or an automatic system action.",
  },
  {
    number: "02",
    title: "Five action types",
    body: "Task, script, value capture, system action, and one more — each with its own default styling so a technician can tell what a step will do without opening it.",
  },
  {
    number: "03",
    title: "Full state coverage",
    body: "Default, hover, selected, and text-overflow specified up front for every variant, so engineering never had to guess how an edge case should look.",
  },
];

const solutionMain = {
  src: canvasWide,
  alt: "Runbook canvas showing an Employee Onboarding workflow with chained task, script, and system-action nodes",
  caption:
    "An Employee Onboarding runbook — task, script, and auto-action nodes chained with unlock logic.",
};

const solutionSide = [
  {
    src: canvasOnboarding,
    alt: "Close-up of the runbook canvas with checklist and script nodes",
    caption: "Close-up: checklist and script nodes mid-run.",
  },
  {
    src: listView,
    alt: "List view of runbooks for quick scanning and management",
    caption: "List view — for scanning and managing runbooks at a glance.",
  },
  {
    src: consistentService,
    type: "video",
    alt: "Consistent service experience demo, the same runbook running the same way across clients",
    caption:
      "Consistent service experiences — the same runbook, every time, across every client.",
  },
  {
    src: completeAdherence,
    type: "video",
    alt: "Complete adherence demo, runbook steps unlocking one after another in sequence",
    caption:
      "Ensure complete adherence — steps unlock in sequence, so nothing gets skipped.",
  },
];

const testimonials = [
  {
    src: testimonialThread,
    alt: "Slack thread announcing positive customer feedback on the Runbooks launch",
  },
  {
    src: testimonial4,
    alt: "Slack message: I believe this will be a key feature of SuperOps",
  },
  {
    src: testimonial1,
    alt: "Slack message calling the new Runbooks module amazing",
  },
  {
    src: testimonial2,
    alt: "Customer message calling the new runbook system absolutely phenomenal",
  },
  {
    src: testimonial3,
    alt: "Teammate reaction calling the runbook canvas awesome at first glance",
  },
];

const reactions = ["🔥 79", "🎉 21", "👏 15", "🥹 7"];

// EDIT: swap copy, links, and credits for your own version of this story.
export default function CaseStudyRunbooks() {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape" && !lightboxImage) navigate("/");
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [navigate, lightboxImage]);

  const { fadeUp, mediaFadeUp, headingMask, headingRise, dividerGrow } =
    useCaseStudyMotion(scrollContainerRef);

  const openLightbox = (media) =>
    setLightboxImage({ src: media.src, alt: media.alt, type: media.type });

  const renderHeading = (text, Tag = "h2") => (
    <Tag className={CS_HEADING_CLASS}>
      <motion.span className="block overflow-hidden" {...headingMask}>
        <motion.span className="block" {...headingRise}>
          {text}
        </motion.span>
      </motion.span>
    </Tag>
  );

  const renderMediaButton = (media, extraClassName = "") => (
    <button
      type="button"
      onClick={() => openLightbox(media)}
      aria-label={`Open full preview of ${media.alt}`}
      className={`${CS_MEDIA_PANEL_CLASS} transition-opacity duration-150 hover:opacity-90 ${extraClassName}`}
    >
      {media.type === "video" ? (
        <video
          src={media.src}
          autoPlay
          loop
          muted
          playsInline
          className="block h-full w-full object-cover"
        />
      ) : (
        <img
          src={media.src}
          alt={media.alt}
          loading="lazy"
          className="block h-full w-full object-cover object-left-top"
        />
      )}
    </button>
  );

  const backArrow = (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-full"
    >
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );

  return (
    <MotionConfig reducedMotion="user">
      <div
        ref={scrollContainerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Unified Runbooks case study"
        className="pointer-events-auto fixed inset-0 z-[1000] overflow-y-auto overflow-x-clip bg-cs-bg font-lato text-cs-fg antialiased"
      >
        <header className="liquid-glass relative z-10 border-b border-border">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-[16px] px-[24px] py-[16px] lg:px-[84px]">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="inline-flex cursor-pointer items-center gap-[8px] rounded-full border border-border bg-surface py-[9px] pr-[16px] pl-[12px] text-[14px] font-medium text-ink transition-[transform,border-color] duration-150 ease-[ease] hover:-translate-x-[2px] hover:border-border-strong"
            >
              <span className="inline-flex size-4 shrink-0">{backArrow}</span>
              Back to Profile
            </button>
            <a
              href="https://superops.com/psa-software/unified-runbooks"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-[6px] text-[15px] font-medium text-cs-announcement-link! transition-colors duration-150 hover:text-ink!"
            >
              See announcement
              <span className="transition-transform duration-150 ease-[ease] group-hover:translate-x-[2px]">
                →
              </span>
            </a>
          </div>
        </header>

        <div className="mx-auto grid max-w-[1440px] px-[24px] pt-[56px] pb-[120px] lg:grid-cols-[198px_minmax(0,1fr)] lg:px-[84px] lg:pt-[72px] lg:pb-[160px]">
          <aside className="hidden lg:block">
            <div className="sticky top-[72px] flex flex-col gap-[34px]">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="group flex cursor-pointer items-center gap-[8px] text-[14px] text-cs-fg-muted transition-colors duration-[240ms] ease-cs-out hover:text-cs-fg"
              >
                <span className="inline-flex size-[18px] shrink-0 transition-transform duration-[160ms] ease-cs-out group-hover:-translate-x-0.5">
                  {backArrow}
                </span>
                Back
              </button>
              <CaseStudySectionNav
                sections={SECTIONS}
                scrollContainerRef={scrollContainerRef}
              />
            </div>
          </aside>

          <main className="flex min-w-0 flex-col gap-[144px] max-lg:gap-[94px]">
            {/* OVERVIEW */}
            <section
              id="overview"
              className="flex scroll-mt-[120px] flex-col gap-[64px] max-lg:gap-[34px]"
            >
              <div className="flex flex-col gap-[34px] max-lg:gap-[24px]">
                <div className="flex flex-col gap-[8px] max-lg:gap-[4px]">
                  <h1 className="text-[46px] leading-[1.2] font-bold text-cs-fg max-lg:text-[28px] max-lg:leading-normal">
                    <motion.span
                      className="block overflow-hidden"
                      {...headingMask}
                    >
                      <motion.span className="block" {...headingRise}>
                        Unified Runbooks
                      </motion.span>
                    </motion.span>
                  </h1>
                  <motion.p
                    className="text-[24px] leading-[1.2] text-cs-fg-muted max-lg:text-[16px]"
                    {...fadeUp}
                  >
                    SOPs technicians actually follow, every single time
                  </motion.p>
                </div>

                <motion.p className={CS_BODY_CLASS} {...fadeUp}>
                  Turning tribal-knowledge SOPs into guided, automated workflows
                  — from a blank canvas to a shipped feature the team called{" "}
                  <span className={CS_HIGHLIGHT_CLASS}>
                    “a key feature of SuperOps.”
                  </span>
                </motion.p>

                <motion.dl
                  className="flex flex-wrap items-start gap-x-[54px] gap-y-[18px]"
                  {...fadeUp}
                >
                  {projectMeta.map((meta) => (
                    <div key={meta.label} className="flex flex-col gap-[4px]">
                      <dt className="text-[14px] leading-[18px] text-cs-fg-muted">
                        {meta.label}
                      </dt>
                      <dd className="m-0 text-[16px] leading-[22px] text-cs-fg">
                        {meta.value}
                      </dd>
                    </div>
                  ))}
                </motion.dl>
              </div>

              <motion.div
                className="w-full max-w-[724px] overflow-hidden rounded-[14px] bg-cs-panel max-lg:rounded-[6px]"
                {...mediaFadeUp}
              >
                <video
                  src={runbookDemo}
                  autoPlay
                  loop
                  muted
                  playsInline
                  aria-label="Unified Runbooks product demo"
                  className="block h-auto w-full"
                />
              </motion.div>
            </section>

            {/* AT A GLANCE: CHALLENGE + IMPACT */}
            <div className="flex flex-col gap-y-[64px] max-lg:gap-y-[44px]">
              <section
                id="challenge"
                className="flex scroll-mt-[48px] flex-col gap-y-[64px] max-lg:gap-y-[44px]"
              >
                {glanceSteps.map((step, index) => (
                  <div
                    key={step.label}
                    className="flex flex-col gap-y-[64px] max-lg:gap-y-[44px]"
                  >
                    {index > 0 && (
                      <motion.div
                        aria-hidden="true"
                        className="h-px w-full origin-left bg-cs-divider"
                        {...dividerGrow}
                      />
                    )}
                    <div className={CS_SUMMARY_ROW_CLASS}>
                      {renderHeading(step.label)}
                      <div className={CS_SUMMARY_VALUE_CLASS}>
                        <motion.p className={CS_BODY_CLASS} {...fadeUp}>
                          <span className={CS_HIGHLIGHT_CLASS}>
                            {step.headline}
                          </span>{" "}
                          {step.detail}
                        </motion.p>
                      </div>
                    </div>
                  </div>
                ))}
              </section>

              <motion.div
                aria-hidden="true"
                className="h-px w-full origin-left bg-cs-divider"
                {...dividerGrow}
              />

              <section
                id="impact"
                className={`${CS_SUMMARY_ROW_CLASS} scroll-mt-[48px] max-lg:gap-y-[24px]`}
              >
                {renderHeading("Impact")}
                <div
                  className={`${CS_SUMMARY_VALUE_CLASS} flex flex-col gap-[34px]`}
                >
                  <motion.div className="flex flex-col" {...fadeUp}>
                    <p className="text-[46px] leading-[1.1] text-cs-fg max-lg:text-[28px]">
                      “Absolutely phenomenal.”
                    </p>
                    <p className={`mt-[8px] ${CS_MUTED_BODY_CLASS}`}>
                      Customers, within days of release
                    </p>
                  </motion.div>
                  <motion.ul
                    className="m-0 flex list-none flex-wrap gap-[10px] p-0"
                    {...fadeUp}
                  >
                    <li className={CS_PILL_CLASS}>Shipped as a core PSA module</li>
                    <li className={CS_PILL_CLASS}>
                      Called “a key feature of SuperOps” internally
                    </li>
                  </motion.ul>
                </div>
              </section>
            </div>

            {/* PROBLEM */}
            <section id="problem" className={CS_SECTION_CLASS}>
              <div className={CS_SECTION_HEAD_CLASS}>
                {renderHeading(
                  "SOPs lived in documents. Work happened somewhere else.",
                )}
                <motion.div className="flex flex-col gap-[16px]" {...fadeUp}>
                  <p className={CS_BODY_CLASS}>
                    MSP technicians run the same procedures — onboarding an
                    employee, offboarding a device, patching a server — dozens
                    of times a week, for dozens of different clients. Those
                    procedures lived as static checklists or tribal knowledge,
                    disconnected from the ticketing tool technicians actually
                    worked in. Steps got skipped, order got mixed up, and
                    consistency depended on who was on shift.
                  </p>
                  <p className={CS_BODY_CLASS}>
                    The ask:{" "}
                    <span className={CS_HIGHLIGHT_CLASS}>
                      give MSPs a way to turn a written SOP into a living
                      workflow
                    </span>{" "}
                    — one that could branch, unlock steps conditionally, trigger
                    scripts, and apply the exact same rigor whether it ran once
                    or a thousand times.
                  </p>
                </motion.div>
              </div>
            </section>

            {/* SKETCHES */}
            <section id="sketches" className={CS_SECTION_CLASS}>
              <div className={CS_SECTION_HEAD_CLASS}>
                {renderHeading("From sketch to canvas")}
                <motion.p className={CS_BODY_CLASS} {...fadeUp}>
                  Early explorations, from a rough paper sketch to a lo-fi
                  wireframe to the shipped canvas.
                </motion.p>
              </div>
              <motion.div
                className="rounded-[14px] bg-cs-panel p-[34px] max-lg:rounded-[6px] max-lg:p-[14px]"
                {...mediaFadeUp}
              >
                <ol className="m-0 grid list-none grid-cols-1 gap-[24px] p-0 md:grid-cols-3 max-lg:gap-[14px]">
                  {processStages.map((stage) => (
                    <li
                      key={stage.label}
                      className="flex min-w-0 flex-col gap-[14px]"
                    >
                      <button
                        type="button"
                        onClick={() => openLightbox(stage)}
                        aria-label={`Open full preview of ${stage.alt}`}
                        className="block aspect-[4/3] w-full cursor-zoom-in overflow-hidden rounded-[10px] bg-cs-frame shadow-[0_0_10px_rgba(0,0,0,0.06)] transition-transform duration-[240ms] ease-cs-out hover:-translate-y-0.5"
                      >
                        <img
                          src={stage.src}
                          alt={stage.alt}
                          loading="lazy"
                          className="block h-full w-full object-cover object-left-top"
                        />
                      </button>
                      <span className="self-start rounded-[20px] bg-cs-frame px-[14px] py-[6px] text-[14px] leading-none font-bold text-cs-fg">
                        {stage.label}
                      </span>
                    </li>
                  ))}
                </ol>
              </motion.div>
            </section>

            {/* NODE DESIGN */}
            <section id="node-design" className={CS_SECTION_CLASS}>
              <div className={CS_SECTION_HEAD_CLASS}>
                {renderHeading("Designing the node, not just the screen")}
                <motion.p className={CS_BODY_CLASS} {...fadeUp}>
                  The hardest problem wasn't the canvas — it was the atomic unit
                  inside it. A runbook step needed to hold very different shapes
                  of content while staying visually predictable at a glance, so
                  most of early exploration went into the node itself before a
                  single connection was drawn:
                </motion.p>
              </div>

              <ol className="m-0 grid list-none grid-cols-1 gap-[24px] p-0 lg:grid-cols-3">
                {nodeDecisions.map((decision) => (
                  <motion.li
                    key={decision.number}
                    className="flex flex-col gap-[12px] rounded-[14px] bg-cs-panel p-[28px] max-lg:rounded-[6px] max-lg:p-[24px]"
                    {...fadeUp}
                  >
                    <span className="text-[14px] leading-none text-cs-fg-muted tabular-nums">
                      {decision.number}
                    </span>
                    <h3 className="text-[20px] leading-[1.2] font-bold text-cs-fg">
                      {decision.title}
                    </h3>
                    <p className="text-[16px] leading-[26px] text-cs-fg max-lg:text-[14px] max-lg:leading-[22px]">
                      {decision.body}
                    </p>
                  </motion.li>
                ))}
              </ol>

              <motion.figure className="m-0" {...mediaFadeUp}>
                {renderMediaButton({
                  src: nodeSpec,
                  alt: "Node component specification sheet: anatomy, five action node types, node states, and text overflow behavior",
                })}
                <figcaption className={CS_CAPTION_CLASS}>
                  Node anatomy, action-type variants, and state specs — the
                  building block every runbook step is made from.
                </figcaption>
              </motion.figure>
            </section>

            {/* SOLUTION */}
            <section id="solution" className={CS_SECTION_CLASS}>
              <div className={CS_SECTION_HEAD_CLASS}>
                {renderHeading(
                  "A drag-and-drop canvas for building — and running — runbooks",
                )}
                <motion.p className={CS_BODY_CLASS} {...fadeUp}>
                  Runbooks assemble on a connected node canvas: tasks unlock the
                  next step on completion, script steps fire real automations
                  (like provisioning a new employee's AD account), and the whole
                  sequence can be applied to any client site from a single
                  dropdown. Technicians work through it like a checklist with
                  guardrails —{" "}
                  <span className={CS_HIGHLIGHT_CLASS}>
                    nothing skippable, nothing out of order.
                  </span>
                </motion.p>
              </div>

              <motion.figure className="m-0" {...mediaFadeUp}>
                {renderMediaButton(solutionMain)}
                <figcaption className={CS_CAPTION_CLASS}>
                  {solutionMain.caption}
                </figcaption>
              </motion.figure>

              <div className="grid grid-cols-1 gap-x-[24px] gap-y-[44px] md:grid-cols-2 max-lg:gap-y-[34px]">
                {solutionSide.map((media) => (
                  <motion.figure
                    key={media.src}
                    className="m-0"
                    {...mediaFadeUp}
                  >
                    {renderMediaButton(media, "aspect-[16/10]")}
                    <figcaption className={CS_CAPTION_CLASS}>
                      {media.caption}
                    </figcaption>
                  </motion.figure>
                ))}
              </div>
            </section>

            {/* FEEDBACK */}
            <section id="feedback" className={CS_SECTION_CLASS}>
              <div className={CS_SECTION_HEAD_CLASS}>
                {renderHeading("Shipped, and it landed")}
                <motion.p className={CS_BODY_CLASS} {...fadeUp}>
                  Runbooks shipped as a core PSA module. The reaction from the
                  team and early customers was immediate — internally it was
                  called out as "a key feature of SuperOps," and customer
                  feedback flagged it as "absolutely phenomenal" within days of
                  release.
                </motion.p>
              </div>

              <motion.div className="flex flex-col gap-[18px]" {...fadeUp}>
                <blockquote className="m-0 max-w-[724px] border-l border-cs-fg pl-[24px] text-[24px] leading-[1.3] text-cs-fg max-lg:text-[18px]">
                  "Good job on the new Runbooks module, you guys smashed it,
                  it's amazing!"
                </blockquote>
                <div className="flex flex-wrap gap-[10px] pl-[25px]">
                  {reactions.map((reaction) => (
                    <span key={reaction} className={CS_PILL_CLASS}>
                      {reaction}
                    </span>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="rounded-[14px] bg-cs-panel p-[34px] max-lg:rounded-[6px] max-lg:p-[14px]"
                {...mediaFadeUp}
              >
                <div className="columns-1 gap-[24px] md:columns-2">
                  {testimonials.map((testimonial) => (
                    <button
                      key={testimonial.src}
                      type="button"
                      onClick={() => openLightbox(testimonial)}
                      aria-label={`Open full preview of ${testimonial.alt}`}
                      className="mb-[24px] block w-full cursor-zoom-in break-inside-avoid overflow-hidden rounded-[10px] bg-cs-frame shadow-[0_0_10px_rgba(0,0,0,0.06)] last:mb-0 max-lg:mb-[14px]"
                    >
                      <img
                        src={testimonial.src}
                        alt={testimonial.alt}
                        loading="lazy"
                        className="block h-auto w-full"
                      />
                    </button>
                  ))}
                </div>
              </motion.div>
            </section>

            {/* FULL DECK */}
            <section id="full-deck" className={CS_SECTION_CLASS}>
              <div className={CS_SECTION_HEAD_CLASS}>
                {renderHeading("Want the full process?")}
                <motion.p className={CS_BODY_CLASS} {...fadeUp}>
                  The full design deck covers research, flows, and edge cases
                  not shown here.
                </motion.p>
              </div>
              <motion.div className="flex flex-wrap gap-[14px]" {...fadeUp}>
                <a
                  href={deckPdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-[8px] rounded-full bg-cs-fg px-[20px] py-[12px] text-[16px] leading-none font-bold text-cs-frame! transition-opacity duration-150 hover:opacity-80"
                >
                  View full deck (PDF)
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="size-[14px]"
                  >
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </a>
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="cursor-pointer rounded-full border border-cs-fg px-[20px] py-[12px] text-[16px] leading-none font-bold text-cs-fg transition-colors duration-150 hover:bg-cs-fg hover:text-cs-frame"
                >
                  Back to home
                </button>
              </motion.div>
            </section>
          </main>
        </div>
      </div>

      {lightboxImage && (
        <ImageLightbox
          src={lightboxImage.src}
          alt={lightboxImage.alt}
          type={lightboxImage.type}
          onClose={() => setLightboxImage(null)}
        />
      )}
    </MotionConfig>
  );
}
