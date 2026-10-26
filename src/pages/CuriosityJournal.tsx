import { Heading } from "../components/Shared";
export default function CuriosityJournal() {
  return (
    <>
      <Heading
        label={"WHAT I'M EXPLORING"}
        title={"Curiosity Journal"}
        text={
          "A space for blog posts, discoveries, learning notes, and interactive experiments."
        }
      />
      <section className="placeholder-panel">
        <span className="sample">In development</span>
        <h2>A little room for what’s next.</h2>
        <p>
          This space is taking shape. Original journal entries and experiments
          will be added here.
        </p>
        <div className="tags">
          {["German", "SQL", "Machine learning", "Statistics"].map((topic) => (
            <span key={topic}>{topic}</span>
          ))}
        </div>
      </section>
    </>
  );
}
