import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Globe2,
  Disc3,
  Languages,
  Sparkles,
  Mail,
} from "lucide-react";
import { profile } from "../content";
import { featuredProjects } from "../content/projects";
import { ProfileLinks, ProjectCard } from "../components/Shared";
import TerminalHero from "../components/home/TerminalHero";
export default function Home() {
  return (
    <>
      <TerminalHero />
      <section className="section">
        <div className="section-heading">
          <div>
            <div className="eyebrow">01 / SELECTED WORK</div>
            <h2>
              A few things I’ve
              <br />
              put my mind to<span className="lime">.</span>
            </h2>
          </div>
          <Link className="text-link" to="/projects">
            All projects <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="project-grid">
          {featuredProjects.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </section>
      <section className="interest-strip">
        <span className="eyebrow">BEYOND THE SPREADSHEET</span>
        <div>
          {[
            "Data & discovery",
            "Music & discovery",
            "Ultimate frisbee",
            "Languages & ideas",
          ].map((t, i) => (
            <span key={t}>
              {
                [
                  <Sparkles key="data" />,
                  <Globe2 key="music" />,
                  <Disc3 key="sport" />,
                  <Languages key="languages" />,
                ][i]
              }
              {t}
            </span>
          ))}
        </div>
        <Link className="text-link" to="/performance-lab">
          Explore Performance Lab <ArrowUpRight size={17} />
        </Link>
      </section>
      <section className="section">
        <div className="section-heading">
          <div>
            <div className="eyebrow">02 / KEEP EXPLORING</div>
            <h2>
              More than one way to be curious<span className="lime">.</span>
            </h2>
          </div>
        </div>
        <div className="page-preview-grid">
          {[
            {
              title: "Curiosity Journal",
              route: "/curiosity-journal",
              text: "Learning notes, discoveries, and future experiments in German, SQL, machine learning, and statistics.",
            },
            {
              title: "Performance Lab",
              route: "/performance-lab",
              text: "A future space for ultimate frisbee, training, and athletic performance.",
            },
            {
              title: "Soundcheck",
              route: "/soundcheck",
              text: "Music, data, and discovery — with room to explore what makes a hit song.",
            },
          ].map((p) => (
            <Link className="page-preview" key={p.route} to={p.route}>
              <ArrowUpRight size={22} />
              <h3>{p.title}</h3>
              <p>{p.text}</p>
              <span>Explore this space →</span>
            </Link>
          ))}
        </div>
      </section>
      <Background />
    </>
  );
}
function Background() {
  return (
    <>
      <section id="background" className="home-background">
        <div className="about-grid">
          <div className="about-copy">
            <div className="eyebrow">A LITTLE BACKGROUND</div>
            <h2>
              Finding connections.
              <br />
              Following questions.
            </h2>
            <p>
              My background is in Applied Statistics at the University of
              Virginia, with a minor in Business. I’m interested in the ways
              analytics, technology, and research can help us understand complex
              questions.
            </p>
            <p>
              This site is a growing collection of my work, ideas, and interests
              — a digital home with room to evolve.
            </p>
            <ProfileLinks />
          </div>
        </div>
        <div className="about-lower">
          <section>
            <div className="eyebrow">THE TOOLKIT</div>
            <h2>Ways I work.</h2>
            <div className="skill-list">
              {["Python", "R", "SQL", "Excel", "Tableau", "Power BI"].map(
                (s) => (
                  <span key={s}>
                    {s}
                    <ArrowUpRight size={15} />
                  </span>
                ),
              )}
            </div>
          </section>
          <section>
            <div className="eyebrow">BACKGROUND & EXPERIENCE</div>
            <h2>A path in progress.</h2>
            <div className="timeline">
              <div>
                <span>EDUCATION · DATES TO COME</span>
                <h3>University of Virginia</h3>
                <p>B.A. Applied Statistics · Business minor</p>
              </div>
              <div>
                <span>EXPERIENCE · DETAILS TO COME</span>
                <h3>The next chapter belongs here.</h3>
                <p>
                  Career roles, organizations, and dates will be added once
                  provided.
                </p>
              </div>
            </div>
          </section>
        </div>
        <section className="contact" id="contact">
          <div className="eyebrow">LET’S CONNECT</div>
          <h2>
            Good things start
            <br />
            with a conversation<span className="lime">.</span>
          </h2>
          {profile.email ? (
            <a className="button primary" href={`mailto:${profile.email}`}>
              <Mail size={18} />
              Say hello
            </a>
          ) : (
            <p>
              Contact email coming soon. Verified social links and a
              downloadable resume will be added here.
            </p>
          )}
        </section>
      </section>
    </>
  );
}
