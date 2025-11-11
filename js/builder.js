/* Builder logic (separated) */
(function(){
  const { jsPDF } = window.jspdf || {};
  const DB_KEY = 'mern_resume_builder_singlefile_v1';

  const MERN_KEYWORDS = ['react','mongodb','node.js','node','express','mern','javascript','typescript','rest api','mongoose','redux','tailwind','next.js'];
  const ACTION_VERBS = ['developed','managed','implemented','designed','engineered','optimized','created','led','reduced','increased'];

  const CURATED = {
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
      { title:'Build MERN App — Traversy Media (YouTube)', link:'https://www.youtube.com/watch?v=4yqu8YF29cU', note:'Hands-on MERN project.'},
      { title:'Mongoose & Data Modeling — MongoDB University', link:'https://university.mongodb.com/', note:'Schema design & queries.'},
      { title:'React Hooks & Patterns — Egghead', link:'https://egghead.io/tags/react', note:'Practical patterns & hooks.'},
      { title:'React for Beginners — Wes Bos', link:'https://wesbos.com/courses', note:'Paid but excellent hands-on React courses.'},
      { title:'Net Ninja — MERN & React Playlists', link:'https://www.youtube.com/c/TheNetNinja', note:'Short focused tutorials and projects.'},
      { title:'TypeScript for Beginners — Microsoft / Codecademy', link:'https://www.typescriptlang.org/docs/handbook/intro.html', note:'TypeScript handbook and beginner guides.'},
      { title:'GraphQL Basics — HowToGraphQL', link:'https://www.howtographql.com/', note:'Learn GraphQL with full-stack examples.'}
    ],
    Advanced: [
      { title:'Production MongoDB — MongoDB University', link:'https://university.mongodb.com/', note:'Performance & aggregation.'},
      { title:'Scaling Node.js — Coursera/Udemy', link:'https://www.coursera.org/', note:'Deployment & scaling (paid).' },
      { title:'Advanced React Patterns — Kent C. Dodds', link:'https://kentcdodds.com/', note:'Best practices, patterns and testing React apps.'},
      { title:'Serverless & Edge — Vercel / Next.js Docs', link:'https://vercel.com/docs', note:'Deploying and optimizing modern JAMstack apps.'},
      { title:'Docker for Developers — Play with Docker / Udemy', link:'https://www.docker.com/101-tutorial', note:'Container basics for development and deployment.'},
      { title:'Web Performance & Monitoring — Google Web Fundamentals', link:'https://web.dev/learn/', note:'Performance best practices and metrics.'}
    ],
    Extras: [
      { title:'freeCodeCamp Projects', link:'https://www.freecodecamp.org/learn', note:'Build projects to demonstrate skills.'},
      { title:'YouTube: Traversy, The Net Ninja', link:'https://www.youtube.com', note:'Practical tutorials and projects.'},
      { title:'Scrimba — Interactive Frontend Courses', link:'https://scrimba.com/', note:'Interactive screencasts for React and JS.'},
      { title:'LeetCode — Interview Practice', link:'https://leetcode.com/', note:'Practice coding interview problems.'},
      { title:'Frontend Masters — Deep Dives', link:'https://frontendmasters.com/', note:'Paid, in-depth courses on React, Node, CSS, and performance.'},
      { title:'GitHub Pages & Portfolio Guides', link:'https://pages.github.com/', note:'Host a portfolio and projects for recruiters.'}
    ]
  };

  // Certifications data — rendered when user selects the Certifications tab
  const CERTIFICATIONS = [
    { title: 'MongoDB University — Basics', link: 'https://university.mongodb.com/', note: 'Official MongoDB certifications and training.' },
    { title: 'freeCodeCamp — APIs and Microservices', link: 'https://www.freecodecamp.org/learn', note: 'Good for backend/API fundamentals.' },
    { title: 'Google — IT Automation with Python (Coursera)', link: 'https://www.coursera.org/', note: 'Automation and scripting for ops.' },
    { title: 'AWS Certified Cloud Practitioner', link: 'https://aws.amazon.com/certification/', note: 'Intro cloud cert (AWS).' },
    { title: 'Microsoft Certified: Azure Fundamentals', link: 'https://learn.microsoft.com/', note: 'Azure fundamentals certification.' },
    { title: 'Coursera: Full-Stack Web Development', link: 'https://www.coursera.org/', note: 'Paid specializations with certificates.' }
  ];

  const defaultData = {
    personal: { name:'John Doe', title:'MERN Developer', email:'john@example.com', phone:'', linkedin:'', summary:'Experienced MERN developer building web apps with React and Node.js.' },
    experience: [{ id:1, title:'Full-stack Developer', company:'Acme', years:'2020 - Present', description:'Developed REST APIs and React frontends; reduced latency by 20%.' }],
    education: [{ id:1, degree:'B.Tech', institution:'University', years:'2016 - 2020' }],
    skills: 'React, Node.js, Express, MongoDB',
    accent: '#4f46e5'
  };

  const $ = id => document.getElementById(id);
  const escape = s => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

  function load(){
    try {
      const raw = localStorage.getItem(DB_KEY);
      return raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(defaultData));
    } catch(e){ console.error(e); return JSON.parse(JSON.stringify(defaultData)); }
  }
  function saveState(state) { try { localStorage.setItem(DB_KEY, JSON.stringify(state)); return true; } catch(e){ console.error(e); return false; } }

  let data = load();

  function renderExperience() {
    const container = $('exp-container');
    if (!container) return;
    container.innerHTML = '';
    data.experience.forEach((e, idx) => {
      const div = document.createElement('div');
      div.style.border = '1px solid #eef2ff';
      div.style.padding = '10px';
      div.style.marginBottom = '8px';
      div.style.borderRadius = '8px';
      div.innerHTML = `
        <label>Title</label><input data-idx="${idx}" data-field="title" type="text" value="${escape(e.title)}">
        <label>Company</label><input data-idx="${idx}" data-field="company" type="text" value="${escape(e.company)}">
        <label>Years</label><input data-idx="${idx}" data-field="years" type="text" value="${escape(e.years)}">
        <label>Description</label><textarea data-idx="${idx}" data-field="description" rows="3">${escape(e.description)}</textarea>
        <div style="text-align:right;margin-top:8px"><button data-remove="${e.id}" style="background:#fff;border:1px solid #fee2e2;color:#ef4444;padding:6px 8px;border-radius:8px">Remove</button></div>
      `;
      container.appendChild(div);
    });
  }

  function renderEducation() {
    const container = $('edu-container');
    if (!container) return;
    container.innerHTML = '';
    data.education.forEach((e, idx) => {
      const div = document.createElement('div');
      div.style.border = '1px solid #eef2ff';
      div.style.padding = '10px';
      div.style.marginBottom = '8px';
      div.style.borderRadius = '8px';
      div.innerHTML = `
        <label>Degree</label><input data-idx="${idx}" data-field="degree" type="text" value="${escape(e.degree)}">
        <label>Institution</label><input data-idx="${idx}" data-field="institution" type="text" value="${escape(e.institution)}">
        <label>Years</label><input data-idx="${idx}" data-field="years" type="text" value="${escape(e.years)}">
        <div style="text-align:right;margin-top:8px"><button data-remove-edu="${e.id}" style="background:#fff;border:1px solid #fee2e2;color:#ef4444;padding:6px 8px;border-radius:8px">Remove</button></div>
      `;
      container.appendChild(div);
    });
  }

  function renderPreview(){
    const p = $('preview');
    if (!p) return;
    p.innerHTML = `
      <div style="border-bottom:6px solid ${data.accent};padding-bottom:10px;border-radius:6px 6px 0 0">
        <div style="font-weight:800;font-size:18px;color:#0f172a">${escape(data.personal.name)}</div>
        <div style="color:${data.accent};font-weight:700">${escape(data.personal.title)}</div>
        <div style="color:#64748b;font-size:13px;margin-top:6px">${escape(data.personal.phone)} | ${escape(data.personal.email)} | ${escape(data.personal.linkedin)}</div>
      </div>
      <div style="padding:10px">
        <div style="margin-top:6px"><strong>Summary</strong><div style="color:#334155">${escape(data.personal.summary)}</div></div>
        <div style="margin-top:10px"><strong>Experience</strong>${data.experience.map(e=>`<div style="margin-top:8px"><div style="font-weight:600">${escape(e.title)} • ${escape(e.company)} <span style="color:#64748b;font-weight:400">(${escape(e.years)})</span></div><div style="color:#334155">${escape(e.description)}</div></div>`).join('')}</div>
        <div style="margin-top:10px"><strong>Education</strong>${data.education.map(e=>`<div style="margin-top:8px"><div style="font-weight:600">${escape(e.degree)} <span style="color:#64748b">(${escape(e.years)})</span></div><div style="color:#334155">${escape(e.institution)}</div></div>`).join('')}</div>
        <div style="margin-top:10px"><strong>Skills</strong><div style="color:#334155">${escape(data.skills)}</div></div>
      </div>
    `;
  }

  function init() {
    if ($('accent')) $('accent').value = data.accent || '#4f46e5';
    if ($('name')) $('name').value = data.personal.name || '';
    if ($('title')) $('title').value = data.personal.title || '';
    if ($('email')) $('email').value = data.personal.email || '';
    if ($('phone')) $('phone').value = data.personal.phone || '';
    if ($('linkedin')) $('linkedin').value = data.personal.linkedin || '';
    if ($('summary')) $('summary').value = data.personal.summary || '';
    if ($('skills')) $('skills').value = data.skills || '';

    renderExperience();
    renderEducation();
    renderPreview();
  }

  function computeSuggestions() {
    const tokens = (data.skills||'').split(',').map(s=>s.trim().toLowerCase()).filter(Boolean);
    const matched = MERN_KEYWORDS.filter(k => tokens.some(t=>t===k || t.includes(k) || k.includes(t)));
    if (matched.length===0) return { level:'Foundational', list:CURATED.Foundational, matched };
    if (matched.length<5) return { level:'Intermediate', list:CURATED.Intermediate, matched };
    return { level:'Advanced', list:CURATED.Advanced, matched };
  }

  function calculateScore() {
    let score = 0; const analysis = [];
    // Structure (25)
    let structure = 0; const sFB=[];
    if ((data.personal.name||'').trim().length>3 && (data.personal.title||'').trim().length>3) { structure+=8; sFB.push('Name & title'); } else sFB.push('Name/title missing');
    if ((data.personal.email||'').includes('@') && (data.personal.phone||'').trim().length>=6) { structure+=8; sFB.push('Contact info'); } else sFB.push('Contact incomplete');
    if (Array.isArray(data.experience) && data.experience.length>=1) { structure+=4; sFB.push('Experience present'); } else sFB.push('No experience');
    if (Array.isArray(data.education) && data.education.length>=1) { structure+=5; sFB.push('Education present'); } else sFB.push('No education');
    structure = Math.min(25, structure); score += structure; analysis.push({ metric:'Structure', points:structure, feedback:sFB.join('; ') });

    // Conciseness (15)
    const summaryWords = ((data.personal.summary||'').split(/\s+/).filter(Boolean)).length;
    let conc=0; const cFB=[];
    if (summaryWords>=30 && summaryWords<=80) { conc=15; cFB.push('Summary ideal'); }
    else if (summaryWords>80) { conc=8; cFB.push('Summary verbose'); }
    else if (summaryWords>=15) { conc=6; cFB.push('Summary short'); } else { conc=2; cFB.push('Summary very short'); }
    score += conc; analysis.push({ metric:'Conciseness', points:conc, feedback:cFB.join('; ') });

    // Skills (30)
    const skillsArr = (data.skills||'').split(',').map(s=>s.trim().toLowerCase()).filter(Boolean);
    const matched = MERN_KEYWORDS.filter(k=>skillsArr.some(s => s===k || s.includes(k) || k.includes(s)));
    const skillsPoints = Math.min(30, Math.round((matched.length / MERN_KEYWORDS.length)*30));
    score += skillsPoints; analysis.push({ metric:'Skills', points:skillsPoints, feedback:`Matched ${matched.length} keywords` });

    // Experience impact (20)
    const expText = (data.experience||[]).map(j => (j.description||'').toLowerCase()).join(' ');
    const verbsFound = ACTION_VERBS.filter(v => expText.includes(v)).length;
    const verbsPoints = Math.min(16, Math.round((verbsFound / ACTION_VERBS.length) * 16));
    const quantified = /(\d+%|\d+\s?x|\d+)/.test(expText) ? 4 : 0;
    const expPoints = verbsPoints + quantified;
    score += expPoints; analysis.push({ metric:'Experience Impact', points:expPoints, feedback:`${verbsFound} verbs; quantified: ${quantified? 'yes' : 'no'}` });

    // Extras (10)
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

  function openSuggestionsWindow(targetWin) {
    const p = computeSuggestions();
    const listHtml = p.list.map(item => `
      <div style="margin:10px 0;padding:10px;border-radius:8px;border:1px solid #eef2ff;background:#fff">
        <a href="${item.link}" target="_blank" rel="noopener noreferrer" style="font-weight:700;color:${data.accent}">${item.title}</a>
        <div style="color:#64748b">${item.note}</div>
      </div>
    `).join('');
    const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Course Suggestions</title>
      <style>body{font-family:Inter,Arial;padding:20px;background:#f8fafc;color:#0f172a} a{color:${data.accent};font-weight:700}</style>
      </head><body>
      <h1>Course Suggestions — ${p.level}</h1>
      <p style="color:#64748b">Matched: ${p.matched.join(', ') || '(none)'}</p>
      ${listHtml}
      </body></html>`;
    const w = targetWin || window.open();
    if (!w) return alert('Popup blocked — allow popups.');
    try { w.document.open(); w.document.write(html); w.document.close(); } catch(e){ console.error(e); }
    if ($('last-actions')) $('last-actions').textContent = `Opened suggestions (${p.level}) at ${new Date().toLocaleTimeString()}`;
    return w;
  }

  function openCertificationsWindow(targetWin) {
    const items = CERTIFICATIONS || [];
    const listHtml = items.map(item => `
      <div style="margin:10px 0;padding:10px;border-radius:8px;border:1px solid #eef2ff;background:#fff">
        <a href="${item.link}" target="_blank" rel="noopener noreferrer" style="font-weight:700;color:${data.accent}">${item.title}</a>
        <div style="color:#64748b">${item.note}</div>
      </div>
    `).join('');
    const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Certifications</title>
      <style>body{font-family:Inter,Arial;padding:20px;background:#f8fafc;color:#0f172a} a{color:${data.accent};font-weight:700}</style>
      </head><body>
      <h1>Certifications</h1>
      ${listHtml}
      </body></html>`;
    const w = targetWin || window.open();
    if (!w) return alert('Popup blocked — allow popups.');
    try { w.document.open(); w.document.write(html); w.document.close(); } catch(e){ console.error(e); }
    if ($('last-actions')) $('last-actions').textContent = `Opened certifications at ${new Date().toLocaleTimeString()}`;
    return w;
  }

  // certifications popup removed

  function openScoreWindow() {
    const res = calculateScore();
    const metricsHtml = res.analysis.map(a => `<div style="margin:10px 0;padding:12px;border-radius:8px;border:1px solid #eef2ff;background:#fff"><div style="display:flex;justify-content:space-between"><strong>${a.metric}</strong><span>${a.points} pts</span></div><div style="color:#64748b;margin-top:6px">${a.feedback}</div></div>`).join('');
    const matched = (res.matched || []).join(', ') || '(none)';
    const verbs = (res.verbsFound || []).join(', ') || '(none)';
    const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Resume Score</title>
      <style>body{font-family:Inter,Arial;padding:20px;background:#f8fafc;color:#0f172a} a{color:${data.accent}}</style></head><body>
      <h1>Resume Score — ${res.overallScore}/100</h1>
      <p style="color:#64748b">Matched skills: ${matched} — Verbs: ${verbs}</p>
      ${metricsHtml}
      <div style="margin-top:18px;color:#64748b">Suggested courses based on this score are available in the builder (Suggestion button).</div>
      </body></html>`;
    const w = window.open();
    if (!w) return alert('Popup blocked — allow popups.');
    w.document.write(html); w.document.close();
    if ($('last-actions')) $('last-actions').textContent = `Score opened (${res.overallScore}) at ${new Date().toLocaleTimeString()}`;
  }

  async function downloadPdf() {
    const preview = $('preview');
    if (!preview) return alert('Preview missing.');
    try {
      if ($('last-actions')) $('last-actions').textContent = 'Rendering PDF...';
      const canvas = await html2canvas(preview, { scale:2, useCORS:true, logging:false, windowWidth: preview.scrollWidth, windowHeight: preview.scrollHeight });
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = (window.jspdf && window.jspdf.jsPDF) ? new window.jspdf.jsPDF({ unit:'mm', format:'a4', orientation:'portrait' }) : new jsPDF({ unit:'mm', format:'a4', orientation:'portrait' });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const pxToMm = px => px * 0.264583;
      const imgWmm = pxToMm(canvas.width);
      const imgHmm = pxToMm(canvas.height);
      const ratio = Math.min(pageW / imgWmm, 1);
      const renderW = imgWmm * ratio;
      const renderH = imgHmm * ratio;
      if (renderH <= pageH) {
        pdf.addImage(imgData, 'JPEG', (pageW - renderW)/2, 10, renderW, renderH);
      } else {
        const canvasPageHeightPx = Math.floor((pageH / 0.264583) / ratio);
        let y = 0;
        while (y < canvas.height) {
          const slice = document.createElement('canvas');
          slice.width = canvas.width;
          slice.height = Math.min(canvasPageHeightPx, canvas.height - y);
          const ctx = slice.getContext('2d');
          ctx.drawImage(canvas, 0, y, canvas.width, slice.height, 0, 0, slice.width, slice.height);
          const sliceData = slice.toDataURL('image/jpeg', 0.95);
          const sliceHmm = pxToMm(slice.height) * ratio;
          pdf.addImage(sliceData, 'JPEG', (pageW - renderW)/2, 10, renderW, sliceHmm);
          y += slice.height;
          if (y < canvas.height) pdf.addPage();
        }
      }
      const filename = (data.personal?.name || 'resume').replace(/\s+/g,'_').toLowerCase() + '_resume.pdf';
      pdf.save(filename);
      if ($('last-actions')) $('last-actions').textContent = 'Downloaded PDF';
    } catch (err) {
      console.error(err);
      alert('PDF failed — see console.');
    }
  }

  // events wiring
  function wire() {
    if ($('accent')) $('accent').addEventListener('input', e => { data.accent = e.target.value; renderPreview(); });
    if ($('name')) $('name').addEventListener('input', e => { data.personal.name = e.target.value; renderPreview(); });
    if ($('title')) $('title').addEventListener('input', e => { data.personal.title = e.target.value; renderPreview(); });
    if ($('email')) $('email').addEventListener('input', e => { data.personal.email = e.target.value; renderPreview(); });
    if ($('phone')) $('phone').addEventListener('input', e => { data.personal.phone = e.target.value; renderPreview(); });
    if ($('linkedin')) $('linkedin').addEventListener('input', e => { data.personal.linkedin = e.target.value; renderPreview(); });
    if ($('summary')) $('summary').addEventListener('input', e => { data.personal.summary = e.target.value; renderPreview(); });
    if ($('skills')) $('skills').addEventListener('input', e => { data.skills = e.target.value; renderPreview(); });

    const expContainer = $('exp-container');
    if (expContainer) {
      expContainer.addEventListener('input', function(ev){
        const t = ev.target; const idx = t.getAttribute('data-idx'); const field = t.getAttribute('data-field');
        if (idx !== null && field) { data.experience[Number(idx)][field] = t.value; renderPreview(); }
      });
      expContainer.addEventListener('click', function(ev){
        const rem = ev.target.getAttribute('data-remove');
        if (rem) { data.experience = data.experience.filter(x=>String(x.id)!==String(rem)); renderExperience(); renderPreview(); }
      });
    }

    const eduContainer = $('edu-container');
    if (eduContainer) {
      eduContainer.addEventListener('input', function(ev){
        const t = ev.target; const idx = t.getAttribute('data-idx'); const field = t.getAttribute('data-field');
        if (idx !== null && field) { data.education[Number(idx)][field] = t.value; renderPreview(); }
      });
      eduContainer.addEventListener('click', function(ev){
        const rem = ev.target.getAttribute('data-remove-edu');
        if (rem) { data.education = data.education.filter(x=>String(x.id)!==String(rem)); renderEducation(); renderPreview(); }
      });
    }

    const addExpBtn = $('add-exp');
    if (addExpBtn) addExpBtn.addEventListener('click', function(){
      const newId = data.experience.length ? Math.max(...data.experience.map(x=>x.id))+1 : 1;
      data.experience.push({ id:newId, title:'', company:'', years:'', description:'' });
      renderExperience(); renderPreview();
    });
    const addEduBtn = $('add-edu');
    if (addEduBtn) addEduBtn.addEventListener('click', function(){
      const newId = data.education.length ? Math.max(...data.education.map(x=>x.id))+1 : 1;
      data.education.push({ id:newId, degree:'', institution:'', years:'' });
      renderEducation(); renderPreview();
    });

    const saveBtn = $('saveBtn');
    if (saveBtn) saveBtn.addEventListener('click', function(){ data.accent = $('accent').value; saveState(data); if ($('last-actions')) $('last-actions').textContent = 'Saved locally at ' + new Date().toLocaleTimeString(); });
  // Dropdown menu: Suggestion button toggles a small menu with two options
  const openSuggestionsBtn = $('openSuggestions');
  const suggestionMenu = $('suggestionMenu');
  if (openSuggestionsBtn) {
    openSuggestionsBtn.addEventListener('click', function(e){
      e.stopPropagation();
      if (!suggestionMenu) return openSuggestionsWindow();
      const willShow = suggestionMenu.style.display !== 'block';
      suggestionMenu.style.display = willShow ? 'block' : 'none';
      if (willShow) {
        const mode = (menuOpenFull && menuOpenFull.getAttribute('data-mode')) || 'courses';
        showTab(mode);
      }
    });
  }
  // Tabbed menu behavior: render small lists inside the dropdown and allow opening full popups
  const tabCourses = $('tabCourses');
  const menuContentCourses = $('menuContentCourses');
  const menuOpenFull = $('menuOpenFull');

  function renderMenuCourses() {
    if (!menuContentCourses) return;
    const p = computeSuggestions();
    const items = p.list.slice(0,6);
    menuContentCourses.innerHTML = items.map(i=>`<div style="margin:6px 0;padding:6px;border-radius:6px;border:1px solid #f1f5f9;background:#fff"><a href="${i.link}" target="_blank" rel="noopener noreferrer" style="color:${data.accent};font-weight:700">${i.title}</a><div style="color:#64748b;font-size:12px">${i.note}</div></div>`).join('') + `<div style="margin-top:6px;color:#64748b;font-size:12px">Level: ${p.level}</div>`;
  }

  function renderMenuCerts() {
    if (!menuContentCerts) return;
    const items = CERTIFICATIONS.slice(0,6);
    menuContentCerts.innerHTML = items.map(i=>`<div style="margin:6px 0;padding:6px;border-radius:6px;border:1px solid #f1f5f9;background:#fff"><a href="${i.link}" target="_blank" rel="noopener noreferrer" style="color:${data.accent};font-weight:700">${i.title}</a><div style="color:#64748b;font-size:12px">${i.note}</div></div>`).join('');
  }

  function showTab(tab) {
    if (!suggestionMenu) return;
    if (tab === 'courses') {
      if (tabCourses) { tabCourses.style.background = '#eef2ff'; tabCourses.style.borderColor = 'transparent'; }
      if (tabCerts) { tabCerts.style.background = 'transparent'; tabCerts.style.borderColor = 'transparent'; }
      if (menuContentCourses) menuContentCourses.style.display = 'block';
      if (menuContentCerts) menuContentCerts.style.display = 'none';
      if (menuOpenFull) menuOpenFull.setAttribute('data-mode','courses');
      renderMenuCourses();
    } else {
      if (tabCerts) { tabCerts.style.background = '#eef2ff'; tabCerts.style.borderColor = 'transparent'; }
      if (tabCourses) { tabCourses.style.background = 'transparent'; tabCourses.style.borderColor = 'transparent'; }
      if (menuContentCourses) menuContentCourses.style.display = 'none';
      if (menuContentCerts) menuContentCerts.style.display = 'block';
      if (menuOpenFull) menuOpenFull.setAttribute('data-mode','certs');
      renderMenuCerts();
    }
  }

  if (tabCourses) tabCourses.addEventListener('click', function(e){ e.stopPropagation(); showTab('courses'); });
  if (tabCerts) tabCerts.addEventListener('click', function(e){ e.stopPropagation(); showTab('certs'); });
  // animate a plane flying from the 'Open full' button into the sky, then open the appropriate popup
  function flyPlaneAndOpen(mode, startEl, targetWin) {
    const plane = $('flightPlane');
    if (!plane) {
      // no plane available — immediately open suggestions (use provided window if any)
      openSuggestionsWindow(targetWin);
      return;
    }
    // ensure plane is visible and reset styles
    plane.style.display = 'block';
    plane.style.transition = 'none';
    plane.style.opacity = '1';
    plane.style.transform = 'translate3d(0px,0px,0px) rotate(0deg)';
    // measure start position (center of button)
    const r = startEl.getBoundingClientRect();
    const pw = plane.offsetWidth || 56;
    const ph = plane.offsetHeight || 56;
    const startX = r.left + (r.width/2) - (pw/2);
    const startY = r.top + (r.height/2) - (ph/2);
    plane.style.left = startX + 'px';
    plane.style.top = startY + 'px';

    // compute a target point (fly to top-right offscreen)
    const targetX = window.innerWidth + 120; // off to the right
    const targetY = -120; // off top

    // force reflow then animate
    requestAnimationFrame(() => {
      const dx = targetX - startX;
      const dy = targetY - startY;
      // add a slight arc via translate3d and rotateZ
      plane.style.transition = 'transform 900ms cubic-bezier(.2,.8,.2,1), opacity 900ms ease';
      plane.style.transform = `translate3d(${dx}px, ${dy}px, 120px) rotate(25deg) scale(1)`;
      plane.style.opacity = '0';
    });

    // after animation ends open the modal (inline) for better UX
    function onEnd() {
      plane.style.display = 'none';
      plane.style.transition = '';
      plane.style.transform = '';
      plane.style.opacity = '';
      plane.removeEventListener('transitionend', onEnd);
        // on animation end: if a targetWin was provided, write into that (new tab), else open inline modal
        if (targetWin) {
          if (mode === 'courses') openSuggestionsWindow(targetWin);
          else openCertificationsWindow(targetWin);
        } else {
          if (mode === 'courses') openSuggestionsModal();
          else openCertificationsModal();
        }
    }
    plane.addEventListener('transitionend', onEnd);
  }

  if (menuOpenFull) menuOpenFull.addEventListener('click', function(e){
    e.stopPropagation();
    if (suggestionMenu) suggestionMenu.style.display = 'none';
    // decide which mode to open (courses or certs)
    const mode = (menuOpenFull && menuOpenFull.getAttribute('data-mode')) || 'courses';
    // open a blank tab synchronously (to avoid popup blockers), then play flight animation and fill it
    const blank = window.open('', '_blank');
    if (!blank) return alert('Popup blocked — allow popups to open full suggestions.');
    flyPlaneAndOpen(mode, menuOpenFull, blank);
  });

  // modal helpers: render into inline modal instead of a new window
  function openSuggestionsModal() {
    const modal = $('suggestionModal'); if (!modal) return openSuggestionsWindow();
    const content = $('modalContent'); const title = $('modalTitle');
    const p = computeSuggestions();
    title.textContent = `Course Suggestions — ${p.level}`;
    content.innerHTML = p.list.map(i=>`<div class="item"><a href="${i.link}" target="_blank" rel="noopener noreferrer">${i.title}</a><div style="color:#64748b;font-size:13px;margin-top:6px">${i.note}</div></div>`).join('');
    modal.style.display = 'flex'; modal.setAttribute('aria-hidden','false');
    if ($('last-actions')) $('last-actions').textContent = `Opened suggestions (${p.level}) at ${new Date().toLocaleTimeString()}`;
  }

  function openCertificationsModal() {
    const modal = $('suggestionModal'); if (!modal) return openCertificationsWindow();
    const content = $('modalContent'); const title = $('modalTitle');
    title.textContent = 'Recommended Certifications';
    content.innerHTML = (CERTIFICATIONS || []).map(i=>`<div class="item"><a href="${i.link}" target="_blank" rel="noopener noreferrer">${i.title}</a><div style="color:#64748b;font-size:13px;margin-top:6px">${i.note}</div></div>`).join('');
    modal.style.display = 'flex'; modal.setAttribute('aria-hidden','false');
    if ($('last-actions')) $('last-actions').textContent = `Opened certifications at ${new Date().toLocaleTimeString()}`;
  }

  // certifications modal removed; suggestions modal only shows courses

  // modal close wiring
  const modal = $('suggestionModal'); if (modal) {
    const close = $('modalClose'); if (close) close.addEventListener('click', function(){ modal.style.display='none'; modal.setAttribute('aria-hidden','true'); });
    modal.querySelector('.modal-backdrop')?.addEventListener('click', function(){ modal.style.display='none'; modal.setAttribute('aria-hidden','true'); });
  }

  // allow Shift+click on the Suggestion button to trigger the flight+modal directly
  if (openSuggestionsBtn) openSuggestionsBtn.addEventListener('click', function(e){ if (e.shiftKey) { e.stopPropagation(); if (suggestionMenu) suggestionMenu.style.display='none'; const mode = (menuOpenFull && menuOpenFull.getAttribute('data-mode')) || 'courses'; const blank = window.open('', '_blank'); if (!blank) { alert('Popup blocked — allow popups to open full suggestions.'); return; } flyPlaneAndOpen(mode, openSuggestionsBtn, blank); } });

  // close menu when clicking outside
  document.addEventListener('click', function(){ if (suggestionMenu) suggestionMenu.style.display = 'none'; });
    const scoreBtn = $('scoreBtn'); if (scoreBtn) scoreBtn.addEventListener('click', openScoreWindow);
    const downloadBtn = $('downloadBtn'); if (downloadBtn) downloadBtn.addEventListener('click', downloadPdf);
  }

  // initialize UI
  init();
  wire();

})();
