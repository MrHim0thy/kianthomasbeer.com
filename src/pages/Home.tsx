import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight, BookOpen, PersonStanding, UserRound, Mail } from "lucide-react";
import { profile } from "../content";
import { featuredProjects } from "../content/projects";
import { ProfileLinks, ProjectCard } from "../components/Shared";
import TerminalHero from "../components/home/TerminalHero";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-editorial">
      <TerminalHero />
      <section className="section" aria-labelledby="selected-work-title">
        <div className="section-heading">
          <div>
            <div className="eyebrow">SELECTED WORK</div>
            <h2 id="selected-work-title">Projects at the intersection <br />of data, people, and the real world.</h2>
          </div>
          <Link className="text-link" to="/projects">View all projects <ArrowUpRight size={18} /></Link>
        </div>
        <div className="project-grid" data-count={featuredProjects.length}>
          {featuredProjects.map(project => <ProjectCard key={project.slug} project={project} />)}
        </div>
      </section>

      <section className="home-explore" aria-labelledby="explore-title">
        <div className="home-explore-intro">
          <h2 id="explore-title">More than one <br />way to be <em>curious.</em></h2>
          <p>Ideas, competition, and the curiosity that keeps it interesting.</p>
        </div>
        <div className="home-destinations">
          <Link className="home-destination" to="/curiosity-journal"><BookOpen className="home-destination-icon" aria-hidden="true" /><h3>Curiosity Journal</h3><p>Learning, languages, and ideas that lead somewhere new.</p><ArrowRight className="home-destination-arrow" aria-hidden="true" /></Link>
          <Link className="home-destination" to="/performance-lab"><PersonStanding className="home-destination-icon" aria-hidden="true" /><h3>Performance Lab</h3><p>Ultimate frisbee, sports analytics, and athletic curiosity.</p><ArrowRight className="home-destination-arrow" aria-hidden="true" /></Link>
          <Link className="home-destination" to="/about"><UserRound className="home-destination-icon" aria-hidden="true" /><h3>About Me</h3><p>My background, experiences, and life beyond data.</p><ArrowRight className="home-destination-arrow" aria-hidden="true" /></Link>
        </div>
      </section>

      <section id="background" className="home-personal" aria-labelledby="personal-title">
        <figure className="home-personal-photo">
          <img src="/images/home/handstand-on-rock.jpg" width="1000" height="1335" alt="Kian doing a handstand on a rock with mountains stretching into the distance" loading="lazy" decoding="async" />

        </figure>
        <div className="home-personal-copy">
          <div className="eyebrow">A LITTLE PERSPECTIVE</div>
          <h2 id="personal-title">Finding connections.<br />Following questions.</h2>
          <p>Whether it’s a dataset, a new language, or a place I’ve never been, I’m drawn to the patterns that connect things. Statistics gives me one way to explore them. Curiosity usually does the rest.</p>
          <Link className="home-about-button" to="/about">Get to know me <ArrowRight size={18} aria-hidden="true" /></Link>
        </div>
      </section>

      <section className="home-capabilities" aria-labelledby="capabilities-title">
        <div className="section-heading"><div><div className="eyebrow">HOW I WORK</div><h2 id="capabilities-title">Curiosity, put to work<span className="lime">.</span></h2></div></div>
        <div className="home-capability-grid">
          {[
            { title: "Analyze", text: "Find patterns, ask questions, and make sense of complex information.", tools: "Python · R · SQL" },
            { title: "Build", text: "Turn ideas into models, tools, visualizations, and useful experiences.", tools: "Excel · Tableau · Power BI" },
            { title: "Communicate", text: "Make complicated ideas understandable and meaningful.", tools: "Visual storytelling · Research" },
           ].map((capability) => <div className="home-capability" key={capability.title}><h3>{capability.title}</h3><p>{capability.text}</p><span className="home-capability-tools">{capability.tools}</span></div>)}
        </div>
      </section>

      <section className="home-contact" id="contact" aria-labelledby="contact-title">
        <div><div className="eyebrow">LET’S CONNECT</div><h2 id="contact-title">Good things start<br />with a <em>conversation.</em></h2><p>I’m always interested in thoughtful problems, new ideas, and opportunities to work with curious people.</p></div>
        <div className="home-contact-actions"><a className="button primary" href={`mailto:${profile.email}`}><Mail size={18} /> Say hello <ArrowUpRight size={18} /></a><ProfileLinks /></div>
      </section>
    </div>
  );
}
