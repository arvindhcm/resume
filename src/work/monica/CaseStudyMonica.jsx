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
  CS_SECTION_CLASS,
  CS_SECTION_HEAD_CLASS,
  CS_STAT_VALUE_CLASS,
  CS_SUMMARY_ROW_CLASS,
  CS_SUMMARY_VALUE_CLASS,
} from "../../lib/caseStudyStyles";

// import heroPoster from "./assets/videoThumbnail.webp";
import scriptgen from "./assets/scriptgen.png";
import worklog from "./assets/worklog.png";
// import autonomousImg from "./assets/autonomousagents.webp";
import ticketSummarization from "./assets/ticketSummarization.png";
import smartWorklogs from "./assets/smartWorklogs.gif";
import efficiencyReport from "./assets/efficiencyReport.gif";
import scriptGeneration from "./assets/scriptGeneration.gif";
import alloptionmonica from "./assets/alloptionmonica.png";
import similarTicket from "./assets/similarticket.mp4";
import samGodfrey from "./assets/samGodfrey.webp";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "challenge", label: "Challenge" },
  { id: "impact", label: "Impact" },
  { id: "problem", label: "Problem" },
  { id: "process", label: "Process" },
  { id: "solution", label: "Solution" },
  { id: "results", label: "Results" },
];

const projectMeta = [
  { label: "Role", value: "Product Designer, end‑to‑end" },
  { label: "Platform", value: "SuperOps AI / Monica" },
  { label: "Team", value: "1 designer · PM · AI/ML engineers" },
];

const solutionFeatures = [
  {
    src: alloptionmonica,
    alt: "Smart ticket deflection suggesting a help article before a ticket is filed",
    caption: "Smart deflection, suggesting the fix before the ticket exists.",
    label: "smart deflection",
  },
  {
    src: similarTicket,
    type: "video",
    alt: "Smart ticket deflection suggesting a help article before a ticket is filed",
    caption: "Smart deflection, suggesting the fix before the ticket exists.",
    label: "smart deflection",
  },
  {
    src: ticketSummarization,
    alt: "Monica summarizing a long ticket thread into a short, clear summary",
    caption:
      "Ticket summarization — tickets and worklogs condensed into quick, clear reads.",
    label: "ticket summarization",
  },
  {
    src: smartWorklogs,
    alt: "Smart worklogs converting a ticket reply into a formatted worklog",
    caption: "Smart worklogs, generated automatically from replies.",
    label: "smart worklogs",
  },

  {
    src: efficiencyReport,
    alt: "Efficiency report summarization highlighting bottlenecks across ticket categories",
    caption: "Efficiency reports, distilled into the bottlenecks that matter.",
    label: "efficiency reports",
  },
  {
    src: scriptGeneration,
    alt: "AI script generation turning a plain instruction into a ready-to-run script",
    caption: "Script generation, straight from plain instructions.",
    label: "script generation",
  },
];

const processTiers = [
  {
    src: scriptgen,
    alt: "AI-powered assistance suggesting next steps and scripts",
    tier: "01 · Your second set of eyes",
    title: "AI‑powered assistance",
    description:
      "Monica suggests next steps to help the team move faster — from generating scripts to spotting efficiency gaps across ticket categories.",
  },
  {
    src: worklog,
    alt: "Ask Monica executing a routine task under supervision",
    tier: "02 · Your trusted sidekick",
    title: "Ask Monica",
    description:
      "Monica evolves from assistance to execution, handling routine IT tasks under supervision so the team can focus on higher-value work.",
  },
];

const glanceSteps = [
  {
    label: "Challenge",
    headline: "Technicians didn't just need faster answers.",
    detail:
      "They needed to know when to trust an AI action outright, and when to keep a hand on the wheel.",
  },
  {
    label: "Approach",
    headline: "Split autonomy into explicit, escalating tiers.",
    detail:
      "Assistance, supervised execution, and full autonomy, instead of one black box.",
  },
  {
    label: "Solution",
    headline: "Monica summarizes and drafts by default.",
    detail:
      "It executes routine work under supervision and runs autonomous agents against policy, with every action carrying its own rationale.",
  },
];

