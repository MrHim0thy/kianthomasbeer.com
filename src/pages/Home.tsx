import { Link } from "react-router-dom";
import { ArrowUpRight, Mail } from "lucide-react";
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
            <div className="eyebrow">01 / SELECTED WORK</div>
            <h2 id="selected-work-title">A few things I’ve<br />put my mind to<span className="lime">.</span></h2>
          </div>
          <Link className="text-link" to="/projects">All projects <ArrowUpRight size={18} /></Link>
        </div>
        <div className="project-grid">
          {featuredProjects.map(project => <ProjectCard key={project.slug} project={project} />)}
        </div>
      </section>

      <section className="home-explore" aria-labelledby="explore-title">
        <div className="section-heading">
          <div>
            <div className="eyebrow">02 / KEEP EXPLORING</div>
            <h2 id="explore-title">There’s more to the story<span className="lime">.</span></h2>
          </div>
          <p>Different interests. The same curiosity.</p>
        </div>
        <div className="home-destinations">
          <Link className="home-destination home-journal" to="/curiosity-journal">
            <div className="home-journal-art" aria-hidden="true"><span>What if?</span><span>Why?</span><span>What’s next?</span></div>
            <div className="home-destination-copy"><span className="eyebrow">NOTES FROM THE PROCESS</span><h3>Curiosity Journal <ArrowUpRight size={22} /></h3><p>Questions, learning notes, and ideas worth following.</p></div>
          </Link>
          <Link className="home-destination home-performance" to="/performance-lab">
            <img src="/images/home/ultimate-team.jpg" width="1400" height="929" alt="Five ultimate frisbee teammates sharing a moment on the sideline bench" loading="lazy" decoding="async" />
            <div className="home-destination-copy"><span className="eyebrow">ON AND OFF THE FIELD</span><h3>Performance Lab <ArrowUpRight size={22} /></h3><p>Competition, teamwork, and a curiosity about performance.</p></div>
          </Link>
          <Link className="home-destination home-about-destination" to="/about">
            <div className="home-about-art" aria-hidden="true"><span>Data is one<br />part of <em>me.</em></span></div>
            <div className="home-destination-copy"><span className="eyebrow">THE PERSON BEHIND IT ALL</span><h3>About Me <ArrowUpRight size={22} /></h3><p>The experiences and interests that shape how I see things.</p></div>
          </Link>
        </div>
      </section>

      <section id="background" className="home-personal" aria-labelledby="personal-title">
        <figure className="home-personal-photo">
          <img src="/images/home/handstand-on-rock.jpg" width="1000" height="1335" alt="Kian doing a handstand on a rock with mountains stretching into the distance" loading="lazy" decoding="async" />
          <figcaption>A different perspective, every now and then.</figcaption>
        </figure>
        <div className="home-personal-copy">
          <div className="eyebrow">03 / A LITTLE PERSPECTIVE</div>
          <h2 id="personal-title">I like figuring out<br />how things work<span className="lime">.</span></h2>
          <p>Whether it’s a dataset, a new language, or a place I’ve never been, I’m drawn to the patterns that connect things. Statistics gives me one way to explore them. Curiosity usually does the rest.</p>
          <p>My background is in Applied Statistics at the University of Virginia, with a minor in Business. Beyond the data, you’ll find me playing ultimate, discovering music, or trying something new.</p>
          <Link className="text-link" to="/about">Meet the person behind the projects <ArrowUpRight size={18} /></Link>
          <div className="home-curious"><span className="eyebrow">CURRENTLY CURIOUS ABOUT</span><p>Languages, machine learning, and the questions hiding in everyday data.</p></div>
        </div>
      </section>

      <section className="home-capabilities" aria-labelledby="capabilities-title">
        <div className="section-heading"><div><div className="eyebrow">04 / HOW I WORK</div><h2 id="capabilities-title">From questions to something useful<span className="lime">.</span></h2></div></div>
        <div className="home-capability-grid">
          {[
            { title: "Analyze", text: "Explore data, build statistical models, and look for patterns in complex questions.", tools: "Python · R · SQL" },
            { title: "Build", text: "Turn analysis into dashboards, data applications, visualizations, and repeatable workflows.", tools: "Excel · Tableau · Power BI" },
            { title: "Communicate", text: "Translate technical findings into clear explanations, visual stories, and useful insights.", tools: "Visual storytelling · Research" },
          ].map((capability, index) => <div className="home-capability" key={capability.title}><span className="home-capability-number" aria-hidden="true">0{index + 1}</span><h3>{capability.title}</h3><p>{capability.text}</p><span className="home-capability-tools">{capability.tools}</span></div>)}
        </div>
      </section>

      <section className="home-contact" id="contact" aria-labelledby="contact-title">
        <div><div className="eyebrow">05 / LET’S CONNECT</div><h2 id="contact-title">Have a question<br />worth exploring<span className="lime">?</span></h2><p>I’m always interested in thoughtful problems, new ideas, and opportunities to work with curious people.</p></div>
        <div className="home-contact-actions"><a className="button primary" href={`mailto:${profile.email}`}><Mail size={18} /> Say hello <ArrowUpRight size={18} /></a><ProfileLinks /></div>
      </section>
    </div>
  );
}
