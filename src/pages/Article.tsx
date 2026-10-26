import { Link, useLocation } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { articles, readingTime } from "../content";
import { Heading } from "../components/Shared";
import NotFound from "./NotFound";
export default function Article() {
  const a = articles.find(
    (a) => a.slug === useLocation().pathname.split("/").pop(),
  );
  if (!a) return <NotFound />;
  return (
    <article className="reading">
      <Link className="back-link" to="/curiosity-journal">
        <ChevronLeft size={16} />
        Curiosity Journal
      </Link>
      <Heading
        label={`${a.category} / ${readingTime(a.body)} MIN READ`}
        title={a.title}
        text={a.description}
      />
      <div className="notice">
        Sample article · Demonstration content, not a published article by Kian.
      </div>
      <div className="article-body">
        {a.body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      <div className="reading-end">
        ✳<span>Keep asking interesting questions.</span>
      </div>
    </article>
  );
}
