// Core scoring & suggestions logic extracted from original scripts
export const MERN_KEYWORDS = ['react','mongodb','node.js','node','express','mern','javascript','typescript','rest api','mongoose','redux','tailwind','next.js'];
export const ACTION_VERBS = ['developed','managed','implemented','designed','engineered','optimized','created','led','reduced','increased'];

export const CURATED = {
  Foundational: [
    { title:'freeCodeCamp — Full Curriculum', link:'https://www.freecodecamp.org/', note:'Complete web dev curriculum (free).' },
    { title:'The Odin Project', link:'https://www.theodinproject.com/', note:'Project-based full-stack curriculum (free).' },
    { title:'MDN Web Docs — JavaScript Guide', link:'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide', note:'Authoritative JS reference and learning guide.' },
    { title:'JavaScript.info', link:'https://javascript.info/', note:'Comprehensive modern JavaScript tutorial.' },
    { title:'React Full Course — freeCodeCamp (YouTube)', link:'https://www.youtube.com/watch?v=Ke90Tje7VS0', note:'Beginner to intermediate React.'},
    { title:'Node.js Crash Course — Traversy Media (YouTube)', link:'https://www.youtube.com/watch?v=fBNz5xF-Kx4', note:'Node & Express intro.'},
    { title:'MongoDB Basics — MongoDB University', link:'https://www.mongodb.com/learn/what-is-mongodb', note:'Official MongoDB intro.'},
    { title:'Codecademy — Full-Stack Engineer', link:'https://www.codecademy.com/learn/paths/full-stack-engineer-career-path', note:'Interactive exercises and guided projects.'}
  ],
  Intermediate: [
    { title:'Build MERN App — Traversy Media', link:'https://www.youtube.com/watch?v=4yqu8YF29cU', note:'Hands-on MERN project.'},
    { title:'Mongoose & Data Modeling — MongoDB University', link:'https://university.mongodb.com/', note:'Schema design & queries.'},
    { title:'React Hooks & Patterns — Egghead', link:'https://egghead.io/tags/react', note:'Practical patterns & hooks.'},
    { title:'Testing React Apps — Kent C. Dodds', link:'https://kentcdodds.com/', note:'Testing patterns.'},
    { title:'State Management in React — Redux', link:'https://redux.js.org/', note:'Manage complex app state.'},
    { title:'GraphQL Basics — HowToGraphQL', link:'https://www.howtographql.com/', note:'Learn GraphQL with examples.'}
  ],
  Advanced: [
    { title:'Production MongoDB — MongoDB University', link:'https://university.mongodb.com/', note:'Performance & aggregation.'},
    { title:'Authentication & Security — Auth0', link:'https://auth0.com/docs', note:'Secure APIs & auth.'},
    { title:'Scaling Node.js — Coursera/Udemy', link:'https://www.coursera.org/', note:'Deployment & scaling.'},
    { title:'Advanced React Patterns — Kent C. Dodds', link:'https://kentcdodds.com/', note:'Best practices & patterns.'}
  ]
};

export const CERTIFICATIONS = [
  { title: 'MongoDB University — Basics', link: 'https://university.mongodb.com/', note: 'Official MongoDB training.' },
  { title: 'freeCodeCamp — APIs and Microservices', link: 'https://www.freecodecamp.org/learn', note: 'Backend/API fundamentals.' },
  { title: 'AWS Certified Cloud Practitioner', link: 'https://aws.amazon.com/certification/', note: 'Intro cloud cert.' },
  { title: 'Azure Fundamentals', link: 'https://learn.microsoft.com/', note: 'Microsoft Azure basics.' }
];

