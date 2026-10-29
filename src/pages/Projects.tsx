import { useState } from "react";
import { Sparkles } from "lucide-react";
import { projects, categories, getProjectCategories } from "../content/projects";
import { Heading, ProjectCard } from "../components/Shared";
export default function Projects() {
  const [filter, setFilter] = useState("All");
  const list = projects.filter(
    (p) => filter === "All" || getProjectCategories(p).includes(filter),
  );
  return (
    <>
      <Heading
        label="WHAT I'VE BUILT"
        title="Projects"
        text="Explorations at the intersection of data, technology, and real-world questions."
      />
      <div className="filters" aria-label="Filter projects">
        {categories.map((c) => (
          <button
            aria-pressed={c === filter}
            className={c === filter ? "active" : ""}
            onClick={() => setFilter(c)}
            key={c}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="project-grid section-bottom">
        {list.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
        {!list.length && (
          <div className="empty">
            <Sparkles />
            <h3>Room for the next idea.</h3>
            <p>Projects in this category will appear here as they are added.</p>
          </div>
        )}
      </div>
    </>
  );
}
