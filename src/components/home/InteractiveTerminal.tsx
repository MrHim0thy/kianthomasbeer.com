import { useId, useReducer, useRef, type FormEvent, type KeyboardEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowUpRight, CornerDownLeft } from 'lucide-react';
import { ProfileLinks } from '../Shared';
import { executeCommand, initialTerminalState, maxCommandLength, suggestedCommands, terminalReducer, type TerminalItem, type TerminalOutput } from './terminalCommands';
import './InteractiveTerminal.css';

// Only remembers the last random destination in this browser's JS lifetime; no storage or history tracking.
let previousRandomDestination: string | null = null;
function OutputItem({ item }: { item: TerminalItem }) {
  if (!item.href) return <><strong>{item.label}</strong>{item.text && <span> — {item.text}</span>}</>;
  if (item.internal) return <Link to={item.href}>{item.label}<ArrowUpRight size={13} aria-hidden="true" /></Link>;
  const email = item.href.startsWith('mailto:');
  return <a href={item.href} target={email ? undefined : '_blank'} rel={email ? undefined : 'noopener noreferrer'}
    aria-label={`${item.label}${email ? `: ${item.text}` : ' (opens in a new tab)'}`}>
    {item.label}{item.text && <span> — {item.text}</span>}<ArrowUpRight size={13} aria-hidden="true" />
  </a>;
}
function CommandOutput({ value }: { value: TerminalOutput }) {
  return <>
    {value.title && <p className="terminal-output-title">{value.title}</p>}
    {value.paragraphs?.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
    {value.items && <ul>{value.items.map((item, index) => <li key={index}><OutputItem item={item} /></li>)}</ul>}
  </>;
}
export default function InteractiveTerminal() {
  const [state, dispatch] = useReducer(terminalReducer, initialTerminalState);
  const input = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const id = useId();
  const announcedResult = state.output ? [state.output.title, ...(state.output.paragraphs ?? []), ...(state.output.items ?? []).map(item => [item.label, item.text].filter(Boolean).join(': '))].filter(Boolean).join('. ') : 'Terminal output and history cleared.';
  function run(value: string, origin: 'form' | 'suggestion') {
    const result = executeCommand(value, { previousRandomDestination, random: Math.random });
    dispatch({ type: 'execute', command: value, result });
    if (result.kind === 'none') return;
    if (result.kind === 'navigate') {
      previousRandomDestination = result.to;
      navigate(result.to);
      return;
    }
    // A tapped pill on a touchscreen keeps focus on the pill and does not summon the keyboard.
    const desktopPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (origin === 'form' || desktopPointer) {
      input.current?.focus({ preventScroll: true });
      // A newly inserted result must not push a mobile typist's input beneath the keyboard.
      if (!desktopPointer) requestAnimationFrame(() => input.current?.scrollIntoView({ block: 'nearest', behavior: 'instant' }));
    }
  }
  function submit(event: FormEvent) { event.preventDefault(); run(state.input, 'form'); }
  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.nativeEvent.isComposing || !['ArrowUp', 'ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    dispatch({ type: 'history', direction: event.key === 'ArrowUp' ? 'up' : 'down' });
  }
  return <div className="home-terminal" aria-label="Kian’s interactive portfolio terminal">
    <div className="terminal-buddy" title="Psst... try typing a command."><img src="/brand/beer-buddy-hanging.png" width="1536" height="1024" alt="Beer Buddy in sunglasses gripping the terminal edge" /></div>
    <div className="terminal-titlebar"><span className="terminal-window-dots" aria-hidden="true"><i /><i /><i /></span><span className="terminal-window-label">kian@home:~</span></div>
    <div className="terminal-body">
      <div className="terminal-introduction">
        <p className="terminal-executed-command"><span>kian@home:~$</span> whoami</p>
        <h1>Hi, I’m <span>Kian.</span></h1>
        <p className="terminal-subtitle">Exploring data, technology, ideas, and everything in between.</p>
        <p className="terminal-welcome">Welcome to my little corner of the internet.</p>
        <div className="terminal-links"><Link className="button primary" to="/projects">Explore my work<ArrowUpRight size={18} aria-hidden="true" /></Link><ProfileLinks /></div>
      </div>
      <div className="terminal-interaction">
        <div className="terminal-announcement" role="status" aria-live="polite" aria-atomic="true">{state.announcement > 0 && <span key={state.announcement}>{announcedResult}</span>}</div>
        {state.output && <div className="terminal-result" role="region" tabIndex={0} aria-label="Latest terminal command result" key={state.announcement}><CommandOutput value={state.output} /></div>}
        <form className="terminal-form" onSubmit={submit}>
          <label className="terminal-input-label" htmlFor={`${id}-command`}>Portfolio terminal command</label>
          <span className="terminal-input-prompt" aria-hidden="true">kian@home:~$</span>
          <input ref={input} id={`${id}-command`} value={state.input} onChange={event => dispatch({ type: 'edit', value: event.target.value })} onKeyDown={onKeyDown} maxLength={maxCommandLength} placeholder="Type a command..." autoComplete="off" autoCapitalize="none" spellCheck={false} enterKeyHint="go" aria-describedby={`${id}-instructions`} />
          <button type="submit" className="terminal-submit" aria-label="Run command"><CornerDownLeft size={20} aria-hidden="true" /></button>
        </form>
        <p id={`${id}-instructions`} className="terminal-input-label">Type a command and press Enter, or choose a suggestion. Use Up and Down arrows to recall commands. Results appear above this input.</p>
        <div className="terminal-suggestions" role="group" aria-label="Suggested terminal commands">{suggestedCommands.map(command => <button key={command.name} type="button" onClick={() => run(command.name, 'suggestion')}>{command.name}</button>)}</div>
      </div>
    </div>
  </div>;
}
