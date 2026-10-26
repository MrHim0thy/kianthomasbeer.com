import { Heading } from "../components/Shared";
export default function PerformanceLab() {
  return (
    <>
      <Heading
        label={"WHERE ATHLETICS MEETS ANALYTICS"}
        title={"Performance Lab"}
        text={
          "A future interactive space for ultimate frisbee and athletic performance: workout history, training trends, recovery insights, and personal goals."
        }
      />
      <section className="placeholder-panel">
        <span className="sample">In development</span>
        <h2>A little room for what’s next.</h2>
        <p>
          This space is taking shape. No accounts are connected and no personal
          statistics are displayed.
        </p>
        <div className="tags">
          {["Ultimate frisbee", "Training", "Recovery", "Goals"].map(
            (topic) => (
              <span key={topic}>{topic}</span>
            ),
          )}
        </div>
      </section>
    </>
  );
}
