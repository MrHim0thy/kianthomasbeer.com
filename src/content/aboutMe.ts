export interface AboutPhoto {
  src: string;
  alt: string;
  width: number;
  height: number;
}

// Personal copy is based on the supplied About brief and verified existing site content.
// Add actual photographs here; do not substitute stock images or generated likenesses.
export const aboutMe = {
  headline: { lead: 'Curious about data.', rest: 'Interested in everything else.' },
  introduction: 'I’m Kian Thomasbeer, a University of Virginia statistics graduate interested in data analysis, technology, and creative problem-solving. I enjoy finding patterns in everyday life—and following the questions they raise.',
  portrait: { src: '/images/kian-website-portrait.png', alt: 'Kian Thomasbeer smiling in a light blue shirt', width: 3018, height: 3278 },
  portraitCaption: 'Kian Thomasbeer · A little more than a résumé',
  graduationPhoto: {
    src: '/images/about/uva-graduation-celebration.jpeg',
    alt: 'Four graduates celebrating with champagne on the steps in front of a columned University of Virginia building',
    width: 3712,
    height: 5568,
    caption: 'Celebrating a chapter at the University of Virginia.',
  },
  mahjongPhoto: {
    src: '/images/about/mahjong-with-pandas.jpg',
    alt: 'Kian playing mahjong at a table surrounded by panda plush toys',
    width: 6000,
    height: 4000,
    title: 'Mahjong & unexpected company',
    caption: 'A candid moment at the mahjong table, with panda plush toys for company.',
  },
  background: [
    'My background is in Applied Statistics at the University of Virginia, with a minor in Business. I’m drawn to the way statistics brings structure to complicated questions—and to how a good visualization can make an idea easier to understand.',
    'I work with Python, R, SQL, and data visualization to explore questions, build analytical workflows, and communicate what the data can and cannot tell us. For me, the interesting part is connecting the technical work to a question that matters.',
    'That curiosity runs through my portfolio: environmental health in Virginia Air Quality, music and popularity in What Makes a Hit Song?, and the mathematics of ordinary routines in Math Everyday. Different subjects, connected by a desire to look a little closer.',
  ],
  toolkit: ['Python', 'R', 'SQL', 'Data visualization'],
  // Intentionally undated: no graduation date, employment history, or job title is inferred.
  timeline: [
    { phase: 'FOUNDATION', title: 'Studying the patterns', text: 'Studied Applied Statistics at the University of Virginia, alongside a minor in Business.' },
    { phase: 'TECHNICAL EXPLORATION', title: 'Building an analytical toolkit', text: 'Developing an interest in data science, statistical modeling, and clear visual communication through Python, R, and SQL.' },
    { phase: 'RESEARCH & PROJECTS', title: 'Putting questions into practice', text: 'Exploring environmental health, music analytics, and everyday mathematics through research and analytical projects.' },
    { phase: 'MAKING & LEARNING', title: 'Turning analysis into experiences', text: 'Building this portfolio as a place to share research, interactive visualizations, and ideas across disciplines.' },
    { phase: 'LOOKING AHEAD', title: 'Finding the next good question', text: 'Exploring opportunities in data analytics, business intelligence, and data science, with room to keep learning.' },
  ],
  interests: [
    { id: 'ultimate', title: 'Ultimate frisbee', caption: 'Staying active, playing competitively, and being part of a team.', photo: null as AboutPhoto | null },
    { id: 'travel', title: 'Places & perspectives', caption: 'Exploring somewhere new—and discovering different cultures along the way.', photo: { src: '/images/about/whale-shark-exploration.png', alt: 'A swimmer beneath a whale shark in open blue water, with sunlight filtering down from the surface', width: 1654, height: 951 } as AboutPhoto | null },
    { id: 'music', title: 'Always listening', caption: 'Afrobeats, Brazilian funk, R&B, house, and whatever I discover next.', photo: null as AboutPhoto | null },
    { id: 'cooking', title: 'In the kitchen', caption: 'Experimenting with recipes and flavors from around the world.', photo: null as AboutPhoto | null },
    { id: 'languages', title: 'Words open doors', caption: 'An interest in English, Spanish, German, and the perspectives languages offer.', photo: null as AboutPhoto | null },
  ],
  mission: 'I like asking questions, exploring unfamiliar ideas, and finding patterns in complicated things. Whether I’m analyzing a dataset, learning a language, or exploring somewhere new, I’m driven by the same curiosity: understanding how things work and what we can learn from them.',
  next: 'I’m interested in developing a career in data analytics, business intelligence, and data science. I’m looking for opportunities to keep learning, contribute thoughtful analysis, and turn complex questions into useful work.',
};
