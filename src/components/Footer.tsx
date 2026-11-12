import { Github, Linkedin, Mail } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { profile } from '../content';
import { navigation } from '../content/navigation';
import './Footer.css';

export default function Footer() {
  const isHome = useLocation().pathname === "/";
  return (
    <footer className={`terminal-footer${isHome ? " terminal-footer-integrated" : ""}`} aria-label="Site footer">
      <div className="footer-titlebar">
        <span className="footer-window-dots" aria-hidden="true"><i /><i /><i /></span>
        <span>kian@home:~/footer</span>
      </div>
      <div className="footer-terminal-body">
        <p className="footer-command"><span className="footer-prompt">kian@home:~$</span> echo &quot;Thanks for stopping by.&quot;</p>
        <p className="footer-greeting">Thanks for stopping by.</p>
        <div className="footer-links-row">
          <span className="footer-prompt" aria-hidden="true">~/links $</span>
          <nav aria-label="Footer navigation">
            {navigation.map(item => <Link key={item.path} to={item.path}>{item.label}</Link>)}
            <span className="footer-socials">
            {profile.github && <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub (opens in a new tab)"><Github size={18} strokeWidth={1.75} aria-hidden="true" /></a>}
            {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (opens in a new tab)"><Linkedin size={18} strokeWidth={1.75} aria-hidden="true" /></a>}
            <a href={`mailto:${profile.email}`} aria-label="Email Kian Thomasbeer"><Mail size={18} strokeWidth={1.75} aria-hidden="true" /></a>
            </span>
          </nav>
        </div>
        <div className="footer-meta"><span>© {new Date().getFullYear()} Kian Thomasbeer</span><span>Built with curiosity<span className="footer-cursor" aria-hidden="true">_</span></span></div>
      </div>
    </footer>
  );
}
