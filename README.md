# Kian Thomasbeer — personal website

React, Vite, TypeScript, Tailwind CSS, Framer Motion, and Lucide. The default theme uses warm cream, midnight navy, amber, sage, sky blue, and blush accents.

## Local preview

Use Node.js 22 or later. Dependencies are already installed in this checkout.

```sh
npm ci
npm run dev
```

Open the Local URL printed by Vite (normally http://127.0.0.1:5173). Stop with Ctrl+C. To check the production output:

```sh
npm run build
npm run preview
```

## Pages and shared code

Each main page is independently editable:

| Page | Component | Hash route |
| --- | --- | --- |
| Home | `src/pages/Home.tsx` | `/#/` |
| Projects | `src/pages/Projects.tsx` | `/#/projects` |
| Curiosity Journal | `src/pages/CuriosityJournal.tsx` | `/#/curiosity-journal` |
| Performance Lab | `src/pages/PerformanceLab.tsx` | `/#/performance-lab` |
| About Me | `src/pages/AboutMe.tsx` | `/#/about` |
| Soundcheck (unlisted, retained for future use) | `src/pages/Soundcheck.tsx` | `/#/soundcheck` |

`src/App.tsx` owns shared navigation, page titles, and routing. `src/main.tsx` is the app entry point. `src/components/Shared.tsx` contains shared project cards, concept visuals, profile links, and page headings. `src/styles.css` defines the palette, layout, responsive rules, and reduced-motion support.

Curiosity Journal and Performance Lab remain placeholders. No Fitbit, Spotify, or other account integrations are implemented. Existing project details remain at `/#/projects/:slug`. Old `/writing` links redirect to Curiosity Journal, and existing sample article detail links still work. `/about` renders the dedicated About Me page; `/life` redirects to Performance Lab. Soundcheck remains accessible at its existing route but is no longer listed in navigation or the homepage preview links.

## Editing content

`src/content/aboutMe.ts` holds the About Me biography, existing portrait, undated timeline, interests, mission statement, and next steps. Add your personal photographs to `public/images/` and replace an interest's `photo: null as AboutPhoto | null` with `{ src: '/images/your-photo.jpg', alt: 'A meaningful description', width: 1600, height: 1200 }` using its actual dimensions. Until supplied, the five interest panels explicitly say “Photo to come.” Do not invent employment milestones or dates; add verified details to the timeline when available. Résumé, LinkedIn, and email links reuse `profile` in `src/content.ts`; project links resolve from the shared published collection.

`src/content/projects.ts` is the single project source. Add an entry to `projectEntries` with a unique `slug`, `title`, `description`, `categories`, `tools`, `kind`, and `displayOrder` (plus the existing primary `category` and project `number`). Set `illustration` to the thumbnail's `src`, `alt`, natural `width` and `height`, and optional letterbox `background`. The same thumbnail and metadata render through `ProjectCard` on both pages. Routes derive from the slug through `getProjectRoute`.

Lower `displayOrder` values appear first. `publishedProjects` excludes entries with `published: false`; omitted status means published. Projects filters this published collection, and the homepage automatically takes its first three entries. There are no separate featured flags or page-specific thumbnail overrides. To hide a project from both listings, set `published: false`; its underlying data and detail route remain intact. To add a project, add its entry and detail page—no manual homepage list changes are needed.

Routes are derived from the slug as `/projects/<slug>`. The existing detail template resolves new entries automatically; optional `problem`, `approach`, and `results` fields provide its content. Use `kind` to reuse the existing CSS artwork (`forecast`, `music`, or `neuro`), or add `illustration: { src, alt, width, height }` to use an SVG/image from `public/`. Illustration metadata and all card copy live with the project entry, so edits update both listings. The capstone’s expanded case study remains separate and unchanged.

`src/content.ts` re-exports project data for existing consumers and retains sample articles and verified profile links. `src/pages/ProjectDetail.tsx` and `src/pages/Article.tsx` render details. Sample articles are retained for compatibility, not shown as original journal entries.

Unknown profile URLs remain `null` with visible “soon” labels. Add verified GitHub, LinkedIn, and email values to `profile`. To enable the resume, put the real PDF at `public/resume.pdf` and set `profile.resume` to `/resume.pdf`. Home’s background, education, experience placeholders, and contact section are in `src/pages/Home.tsx`. No dates, roles, statistics, or project results have been invented. Project visuals are abstract concept illustrations, not screenshots or measured results.

## Beer Buddy branding

`public/brand/beer-buddy.png` is the isolated transparent laptop mascot used by the header, footer, homepage hero, and favicon. The full reference sheet is not served by the website. The asset was produced with the built-in imagegen tool using the supplied character sheet as a reference.

Asset prompt: “Extract only the large main pose (upper center): the friendly amber beer character seated working on a gray laptop marked KT. Create one isolated mascot with genuine transparent background, closely preserving the original appearance, cream foam, black oval eyes, smile, amber shading, outline, typing arms, feet, and laptop. No backpack, hat, added accessories, wordmark, captions, swatches, panels, or surrounding markings.”

## GitHub Pages

Hash routing supports direct navigation and refresh without a server rewrite. Vite uses `/` as its base for the custom domain; `public/CNAME` contains `kianthomasbeer.com` and is copied into the build. Hash routes share the HTML document, which limits per-article search indexing and social previews.

**Pushing to `main` automatically deploys**, using the existing `.github/workflows/deploy.yml`. Manual `workflow_dispatch` deployment is also available. Review locally before pushing. This branding update does not alter the workflow, custom domain, or DNS configuration.

When ready to publish, repository **Settings → Pages → Build and deployment → Source** must be set to **GitHub Actions**. The workflow runs `npm ci` and `npm run build`, uploads `dist/`, and deploys to Pages. Domain/DNS management is a separate step; no DNS changes are made by local development.

## Accessibility

Semantic navigation, a skip link, visible keyboard focus, native filter buttons, mobile menu controls, and reduced-motion preferences are supported. The mascot has descriptive alt text in the hero and empty alt text in the wordmark, where the home link already has an accessible name.
