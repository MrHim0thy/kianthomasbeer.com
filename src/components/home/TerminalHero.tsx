import InteractiveTerminal from './InteractiveTerminal';

export default function TerminalHero() {
  return <section className="terminal-hero" aria-label="Meet Kian">
    <InteractiveTerminal />
    <div className="terminal-portrait">
      <span className="terminal-portrait-name" aria-hidden="true">KIAN</span>
      <div className="terminal-portrait-frame"><img src="/images/kian-website-portrait.png" width="3018" height="3278" alt="Kian Thomasbeer smiling in a light blue shirt" fetchPriority="high" /></div>
    </div>
  </section>;
}
