# Kian Thomasbeer — personal website

React + Vite + TypeScript + Tailwind CSS, with Framer Motion and Lucide icons. No accounts, paid services, API keys, or database required.

## Local preview

Use Node.js 22 or later:

```sh
npm ci
npm run dev
```

Open the Local URL printed by Vite (normally http://127.0.0.1:5173). Stop with Ctrl+C.

```sh
npm run build
npm run preview
```

The production build performs strict TypeScript checking and creates `dist/`.

## Content editing

- `src/content.ts`: projects, categories, sample articles, and verified profile links. All missing URLs are `null`, with visible “soon” labels instead of broken links. Set `profile.resume` to `/resume.pdf` and place your real PDF in `public/resume.pdf` to enable the resume link.
- `src/main.tsx`: shared components, page layouts, About, and Life content.
- `src/styles.css`: design tokens, responsive styling, and reduced-motion support.
- `public/`: favicon, CNAME, and future photography / resume assets.

Add an entry to `projects` or `articles` with a unique slug; gallery cards and detail routes appear automatically. Reading time is calculated from article text at 200 words per minute. Add real photos by replacing the explicitly labeled Life placeholders with images, descriptive alt text, and appropriate dimensions. Project visuals are CSS concept illustrations, not actual screenshots or claimed results. All blog posts are labeled sample content. Replace these before representing them as your published writing.

## Routing and SEO

HashRouter makes routes such as `/#/projects/neurodecide` work on direct navigation and refresh on GitHub Pages, without a server rewrite or 404 redirect. Vite uses `/` as its base for the custom domain. Titles update for every route; the HTML provides a site description and theme color. Hash routes share one HTML document, so independent social previews and full per-article search indexing are limited; consider static prerendering if search discovery becomes a priority.

## Commit and push (does not deploy)

Review changes, then:

```sh
git add .
git commit -m "Build initial personal website"
git push origin HEAD
```

Git history is preserved. No commit or push was performed as part of the initial build.

## GitHub Pages — enable only when ready to publish

The workflow is deliberately **manual-only**. Committing and pushing will not trigger publication.

1. Push the reviewed files to GitHub.
2. In the repository, open **Settings → Pages → Build and deployment → Source**, and choose **GitHub Actions**.
3. When you explicitly decide to publish, open **Actions → Deploy to GitHub Pages → Run workflow**, select the branch containing this code, and run it. The workflow installs from `package-lock.json`, builds, uploads `dist/`, and deploys it to Pages.
4. Configure the Pages custom domain as `kianthomasbeer.com` when ready. `public/CNAME` is copied into the build. Enable HTTPS after GitHub verifies the domain and issues a certificate.
5. Domain DNS must be configured separately when you authorize that step. No DNS changes have been made.

Do not run the deployment workflow until you want the site published. If you later want automatic deployment, add a push trigger for the repository’s default branch to `.github/workflows/deploy.yml`.

## Accessibility and design

Responsive layouts cover narrow phones through large desktops. Semantic navigation, a skip link, visible keyboard focus, native filter buttons with pressed states, and reduced-motion support are included. All unknown personal details, dates, outcomes, photographs, contact information, social links, and resume are marked as pending rather than invented.
