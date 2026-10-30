import { profile } from '../../content';
import { projects, getProjectRoute } from '../../content/projects';
import { homeTerminalContent as copy, completedRandomProjectSlugs } from '../../content/homeTerminal';

export interface TerminalItem { label?: string; text?: string; href?: string; internal?: boolean }
export interface TerminalOutput { title?: string; paragraphs?: string[]; items?: TerminalItem[] }
export type CommandResult = { kind: 'output'; output: TerminalOutput } | { kind: 'navigate'; to: string } | { kind: 'clear' } | { kind: 'none' };
export interface CommandContext { previousRandomDestination: string | null; random: () => number }
interface CommandDefinition { name: string; description: string; visible: boolean; run: (context: CommandContext) => CommandResult }
const output = (value: TerminalOutput): CommandResult => ({ kind: 'output', output: value });
export const eligibleRandomRoutes = projects.filter(project => completedRandomProjectSlugs.includes(project.slug)).map(getProjectRoute);
export function chooseRandomDestination(routes: readonly string[], previous: string | null, random: () => number): string | null {
  const distinct = [...new Set(routes)].filter(route => route.startsWith('/') && !route.startsWith('//') && route !== '/');
  const choices = distinct.length > 1 ? distinct.filter(route => route !== previous) : distinct;
  return choices.length ? choices[Math.min(choices.length - 1, Math.max(0, Math.floor(random() * choices.length)))] : null;
}
export const commandRegistry: readonly CommandDefinition[] = [
  { name: 'help', description: 'Show available commands', visible: true, run: () => output({ title: 'AVAILABLE COMMANDS', items: [...commandRegistry.filter(command => command.visible && command.name !== 'help'), commandRegistry.find(command => command.name === 'help')!].map(command => ({ label: command.name, text: command.description })) }) },
  { name: 'whoami', description: 'Who I am', visible: true, run: () => output({ paragraphs: copy.whoami }) },
  { name: 'about', description: 'A little more about me', visible: true, run: () => output({ title: 'ABOUT ME', paragraphs: copy.biography }) },
  { name: 'projects', description: 'Explore my work', visible: true, run: () => output({ title: 'FEATURED PROJECTS', items: projects.map(project => ({ label: project.title, href: getProjectRoute(project), internal: true })) }) },
  { name: 'skills', description: 'My technical toolkit', visible: true, run: () => output({ title: 'MY TOOLKIT', items: copy.skills }) },
  { name: 'interests', description: 'What I enjoy outside work', visible: true, run: () => output({ title: 'OUTSIDE THE TERMINAL', items: copy.interests }) },
  { name: 'now', description: "What I'm currently doing", visible: true, run: () => output({ title: 'CURRENTLY…', items: copy.currentActivities }) },
  { name: 'random', description: 'Take me somewhere unexpected', visible: true, run: context => {
    const route = chooseRandomDestination(eligibleRandomRoutes, context.previousRandomDestination, context.random);
    return route ? { kind: 'navigate', to: route } : output({ paragraphs: ["Nothing unexpected is ready yet. Try 'projects' instead."] });
  } },
  { name: 'contact', description: 'Get in touch', visible: true, run: () => output({ title: "LET'S CONNECT", items: [
    { label: 'Email', text: profile.email, href: `mailto:${profile.email}` },
    { label: 'LinkedIn', text: 'LinkedIn profile', href: profile.linkedin },
    { label: 'GitHub', text: 'GitHub profile', href: profile.github },
  ] }) },
  { name: 'clear', description: 'Clear terminal output', visible: true, run: () => ({ kind: 'clear' }) },
  { name: 'sudo', description: '', visible: false, run: () => output({ paragraphs: ["Permission denied. Even Beer Buddy doesn't have admin privileges."] }) },
];
export const suggestedCommands = commandRegistry.filter(command => command.visible);
export const maxCommandLength = 160;
export function executeCommand(value: string, context: CommandContext): CommandResult {
  const trimmed = value.slice(0, maxCommandLength).trim();
  if (!trimmed) return { kind: 'none' };
  const command = commandRegistry.find(item => item.name === trimmed.toLowerCase());
  return command ? command.run(context) : output({ paragraphs: [`Command not found: ${trimmed}. Type 'help' to see available commands.`] });
}

export interface TerminalState { input: string; history: string[]; historyIndex: number | null; draft: string; output: TerminalOutput | null; announcement: number }
export const initialTerminalState: TerminalState = { input: '', history: [], historyIndex: null, draft: '', output: null, announcement: 0 };
export type TerminalAction = { type: 'edit'; value: string } | { type: 'history'; direction: 'up' | 'down' } | { type: 'execute'; command: string; result: CommandResult };
export function terminalReducer(state: TerminalState, action: TerminalAction): TerminalState {
  if (action.type === 'edit') return { ...state, input: action.value.slice(0, maxCommandLength), historyIndex: null, draft: '' };
  if (action.type === 'history') {
    if (!state.history.length) return state;
    if (action.direction === 'up') {
      const index = state.historyIndex === null ? state.history.length - 1 : Math.max(0, state.historyIndex - 1);
      return { ...state, historyIndex: index, input: state.history[index], draft: state.historyIndex === null ? state.input : state.draft };
    }
    if (state.historyIndex === null) return state;
    const index = state.historyIndex + 1;
    return index >= state.history.length ? { ...state, input: state.draft, historyIndex: null, draft: '' } : { ...state, input: state.history[index], historyIndex: index };
  }
  if (action.result.kind === 'none') return state;
  if (action.result.kind === 'clear') return { ...initialTerminalState, history: [], announcement: state.announcement + 1 };
  return { ...state, input: '', draft: '', historyIndex: null, history: [...state.history, action.command.trim()], output: action.result.kind === 'output' ? action.result.output : null, announcement: state.announcement + 1 };
}
