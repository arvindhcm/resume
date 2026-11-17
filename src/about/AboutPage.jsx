import { useEffect } from "react";
import SiteHeader from "../components/SiteHeader.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import { Highlighter } from "@/components/ui/highlighter";
import { SECTION_HEADING_CLASS } from "../lib/typography.js";
import resumePdf from "../assets/Arvindhcm_Designer_resume.pdf";

export default function AboutPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <>
      <SiteHeader />

      <main className="mx-auto min-h-svh max-w-[1120px] px-[25px] pt-7 pb-[90px]">
        <section className="pointer-events-auto max-w-[620px] pt-24 max-[560px]:pt-16">
          <h1 className={SECTION_HEADING_CLASS}>The story so far</h1>
          {/* EDIT: your story */}
          <div className="mt-5 flex flex-col gap-3 text-[15.5px] leading-[1.7] text-muted">
            <p className="m-0">
              Started out untangling complex{" "}
              <Highlighter action="underline" color="var(--accent)">
                <span className="text-ink">
                  ETL workflows and SQL editor at Zoho
                </span>
              </Highlighter>
              , learning that good design is really about making hard things
              feel obvious. That systems thinking followed me to SuperOps, where
              I&rsquo;ve spent the last two years building an{" "}
              <Highlighter action="highlight" color="var(--accent-soft-border)">
                <span className="text-ink">AI-native ticketing platform</span>
              </Highlighter>{" "}
              from scratch. Somewhere between shipping Runbooks and chasing
              state sync bugs, I found the kind of work I actually want to keep
              doing.
            </p>
            <p className="m-0">
              Off the clock, you&rsquo;ll find me playing football or out on
              long mountain drives.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter resumeHref={resumePdf} />
    </>
  );
}
