import { Link, useLocation } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { projects, getProjectCategories } from "../content";
import { Heading, Art } from "../components/Shared";
import NotFound from "./NotFound";
export default function ProjectDetail() {
  const slug = useLocation().pathname.split("/").pop();
  const p = projects.find((p) => p.slug === slug);
  if (!p) return <NotFound />;
  return (
    <>
      <Link className="back-link" to="/projects">
        <ChevronLeft size={16} />
        All projects
      </Link>
      <Heading label={getProjectCategories(p).join(" · ")} title={p.title} text={p.description} />
      <div className="tags detail-tags">
        {p.tools.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
      {!p.overview && <Art kind={p.kind} large />}
      <div className="detail-layout">
        <aside>
          {p.overview ? (
            <>
              <div className="eyebrow">INSTITUTION & YEAR</div>
              <p>{p.institution}</p>
              <p><time dateTime={String(p.year)}>{p.year}</time></p>
            </>
          ) : (
            <>
              <div className="eyebrow">PROJECT NOTES</div>
              <p>Initial overview</p>
              <p className="muted">Further documentation coming soon.</p>
            </>
          )}
        </aside>
        <div>
          {p.overview ? (
            <section className="prose-block">
              <h2>Project overview</h2>
              <p>{p.overview}</p>
            </section>
          ) : [
            ["The problem", p.problem],
            ["The approach", p.approach],
            ["Tools & methods", p.tools.join(" · ")],
            ["Results", p.results],
            [
              "Visuals & source",
              "Placeholder: project screenshots, source links, and supporting materials have not yet been provided. The artwork above is an abstract illustration.",
            ],
          ].map(([t, b]) => (
            <section className="prose-block" key={t}>
              <h2>{t}</h2>
              <p>{b}</p>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
