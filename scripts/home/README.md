# Homepage terminal hero

## Scope / architecture

`src/pages/Home.tsx` replaces only its previous hero with `TerminalHero`. The header, footer, all sections below the hero, shared project data, assets and other pages are unchanged.

- `src/components/home/TerminalHero.tsx`: two-column / stacked composition, original transparent portrait, decorative KIAN lettering.
- `src/components/home/InteractiveTerminal.tsx`: permanent introduction and profile links; accessible form, suggestions, bounded latest result, live announcements and keyboard interactions.
- `src/components/home/InteractiveTerminal.css`: scoped light terminal styling; responsive typography based on terminal container width where supported; 44px touch controls; native scrolling; reduced-motion rules.
- `src/components/home/terminalCommands.ts`: exact command allowlist, structured result types, pure resolver, reviewed random-route selection, and session-state reducer.
- `src/content/homeTerminal.ts`: editable biography, interests, categorized skills, current activities, and reviewed completed-project IDs. Project records and contact URLs are imported from their existing central sources.
- `src/styles.css`: removed only retired `.hero*` / portrait selectors and the old mascot entrance keyframe. A PostCSS comparison verified other shared declarations and breakpoint contexts were identical.

## Commands

Ten suggestions: help, whoami, about, projects, skills, interests, now, random, contact, clear.
Hidden typed command: sudo.
No aliases or additional commands. Help lists the ten visible commands and never discloses sudo. Only random navigates automatically. Unknown input remains plain React-rendered text; no HTML injection or command execution is involved. No backend or AI interpretation API.

The introduction, Explore my work and profile links are outside the dynamic result. A result is 200px high on desktop and 180px on smaller screens, internally scrollable and replaced by each new result. Empty results are absent. Showing the first result can extend the hero; the introduction remains anchored and switching displayed results keeps the same result height. Clear removes results and all command recall history.

History and draft recall live only in React state and reset on unmount. The last random destination alone is held in ephemeral module memory, allowing non-repeat selection across homepage visits if multiple reviewed destinations are later enabled; nothing is written to storage or analytics. Typed input is capped at 160 characters. Mouse/keyboard execution restores input focus appropriately; touch suggestion taps do not focus the input or invoke the keyboard. Form execution on touch schedules a nearest-position scroll to keep input accessible after a result appears.

## Reused sources / assets / routes

- Portrait: `public/images/kian-website-portrait.png`, unchanged, including its transparency and source pixels. CSS frames existing transparent padding without stretching the source.
- Mascot: `public/brand/beer-buddy-hanging.png`, unchanged. The image's hands align to the terminal edge, not its old hero-divider position. Window dots are decorative, not fake controls.
- Profile links: existing ProfileLinks component and profile URLs / résumé.
- Projects: all four canonical project records / derived routes, including NeuroDecide. Project titles are taken from shared data rather than overwritten with brief shorthand. Some detail pages still contain unfinished documentation; the command does not invent missing results.
- Random: currently only `/projects/virginia-air-quality`, because it is the completed case study. Sample journal articles and unfinished pages are excluded. Add a project slug to completedRandomProjectSlugs only after reviewing the actual page's completion. One eligible route naturally returns that route; the selector avoids repeats when multiple routes exist and handles an empty list gracefully.

The existing public résumé verifies SAS, Git, Jupyter, Shiny and machine learning; original homepage verifies Power BI and the other core tools. Biography, interests, graduate status and current activities follow the user's latest supplied copy. HTML/CSS/React are included as supplied and match the website stack. No new employment claims or research findings were added. Update current activities periodically in the content file.

## Validation

Run:

```sh
node scripts/home/verify-terminal.mjs
node node_modules/typescript/bin/tsc -b --pretty false
npm run build
```

The terminal verification script uses a test-only TypeScript loader (consistent with existing capstone tests), not browser command execution. It checks:

- Exact 11-command / 10-suggestion registry; help and suggestion secrecy for sudo.
- Case and whitespace handling, empty input, literal unknown input and hidden command output.
- Shared project/contact destinations, reviewed random selection, empty eligibility and non-repeat behavior.
- Latest-result replacement, Up/Down history boundaries, draft restoration, clear and input length.
- Reused asset existence and preservation of the lower homepage structure.

Local browser checks passed for all eight informational pills, clear, random, typed normalized help, submit icon, typed sudo, safe HTML-like unknown input (no injected image node), recall/draft restoration, one H1 and permanent introduction / profile links, and all four real project detail links. Random reached the actual UVA case study. Returning home reset the terminal. Output measured 200px in the available desktop environment.

Existing respiratory, seasonal coefficient and model-comparison verification scripts also passed. No lint script is configured; no tooling was installed just to introduce one.

## Visual / device QA limitations

Screenshot capture returned `Unable to capture screenshot`. Browser viewport overrides did not honor requested CSS sizes: 375→1500, 768→3072, 1366→5465, 1920→7680 reported inner widths. No document or headline overflow was reported in those available DOM layouts, but these are not valid visual checks at the requested breakpoints. Mobile/tablet visual fidelity, actual on-screen keyboard behavior and OS-level reduced-motion / screen-reader behavior still need device review. CSS and component guards implement those requirements; they are not claimed as fully device-verified.

No image generation, dependencies, commits, pushes, DNS changes or deployment changes.

Preview: `npm run dev`, then `http://127.0.0.1:5173/#/`.
