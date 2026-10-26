import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Heading } from "../components/Shared";
export default function Soundcheck() {
  return (
    <>
      <Heading
        label={"MUSIC, DATA & DISCOVERY"}
        title={"Soundcheck"}
        text={
          "A future music analytics experience exploring Spotify, Billboard, and YouTube data \u2014 including the question of what makes a hit song."
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
          {[
            "Music analytics",
            "Listening patterns",
            "Artists & playlists",
            "Discovery",
          ].map((topic) => (
            <span key={topic}>{topic}</span>
          ))}
        </div>
        <Link className="text-link" to="/projects/what-makes-a-hit-song">
          Explore the existing hit-song project <ArrowUpRight size={17} />
        </Link>
      </section>
    </>
  );
}
