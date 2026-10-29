import { Link } from "react-router-dom";
import { Github, Linkedin, Download, ArrowUpRight } from "lucide-react";
import { profile } from "../content";
import { getProjectCategories, getProjectRoute, type Project } from "../content/projects";
export function ProfileLinks() {
  return (
    <div className="profile-links">
      {[
        { label: "GitHub", icon: <Github size={16} />, url: profile.github },
        {
          label: "LinkedIn",
          icon: <Linkedin size={16} />,
          url: profile.linkedin,
        },
        { label: "Resume", icon: <Download size={16} />, url: profile.resume },
      ].map((x) =>
        x.url ? (
          <a
            key={x.label}
            href={x.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${x.label === "Resume" ? "View résumé PDF" : x.label} (opens in a new tab)`}
          >
            {x.icon}
            {x.label}
            <ArrowUpRight size={13} />
          </a>
        ) : (
          <span key={x.label} title={`${x.label} will be added when provided`}>
            {x.icon}
            {x.label}
            <small>soon</small>
          </span>
        ),
      )}
    </div>
  );
}
export function Art({
  kind,
  large = false,
  illustration,
}: {
  kind: string;
  large?: boolean;
  illustration?: Project["illustration"];
}) {
  if (illustration) {
    return (
      <div className={`project-art ${kind} ${large ? "large" : ""}`}>
        <img
          src={illustration.src}
          alt={illustration.alt}
          width={illustration.width}
          height={illustration.height}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>
    );
  }
  return (
    <div
      className={`project-art ${kind} ${large ? "large" : ""}`}
      aria-label="Abstract illustration — not a project screenshot"
    >
      <span className="art-label">
        CONCEPT STUDY /{" "}
        {kind === "forecast"
          ? "DATA SYSTEMS"
          : kind === "music"
            ? "MUSIC & PATTERNS"
            : "CONNECTED THINKING"}
      </span>
      {kind === "forecast" ? (
        <div className="chart-art">
          {[22, 37, 30, 54, 43, 65, 59, 80, 71, 94, 87, 110].map((h, i) => (
            <i key={i} style={{ height: h }} />
          ))}
          <span className="chart-line" />
        </div>
      ) : kind === "music" ? (
        <div className="record">
          <div />
          <span>
            THE SHAPE
            <br />
            OF SOUND
          </span>
        </div>
      ) : (
        <div className="node-art">
          {Array.from({ length: 9 }, (_, i) => (
            <i
              key={i}
              style={{ transform: `rotate(${i * 40}deg) translateX(70px)` }}
            />
          ))}
          <span>N</span>
        </div>
      )}
      <span className="art-caption">
        ILLUSTRATIVE VISUAL · NOT PROJECT DATA
      </span>
    </div>
  );
}
export function ProjectCard({
  project: p,
}: {
  project: Project;
}) {
  return (
    <Link className="project-card group" to={getProjectRoute(p)}>
      <Art kind={p.kind} illustration={p.illustration} />
      <div className="card-meta">
        <span>{getProjectCategories(p).join(" · ")}</span>
        <ArrowUpRight size={20} />
      </div>
      <h3>{p.title}</h3>
      <p>{p.description}</p>
      <div className="tags">
        {p.tools.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
    </Link>
  );
}
export function Heading({
  label,
  title,
  text,
}: {
  label: string;
  title: string;
  text?: string;
}) {
  return (
    <header className="page-heading">
      <div className="eyebrow">{label}</div>
      <h1>{title}</h1>
      {text && <p>{text}</p>}
    </header>
  );
}