export function computeSuggestions(skills) {
  const tokens = (skills||'').split(',').map(s=>s.trim().toLowerCase()).filter(Boolean);
  const matched = MERN_KEYWORDS.filter(k => tokens.some(t=>t===k || t.includes(k) || k.includes(t)));
  if (matched.length===0) return { level:'Foundational', list:CURATED.Foundational, matched };
  if (matched.length<5) return { level:'Intermediate', list:CURATED.Intermediate, matched };
  return { level:'Advanced', list:CURATED.Advanced, matched };
}

export function calculateScore(data) {
  let score = 0; const analysis = [];
  let structure = 0; const sFB=[];
  if ((data.personal.name||'').trim().length>3 && (data.personal.title||'').trim().length>3) { structure+=8; sFB.push('Name & title'); } else sFB.push('Name/title missing');
  if ((data.personal.email||'').includes('@') && (data.personal.phone||'').trim().length>=6) { structure+=8; sFB.push('Contact info'); } else sFB.push('Contact incomplete');
  if (Array.isArray(data.experience) && data.experience.length>=1) { structure+=4; sFB.push('Experience present'); } else sFB.push('No experience');
  if (Array.isArray(data.education) && data.education.length>=1) { structure+=5; sFB.push('Education present'); } else sFB.push('No education');
  structure = Math.min(25, structure); score += structure; analysis.push({ metric:'Structure', points:structure, feedback:sFB.join('; ') });
  const summaryWords = ((data.personal.summary||'').split(/\s+/).filter(Boolean)).length;
  let conc=0; const cFB=[];
  if (summaryWords>=30 && summaryWords<=80) { conc=15; cFB.push('Summary ideal'); }
  else if (summaryWords>80) { conc=8; cFB.push('Summary verbose'); }
  else if (summaryWords>=15) { conc=6; cFB.push('Summary short'); } else { conc=2; cFB.push('Summary very short'); }
  score += conc; analysis.push({ metric:'Conciseness', points:conc, feedback:cFB.join('; ') });
  const skillsArr = (data.skills||'').split(',').map(s=>s.trim().toLowerCase()).filter(Boolean);
  const matched = MERN_KEYWORDS.filter(k=>skillsArr.some(s => s===k || s.includes(k) || k.includes(s)));
  const skillsPoints = Math.min(30, Math.round((matched.length / MERN_KEYWORDS.length)*30));
  score += skillsPoints; analysis.push({ metric:'Skills', points:skillsPoints, feedback:`Matched ${matched.length} keywords` });
  const expText = (data.experience||[]).map(j => (j.description||'').toLowerCase()).join(' ');
  const verbsFound = ACTION_VERBS.filter(v => expText.includes(v)).length;
  const verbsPoints = Math.min(16, Math.round((verbsFound / ACTION_VERBS.length) * 16));
  const quantified = /(\d+%|\d+\s?x|\d+)/.test(expText) ? 4 : 0;
  const expPoints = verbsPoints + quantified;
  score += expPoints; analysis.push({ metric:'Experience Impact', points:expPoints, feedback:`${verbsFound} verbs; quantified: ${quantified? 'yes' : 'no'}` });
  let extras=0; const eFB=[];
  if ((data.experience||[]).length>=2) { extras+=4; eFB.push('2+ experience entries'); }
  const hasFrontend = skillsArr.some(s=>['react','next','vue','angular','tailwind'].some(f=>s.includes(f)));
  const hasBackend = skillsArr.some(s=>['node','express','mongodb','postgres','mysql'].some(b=>s.includes(b)));
  if (hasFrontend && hasBackend) { extras+=4; eFB.push('Frontend + Backend'); }
  if (skillsArr.length===0) { extras -= 2; eFB.push('Skills empty'); }
  extras = Math.max(-5, Math.min(10, extras));
  score += extras; analysis.push({ metric:'Extras', points:extras, feedback:eFB.join('; ') || 'No extras' });
  const finalScore = Math.max(0, Math.min(100, Math.round(score)));
  return { overallScore: finalScore, analysis, matched, verbsFound: ACTION_VERBS.filter(v => expText.includes(v)), summaryWords };
}