const glanceImpactStats = [
  { value: "+40%", label: "Higher technician productivity" },
  { value: "80%", label: "Fewer tickets reaching the queue" },
  { value: "30%", label: "Lower operational costs" },
];

const resultStats = [
  { value: "30%", label: "lower operational costs" },
  { value: "40%", label: "higher technician productivity" },
  { value: "80%", label: "fewer tickets reaching the queue" },
];

// EDIT: swap copy, links, and credits for your own version of this story.
export default function CaseStudyMonica() {
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

  const renderStatGrid = (stats) => (
    <div className="grid grid-cols-1 gap-y-[34px] sm:grid-cols-[max-content_max-content] sm:gap-x-[114px] sm:gap-y-[54px] max-lg:sm:gap-x-[54px]">
      {stats.map((stat) => (
        <motion.div key={stat.label} className="flex flex-col" {...fadeUp}>
          <p className={CS_STAT_VALUE_CLASS}>{stat.value}</p>
          <p className={CS_MUTED_BODY_CLASS}>{stat.label}</p>
        </motion.div>
      ))}
    </div>
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
        aria-label="Monica AI case study"
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
              href="https://superops.com/monica-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-[6px] text-[15px] font-medium text-accent-ink! transition-colors duration-150 hover:text-ink!"
            >
              See Monica AI
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
                    <motion.span className="block overflow-hidden" {...headingMask}>
                      <motion.span className="block" {...headingRise}>
                        Monica AI
                      </motion.span>
                    </motion.span>
                  </h1>
                  <motion.p
                    className="text-[24px] leading-[1.2] text-cs-fg-muted max-lg:text-[16px]"
                    {...fadeUp}
                  >
                    Designing trust into an AI that gets to act on its own
                  </motion.p>
                </div>

                <motion.p className={CS_BODY_CLASS} {...fadeUp}>
                  A tiered agentic experience for IT teams — from a suggestion in
                  the margin to an agent that resolves the ticket outright — built
                  so technicians could tell, at every step,{" "}
                  <span className={CS_HIGHLIGHT_CLASS}>
                    exactly how much they could trust it.
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
                <img
                  src={scriptGeneration}
                  alt="Monica AI product walkthrough inside the SuperOps console"
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
                <div className={CS_SUMMARY_VALUE_CLASS}>
                  {renderStatGrid(glanceImpactStats)}
                </div>
              </section>
            </div>

            {/* PROBLEM */}
            <section id="problem" className={CS_SECTION_CLASS}>
              <div className={CS_SECTION_HEAD_CLASS}>
                {renderHeading(
                  "AI that acts is only useful if people believe its judgment",
                )}
                <motion.div className="flex flex-col gap-[16px]" {...fadeUp}>
                  <p className={CS_BODY_CLASS}>
                    IT teams were drowning in repetitive tickets, worklogs, and
                    scripts — the kind of work that's tedious but too
                    consequential to hand to a model that just "sounds
                    confident." Every automation vendor promised efficiency;
                    almost none earned the right to actually take the action,
                    because none of them showed their reasoning.
                  </p>
                  <p className={CS_BODY_CLASS}>
                    The design problem wasn't the model — it was the interface
                    around it:{" "}
                    <span className={CS_HIGHLIGHT_CLASS}>
                      how do you let an AI agent's authority grow, screen by
                      screen, at exactly the pace a technician's trust in it
                      grows too?
                    </span>
                  </p>
                </motion.div>
              </div>
            </section>

            {/* PROCESS — tiers of autonomy */}
            <section id="process" className={CS_SECTION_CLASS}>
              <div className={CS_SECTION_HEAD_CLASS}>
                {renderHeading("Process")}
                {/* {renderHeading("Two Tiers of trust, not one big black box")} */}
                <motion.p className={CS_BODY_CLASS} {...fadeUp}>
                  Rather than ship one omniscient assistant, Monica's autonomy was
                  designed as a ladder a team climbs deliberately — each rung with
                  its own visual language, so technicians always know which mode
                  they're in.
                </motion.p>
              </div>

              <div className="grid grid-cols-1 gap-[24px] md:grid-cols-2">
                {processTiers.map((tier) => (
                  <motion.figure
                    key={tier.title}
                    className="m-0 flex flex-col overflow-hidden rounded-[14px] bg-cs-panel max-lg:rounded-[6px]"
                    {...mediaFadeUp}
                  >
                    <button
                      type="button"
                      onClick={() => openLightbox(tier)}
                      aria-label={`Open full preview of ${tier.title}`}
                      className="block w-full cursor-zoom-in bg-cs-frame transition-opacity duration-150 hover:opacity-90"
                    >
                      <img
                        src={tier.src}
                        alt={tier.alt}
                        loading="lazy"
                        className="block h-auto w-full"
                      />
                    </button>
                    <figcaption className="flex flex-1 flex-col gap-[12px] p-[28px] max-lg:p-[24px]">
                      <span className="text-[14px] leading-none text-cs-fg-muted">
                        {tier.tier}
                      </span>
                      <h3 className="text-[20px] leading-[1.2] font-bold text-cs-fg">
                        {tier.title}
                      </h3>
                      <p className="text-[16px] leading-[26px] text-cs-fg max-lg:text-[14px] max-lg:leading-[22px]">
                        {tier.description}
                      </p>
                    </figcaption>
                  </motion.figure>
                ))}

                {/* <motion.figure
                  className="m-0 flex flex-col overflow-hidden rounded-[14px] bg-cs-panel max-lg:rounded-[6px]"
                  {...mediaFadeUp}
                >
                  <img
                    src={autonomousImg}
                    alt="Autonomous agent resolving an incident against policy"
                    loading="lazy"
                    className="block h-auto w-full bg-cs-frame"
                  />
                  <figcaption className="flex flex-1 flex-col gap-[12px] p-[28px] max-lg:p-[24px]">
                    <span className="text-[14px] leading-none text-cs-fg-muted">
                      03 · Your AI teammate
                    </span>
                    <h3 className="text-[20px] leading-[1.2] font-bold text-cs-fg">
                      Autonomous agents
                    </h3>
                    <p className="text-[16px] leading-[26px] text-cs-fg max-lg:text-[14px] max-lg:leading-[22px]">
                      Purpose-built agents that act on policy, resolve incidents,
                      and adapt to new patterns — with minimal human intervention.
                    </p>
                  </figcaption>
                </motion.figure> */}
              </div>
            </section>

            {/* SOLUTION — feature demos */}
            <section id="solution" className={CS_SECTION_CLASS}>
              <div className={CS_SECTION_HEAD_CLASS}>
                {renderHeading("The solution")}
                {/* {renderHeading("Watch Monica work")} */}
                <motion.p className={CS_BODY_CLASS} {...fadeUp}>
                  Five surfaces where the AI edge shows up in the daily grind:
                  turning tickets into summaries, replies into worklogs, plain
                  instructions into scripts, reports into flagged bottlenecks,
                  and incoming issues into deflected tickets before they're ever
                  filed.
                </motion.p>
              </div>

              <div className="grid grid-cols-1 items-start gap-x-[24px] gap-y-[44px] sm:grid-cols-2 lg:grid-cols-3 max-lg:gap-y-[34px]">
                {solutionFeatures.map((feature) => (
                  <motion.figure
                    key={feature.label + feature.src}
                    className="m-0"
                    {...mediaFadeUp}
                  >
                    <button
                      type="button"
                      onClick={() => openLightbox(feature)}
                      aria-label={`Open full preview of ${feature.label}`}
                      className={`${CS_MEDIA_PANEL_CLASS} transition-opacity duration-150 hover:opacity-90`}
                    >
                      {feature.type === "video" ? (
                        <video
                          src={feature.src}
                          autoPlay
                          muted
                          loop
                          playsInline
                          className="block h-auto w-full"
                        />
                      ) : (
                        <img
                          src={feature.src}
                          alt={feature.alt}
                          loading="lazy"
                          className="block h-auto w-full"
                        />
                      )}
                    </button>
                    <figcaption className={CS_CAPTION_CLASS}>
                      {feature.caption}
                    </figcaption>
                  </motion.figure>
                ))}
              </div>
            </section>

            {/* DIFFERENTIATION */}
            {/* <section id="why-it-works" className={CS_SECTION_CLASS}>
              <div className={CS_SECTION_HEAD_CLASS}>
                {renderHeading("Built to act. Designed for trust.")}
              </div>
              <div className="grid grid-cols-1 gap-[24px] lg:grid-cols-3">
                {[
                  {
                    icon: probabilisticImg,
                    title: "Probabilistic intelligence",
                    body: "Adapts intelligently to every situation instead of following rigid, brittle rules.",
                  },
                  {
                    icon: explainableImg,
                    title: "Explainable & governed",
                    body: "Every action carries clear AI rationale and a full audit trail — clarity and control at every step.",
                  },
                  {
                    icon: continuousLearningImg,
                    title: "Continuous learning",
                    body: "Refines its own decisions based on outcomes, feedback, and new policy — getting smarter every day.",
                  },
                ].map((pillar) => (
                  <motion.div
                    key={pillar.title}
                    className="flex flex-col gap-[12px] rounded-[14px] bg-cs-panel p-[28px] max-lg:rounded-[6px] max-lg:p-[24px]"
                    {...fadeUp}
                  >
                    <img src={pillar.icon} alt="" aria-hidden="true" className="size-12" />
                    <h3 className="text-[20px] leading-[1.2] font-bold text-cs-fg">
                      {pillar.title}
                    </h3>
                    <p className="text-[16px] leading-[26px] text-cs-fg max-lg:text-[14px] max-lg:leading-[22px]">
                      {pillar.body}
                    </p>
                  </motion.div>
                ))}
              </div>
            </section> */}

            {/* RESULTS */}
            <section id="results" className={CS_SECTION_CLASS}>
              <div className={CS_SECTION_HEAD_CLASS}>
                {renderHeading(
                  "Shipped autonomy that teams actually let off the leash",
                )}
                <motion.p className={CS_BODY_CLASS} {...fadeUp}>
                  Monica shipped across the tiered experience end-to-end — from
                  the first inline suggestion to fully autonomous agents running
                  against policy — and IT teams graduated up the trust ladder
                  faster than expected.
                </motion.p>
              </div>

              {renderStatGrid(resultStats)}

              <motion.figure className="m-0 flex flex-col gap-[24px]" {...fadeUp}>
                <blockquote className="m-0 max-w-[724px] border-l border-cs-fg pl-[24px] text-[24px] leading-[1.3] text-cs-fg max-lg:text-[18px]">
                  "The AI features in SuperOps have made our support more
                  efficient and let us focus on the bigger picture. Ticket
                  summarisation keeps us on top of things, while approved
                  AI-written scripts have been a breakthrough for our support."
                </blockquote>
                <figcaption className="flex items-center gap-[12px] pl-[25px]">
                  <img
                    src={samGodfrey}
                    alt=""
                    aria-hidden="true"
                    className="size-10 rounded-full bg-cs-panel object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="text-[16px] leading-[22px] font-bold text-cs-fg">
                      Sam Godfrey
                    </span>
                    <span className="text-[14px] leading-[20px] text-cs-fg-muted">
                      Co-Founder &amp; Director, TaskGroup (CompuTask Ltd)
                    </span>
                  </div>
                </figcaption>
              </motion.figure>
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
