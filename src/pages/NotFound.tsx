import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Heading } from "../components/Shared";
export default function NotFound() {
  return (
    <div className="empty section">
      <Heading
        label="404 / A SMALL DETOUR"
        title="This page is still uncharted."
      />
      <Link className="button primary" to="/">
        Back home <ArrowRight size={18} />
      </Link>
    </div>
  );
}
