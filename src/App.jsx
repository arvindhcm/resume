import { useEffect, useRef } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import CursorTrail from "./components/CursorTrail.jsx";
import SiteFooter from "./components/SiteFooter.jsx";
import PageLoader from "./components/PageLoader.jsx";
import SiteHeader from "./components/SiteHeader.jsx";
import CompanyPill from "./components/CompanyPill.jsx";
import superopsMark from "./assets/superops-mark.svg";
import zohoMark from "./assets/zoho-mark.svg";
import resumePdf from "./assets/Arvindhcm_Designer_resume.pdf";
import { Highlighter } from "@/components/ui/highlighter";
import { BentoGrid, BentoCard } from "@/components/ui/bento-grid";
import CaseStudyRunbooks from "./work/runbooks/CaseStudyRunbooks.jsx";
import CaseStudyMonica from "./work/monica/CaseStudyMonica.jsx";
import AboutPage from "./about/AboutPage.jsx";
import { SECTION_HEADING_CLASS } from "./lib/typography.js";
import "./App.css";
import runbookDemo from "./work/runbooks/assets/runbookDemo.mp4";
import similarTicket from "./work/monica/assets/similarticket.mp4";

// EDIT: roles shown in the Experience list, newest first
const EXPERIENCE = [
  {
    company: "SuperOps",
    href: "https://superops.com",
    logo: superopsMark,
    focus: "AI-native ticketing platform",
    years: "2023 – Present",
  },
  {
    company: "Zoho",
    href: "https://www.zoho.com",
    logo: zohoMark,
    focus: "ETL workflows & SQL editor",
    years: "2019 – 2023",
  },
];

const [CURRENT_COMPANY, PREVIOUS_COMPANY] = EXPERIENCE;

/*
  QUICK EDIT GUIDE
  Search for "EDIT:" comments throughout this file — each one
  marks a spot to swap in your own name, bio, work, and links.
  Colors, fonts, and spacing live in the CSS custom properties
  at the top of src/index.css.
*/

export default function App() {
  return (
    <>
      <PageLoader />
      <div className="relative z-10">
        <CursorTrail />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route
            path="/work/unified-runbooks"
            element={<CaseStudyRunbooks />}
          />
          <Route path="/work/monica-ai" element={<CaseStudyMonica />} />
        </Routes>
      </div>
    </>
  );
}

