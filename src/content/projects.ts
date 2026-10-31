// One source of truth for project cards, ordering, filters, and detail metadata.
export const categories = ['All', 'Data & Analytics', 'Technology', 'Research', 'Creative', 'Personal'];
export interface Project {
  slug: string;
  title: string;
  description: string;
  category: string;
  categories: string[];
  tools: string[];
  number: string;
  kind: string;
  illustration?: { src: string; alt: string; width: number; height: number };
  featured: boolean;
  displayOrder: number;
  problem?: string;
  approach?: string;
  results?: string;
  institution?: string;
  year?: number;
  overview?: string;
}
// Add new entries here. Lower displayOrder values appear first.
const projectEntries: Project[] = [
  {
    slug: 'math-everyday',
    title: 'Math Everyday: Visual Stories of Daily Life',
    description: 'Everyday routines become visual stories of proportion, rhythm, language, and time—with original R figures and source transparency notes.',
    category: 'Creative',
    categories: ['Creative', 'Data & Analytics', 'Personal'],
    tools: ['R', 'ggplot2', 'wordcloud2', 'treemapify'],
    number: '05',
    kind: 'math-everyday',
    illustration: { src: '/projects/math-everyday/cover-card.svg', alt: 'Concept cover of portion, rhythm, language and treemap motifs; not measured data', width: 360, height: 215 },
    featured: false,
    displayOrder: 5,
  },
  {
    "slug": "virginia-air-quality",
    "title": "Air Pollution & Respiratory ER Visits",
    "description": "Investigating how particulate matter, seasonality, and socioeconomic factors relate to respiratory emergency department visits across Virginia.",
    "category": "Data & Analytics",
    "categories": [
      "Data & Analytics",
      "Research"
    ],
    "tools": [
      "R",
      "Statistical Modeling",
      "Geospatial Analysis"
    ],
    "number": "04",
    "kind": "air-quality",
    "illustration": {
      "src": "/images/virginia-air-quality.svg",
      "alt": "Illustrative air-pollution and statistics concept; not actual project data",
      "width": 360,
      "height": 215
    },
    "year": 2026,
    "institution": "University of Virginia",
    "overview": "Project overview coming soon. Documentation for this completed statistics capstone will be added here.",
    "featured": true,
    "displayOrder": 1
  },
  {
    "slug": "business-intelligence",
    "title": "Business Intelligence & Forecasting",
    "category": "Data & Analytics",
    "number": "01",
    "kind": "forecast",
    "description": "Turning complex data into a clearer view of what comes next.",
    "tools": [
      "Python",
      "SQL",
      "Forecasting"
    ],
    "problem": "This project focuses on data cleaning, forecasting, and business reporting.",
    "approach": "Python and SQL support the data preparation and forecasting workflow. A detailed account of the source data, models, and reporting process will be added here.",
    "results": "Results and validated outcomes have not yet been provided.",
    "categories": [
      "Data & Analytics"
    ],
    "featured": true,
    "displayOrder": 2
  },
  {
    "slug": "what-makes-a-hit-song",
    "title": "What Makes a Hit Song?",
    "category": "Research",
    "number": "02",
    "kind": "music",
    "description": "An exploration of music, popularity, and the patterns behind the charts.",
    "tools": [
      "R",
      "Visualization",
      "Music analytics"
    ],
    "problem": "Explore music analytics across Spotify, Billboard, and YouTube.",
    "approach": "The project uses R and data visualization to investigate music popularity. Dataset details and analytical methods are awaiting documentation.",
    "results": "Findings and validated outcomes have not yet been provided.",
    "categories": [
      "Research"
    ],
    "featured": true,
    "displayOrder": 3
  },
  {
    "slug": "neurodecide",
    "title": "NeuroDecide",
    "category": "Technology",
    "number": "03",
    "kind": "neuro",
    "description": "Connecting assessment data to a more thoughtful reporting workflow.",
    "tools": [
      "Automation",
      "Statistics",
      "Reporting"
    ],
    "problem": "Assessment processing involves scoring, statistical analysis, and client report generation.",
    "approach": "This project concerns automated assessment processing and reporting. Implementation details and Kian’s specific contributions will be added when supplied.",
    "results": "Results and validated outcomes have not yet been provided.",
    "categories": [
      "Technology"
    ],
    "featured": false,
    "displayOrder": 4
  }
];

// Derive routes from the slug so a route never drifts from its project ID.
export const getProjectRoute = (project: Project) => `/projects/${project.slug}`;
export const getProjectCategories = (project: Project) => project.categories;
export const projects = [...projectEntries].sort((a, b) => a.displayOrder - b.displayOrder);
export const featuredProjects = projects.filter(project => project.featured).slice(0, 3);
