// Compatibility exports keep existing detail pages and page titles unchanged.
export { projects, featuredProjects, categories, getProjectCategories, getProjectRoute } from './content/projects';
export type { Project } from './content/projects';

export const articles = [
 {slug:'asking-better-questions',title:'The best analysis starts with a better question.',category:'Data Science',description:'A sample essay on curiosity, context, and the work before the spreadsheet.',body:['A useful analysis begins before the first line of code. It begins with a question: what are we trying to understand, and why does it matter?','A dataset can suggest many directions. Choosing among them requires context, careful definitions, and a willingness to revisit assumptions. A chart is only useful when its reader understands what it measures.','This is sample editorial content for demonstrating the blog layout. Replace it with an original article before presenting it as Kian’s writing.']},
 {slug:'making-space-for-curiosity',title:'Making space for curiosity.',category:'Personal',description:'A sample note on following interesting questions across disciplines.',body:['Curiosity rarely fits neatly into a single category. A question about music can become a question about statistics; a new language can change how we think about familiar ideas.','Leaving room for exploration can be a creative practice of its own. A notebook, an unfinished experiment, or a conversation can become the starting point for something unexpected.','This is a clearly labeled sample article, not a published account of Kian’s personal experiences.']},
 {slug:'technology-with-intention',title:'Building with a little more intention.',category:'Technology',description:'A sample reflection on useful tools and thoughtful technology.',body:['A tool should earn its place by making a task clearer or more useful. Starting with the people who will use it helps define what to build.','Small, understandable systems are easier to maintain and improve. Good defaults, readable interfaces, and useful feedback make a difference.','This sample article demonstrates the reading experience. Replace this text with your own writing.']}
];
export const readingTime = (body: string[]) => Math.max(1, Math.ceil(body.join(' ').split(/\s+/).length / 200));
// Add verified URLs and a resume in public/ when available. Null values render honest placeholders.
export const profile = {
 github: 'https://github.com/MrHim0thy',
 linkedin: 'https://www.linkedin.com/in/kian-thomasbeer/',
 email: 'kianthomasbeer@gmail.com',
 resume: '/Kian_Thomasbeer_Resume.pdf',
};