function Home() {
  const cardRefs = useRef([]);
  cardRefs.current = [];
  const navigate = useNavigate();
  const location = useLocation();

  const registerCard = (el) => {
    if (el) cardRefs.current.push(el);
  };

  useEffect(() => {
    const cards = cardRefs.current;
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
              setTimeout(() => entry.target.classList.add("in-view"), i * 40);
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12 },
      );
      cards.forEach((c) => io.observe(c));
      return () => io.disconnect();
    }
    cards.forEach((c) => c.classList.add("in-view"));
  }, []);

  useEffect(() => {
    if (!location.hash) return;
    document.getElementById(location.hash.slice(1))?.scrollIntoView();
  }, [location.hash, location.key]);

  return (
    <>
      <SiteHeader />

      <main className="mx-auto max-w-[1120px] px-[25px] pt-7 pb-[90px]">
        <section className="pointer-events-auto max-w-[620px] pt-24 text-[15.5px] leading-[1.7] max-[560px]:pt-16">
          {/* EDIT: intro copy */}
          <h1 className="m-0 text-[15.5px] font-medium text-ink">
            I&rsquo;m Arvindh.
          </h1>
          <div className="mt-1.5 flex flex-col gap-2 text-muted">
            <p className="m-0">
              Product Designer / UX Engineer @{" "}
              <CompanyPill
                name={CURRENT_COMPANY.company}
                href={CURRENT_COMPANY.href}
                logo={CURRENT_COMPANY.logo}
              />
              , previously at{" "}
              <CompanyPill
                name={PREVIOUS_COMPANY.company}
                href={PREVIOUS_COMPANY.href}
                logo={PREVIOUS_COMPANY.logo}
              />
              .
            </p>
            <p className="m-0">
              I design 0→1 products, help them scale, and I design in code. I
              obsess over creating delightful experiences through taste,
              interaction, and craft, even more so now that AI has made it easy
              to build things and everything looks the same.
            </p>
            <p className="m-0">
              7+ years across design &amp; dev, based in Chennai, India.
            </p>
            <p className="m-0">
              <Highlighter action="highlight" color="var(--accent-soft-border)">
                <span className="text-ink">Open to remote work</span>
              </Highlighter>{" "}
              across the US, EU, New Zealand and India, and happy to overlap
              with your timezone.
            </p>
          </div>
        </section>

        <section id="work" className="mt-24 scroll-mt-8 max-[560px]:mt-16">
          <h2 className={SECTION_HEADING_CLASS}>Work</h2>
          <BentoGrid className="mt-6">
            {/* WORK — main piece. EDIT: replace gradient block with a real screenshot,
              update tag/title/description. To use an image instead of the gradient,
              swap the inline background-image style below for your asset. */}

            <BentoCard
              id="work1"
              ref={registerCard}
              className="card card--work work-mint work-featured span-4c span-2r card--clickable"
              role="button"
              tabIndex={0}
              data-cursor-label="Show details"
              onClick={() => navigate("/work/unified-runbooks")}
              onKeyDown={(e) =>
                (e.key === "Enter" || e.key === " ") &&
                navigate("/work/unified-runbooks")
              }
            >
              <div className="work-left">
                <span className="work-tag">2024 - 2025</span>
                <div className="work-spacer"></div>
                <div className="work-copy">
                  <h3>Unified Runbooks — SuperOps PSA</h3>
                  <p>
                    Turning SOPs into guided, automated workflows. Click to read
                    the case study.
                  </p>
                </div>
              </div>
              <video
                className="w-1/2 p-8"
                src={runbookDemo}
                autoPlay
                loop
                muted
                playsInline
                // style={{ padding: "30px" }}
              />
              {/* <img
              className="work-thumb"
              src={thumbnail}
              alt="Close-up of the runbook canvas with checklist and script nodes"
              loading="lazy"
            /> */}
            </BentoCard>

            {/* WORK — secondary piece. EDIT as above. */}
            <BentoCard
              id="work2"
              ref={registerCard}
              className="card card--work work-sky work-featured span-4c span-2r card--clickable"
              role="button"
              tabIndex={0}
              data-cursor-label="Show details"
              onClick={() => navigate("/work/monica-ai")}
              onKeyDown={(e) =>
                (e.key === "Enter" || e.key === " ") &&
                navigate("/work/monica-ai")
              }
            >
              <div className="work-left">
                <span className="work-tag">2025 - 2026</span>
                <div className="work-spacer"></div>
                <div className="work-copy">
                  <h3>Monica AI — SuperOps</h3>
                  <p>
                    Designing trust into an AI that gets to act on its own.
                    Click to read the case study.
                  </p>
                </div>
              </div>
              <video
                className="w-3/5"
                src={similarTicket}
                autoPlay
                loop
                muted
                playsInline
              />
              {/* <img
              className="w-3/5 object-cover"
              // src={monicaHero}
              alt="Monica AI product walkthrough inside the SuperOps console"
              loading="lazy"
            /> */}
            </BentoCard>
          </BentoGrid>
        </section>

        <section className="pointer-events-auto mt-24 max-w-[620px] max-[560px]:mt-16">
          <h2 className={SECTION_HEADING_CLASS}>Experience</h2>
          <ul className="m-0 mt-5 flex list-none flex-col gap-1 p-0 text-[15.5px] leading-[1.7]">
            {EXPERIENCE.map((role) => (
              <li
                key={role.company}
                className="flex items-center justify-between gap-6 py-1"
              >
                <span className="flex min-w-0 items-center gap-2.5 text-muted">
                  <CompanyPill
                    name={role.company}
                    href={role.href}
                    logo={role.logo}
                    className="ml-0"
                  />
                  <span className="truncate max-[480px]:hidden">
                    {role.focus}
                  </span>
                </span>
                <span className="shrink-0 text-sm text-muted tabular-nums">
                  {role.years}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <SiteFooter resumeHref={resumePdf} />
    </>
  );
}
