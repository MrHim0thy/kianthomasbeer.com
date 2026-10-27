import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  NavLink,
  Link,
  Navigate,
  useLocation,
} from "react-router-dom";
import { MotionConfig, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { projects, articles, profile } from "./content";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import CuriosityJournal from "./pages/CuriosityJournal";
import PerformanceLab from "./pages/PerformanceLab";
import Soundcheck from "./pages/Soundcheck";
import ProjectDetail from "./pages/ProjectDetail";
import Article from "./pages/Article";
import NotFound from "./pages/NotFound";
const navigation = [
  { label: "Home", path: "/" },
  { label: "Projects", path: "/projects" },
  { label: "Curiosity Journal", path: "/curiosity-journal" },
  { label: "Performance Lab", path: "/performance-lab" },
  { label: "Soundcheck", path: "/soundcheck" },
];
function Brand() {
  return (
    <Link to="/" className="wordmark" aria-label="Kian Thomasbeer home">
      <img src="/brand/beer-buddy.png" width="56" height="48" alt="" />
      <span>
        kian<span className="brand-dot">.</span>
      </span>
    </Link>
  );
}
export default function App() {
  const [menu, setMenu] = useState(false);
  const location = useLocation();
  useEffect(() => {
    const anchor = location.hash.slice(1);
    const frame = requestAnimationFrame(() => {
      if (anchor) {
        document
          .getElementById(anchor)
          ?.scrollIntoView({ behavior: "instant" });
      } else {
        window.scrollTo(0, 0);
      }
    });
    setMenu(false);
    const path = location.pathname;
    const project = projects.find((p) => path === `/projects/${p.slug}`);
    const article = articles.find(
      (a) =>
        path === `/writing/${a.slug}` ||
        path === `/curiosity-journal/${a.slug}`,
    );
    document.title = `${project?.title || article?.title || navigation.find((n) => n.path === path)?.label || "Page not found"} — Kian Thomasbeer`;
    return () => cancelAnimationFrame(frame);
  }, [location.pathname, location.hash]);
  return (
    <MotionConfig reducedMotion="user">
      <a
        className="skip-link"
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main")?.focus();
          document.getElementById("main")?.scrollIntoView();
        }}
      >
        Skip to content
      </a>
      <div className="site-shell">
        <header className="site-header">
          <Brand />
          <button
            className="menu-toggle"
            aria-label={menu ? "Close navigation" : "Open navigation"}
            aria-expanded={menu}
            aria-controls="main-navigation"
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
          <nav
            id="main-navigation"
            className={menu ? "open" : ""}
            aria-label="Main navigation"
            onKeyDown={(e) => {
              if (e.key === "Escape") setMenu(false);
            }}
          >
            {navigation.map((n) => (
              <NavLink key={n.path} end={n.path === "/"} to={n.path}>
                {n.label}
              </NavLink>
            ))}
          </nav>
          <a
            className="header-contact"
            href={`mailto:${profile.email}`}
            aria-label="Contact Kian Thomasbeer by email"
          >
            Contact <ArrowUpRight size={16} />
          </a>
        </header>
        <motion.main
          id="main"
          tabIndex={-1}
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            <Route path="/curiosity-journal" element={<CuriosityJournal />} />
            <Route path="/performance-lab" element={<PerformanceLab />} />
            <Route path="/soundcheck" element={<Soundcheck />} />
            <Route path="/curiosity-journal/:slug" element={<Article />} />
            <Route path="/writing/:slug" element={<Article />} />
            <Route
              path="/writing"
              element={<Navigate to="/curiosity-journal" replace />}
            />
            <Route
              path="/about"
              element={
                <Navigate to={{ pathname: "/", hash: "#background" }} replace />
              }
            />
            <Route
              path="/life"
              element={<Navigate to="/performance-lab" replace />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </motion.main>
        <footer>
          <Brand />
          <p>A work in progress. Just like the person behind it.</p>
          <span>© {new Date().getFullYear()} Kian Thomasbeer</span>
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({
                top: 0,
                behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
                  ? "instant"
                  : "smooth",
              });
            }}
            aria-label="Back to top"
          >
            ↑
          </a>
        </footer>
      </div>
    </MotionConfig>
  );
}
