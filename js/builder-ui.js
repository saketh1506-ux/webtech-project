(function(){
  // builder-ui: DOM wiring, rendering, animations
  const $ = id => document.getElementById(id);
  const escape = s => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const DB_KEY = 'mern_resume_builder_singlefile_v1';
  const LEARN_KEY = 'learning_plan_v1';
  // last computed score result (set when score is calculated)
  window._lastScoreResult = window._lastScoreResult || null;

  function load(){ try{ const raw = localStorage.getItem(DB_KEY); return raw ? JSON.parse(raw) : null; } catch(e){console.error(e); return null;} }
  function saveState(state){ try{ localStorage.setItem(DB_KEY, JSON.stringify(state)); return true; } catch(e){ console.error(e); return false; } }

  let data = load() || {
    personal: {
      name: 'Alex Morgan',
      title: 'Senior MERN Engineer',
      email: 'alex.morgan@example.com',
      phone: '+1 (555) 123-4567',
      linkedin: 'linkedin.com/in/alexmorgan',
      summary: 'Senior MERN engineer with 7+ years building high-performance web applications. Experienced in React, Next.js, Node.js and scalable APIs. Led teams to deliver production features, improve performance by 45%, and increase user engagement. Passionate about testing, CI/CD and mentoring.'
    },
    experience: [
      {
        id: 1,
        title: 'Senior MERN Engineer',
        company: 'Acme Tech',
        years: '2021 - Present',
        description: 'Led design and implementation of a MERN platform: developed Node.js/Express microservices, built React/Next.js frontends, integrated MongoDB and Redis caching. Reduced page load time by 45% and increased API throughput by 3x. Mentored 4 engineers and drove feature delivery.'
      },
      {
        id: 2,
        title: 'Full-stack Developer',
        company: 'Beta Labs',
        years: '2018 - 2021',
        description: 'Implemented REST APIs and real-time features; created CI/CD pipelines and Docker-based deployments. Optimized database queries resulting in 60% faster report generation and reduced bugs by 30% through testing and automation.'
      }
    ],
    education: [
      { id: 1, degree: 'B.Tech in Computer Science', institution: 'State University', years: '2012 - 2016' }
    ],
    skills: 'React, Next.js, Redux, JavaScript, TypeScript, Node.js, Express, MongoDB, Mongoose, REST API, GraphQL, Docker, CI/CD, Tailwind, HTML, CSS',
    accent: '#4f46e5'
  };

  // Debug: confirm core is loaded
  console.log('[builder-ui] loaded, builderCore=', !!window.builderCore);

  function renderExperience(){ const container = $('exp-container'); if(!container) return; container.innerHTML=''; data.experience.forEach((e,idx)=>{ const div=document.createElement('div'); div.style.border='1px solid #eef2ff'; div.style.padding='10px'; div.style.marginBottom='8px'; div.style.borderRadius='8px'; div.innerHTML = `\
    <label>Title</label><input data-idx="${idx}" data-field="title" type="text" value="${escape(e.title)}">\
    <label>Company</label><input data-idx="${idx}" data-field="company" type="text" value="${escape(e.company)}">\
    <label>Years</label><input data-idx="${idx}" data-field="years" type="text" value="${escape(e.years)}">\
    <label>Description</label><textarea data-idx="${idx}" data-field="description" rows="3">${escape(e.description)}</textarea>\
    <div style="text-align:right;margin-top:8px"><button data-remove="${e.id}" style="background:#fff;border:1px solid #fee2e2;color:#ef4444;padding:6px 8px;border-radius:8px">Remove</button></div>`; container.appendChild(div); }); }

  function renderEducation(){ const container = $('edu-container'); if(!container) return; container.innerHTML=''; data.education.forEach((e,idx)=>{ const div=document.createElement('div'); div.style.border='1px solid #eef2ff'; div.style.padding='10px'; div.style.marginBottom='8px'; div.style.borderRadius='8px'; div.innerHTML = `\
    <label>Degree</label><input data-idx="${idx}" data-field="degree" type="text" value="${escape(e.degree)}">\
    <label>Institution</label><input data-idx="${idx}" data-field="institution" type="text" value="${escape(e.institution)}">\
    <label>Years</label><input data-idx="${idx}" data-field="years" type="text" value="${escape(e.years)}">\
    <div style="text-align:right;margin-top:8px"><button data-remove-edu="${e.id}" style="background:#fff;border:1px solid #fee2e2;color:#ef4444;padding:6px 8px;border-radius:8px">Remove</button></div>`; container.appendChild(div); }); }

  function renderPreview(){ const p = $('preview'); if(!p) return; p.innerHTML = `\
    <div style="border-bottom:6px solid ${data.accent};padding-bottom:10px;border-radius:6px 6px 0 0">\
      <div style="font-weight:800;font-size:18px;color:#0f172a">${escape(data.personal.name)}</div>\
      <div style="color:${data.accent};font-weight:700">${escape(data.personal.title)}</div>\
      <div style="color:#64748b;font-size:13px;margin-top:6px">${escape(data.personal.phone)} | ${escape(data.personal.email)} | ${escape(data.personal.linkedin)}</div>\
    </div>\
    <div style="padding:10px">\
      <div style="margin-top:6px"><strong>Summary</strong><div style="color:#334155">${escape(data.personal.summary)}</div></div>\
      <div style="margin-top:10px"><strong>Experience</strong>${data.experience.map(e=>`<div style="margin-top:8px"><div style="font-weight:600">${escape(e.title)} • ${escape(e.company)} <span style="color:#64748b;font-weight:400">(${escape(e.years)})</span></div><div style="color:#334155">${escape(e.description)}</div></div>`).join('')}</div>\
      <div style="margin-top:10px"><strong>Education</strong>${data.education.map(e=>`<div style="margin-top:8px"><div style="font-weight:600">${escape(e.degree)} <span style="color:#64748b">(${escape(e.years)})</span></div><div style="color:#334155">${escape(e.institution)}</div></div>`).join('')}</div>\
      <div style="margin-top:10px"><strong>Skills</strong><div style="color:#334155">${escape(data.skills)}</div></div>\
    </div>`; }

  function initFields(){ if ($('accent')) $('accent').value = data.accent || '#4f46e5'; if ($('name')) $('name').value = data.personal.name || ''; if ($('title')) $('title').value = data.personal.title || ''; if ($('email')) $('email').value = data.personal.email || ''; if ($('phone')) $('phone').value = data.personal.phone || ''; if ($('linkedin')) $('linkedin').value = data.personal.linkedin || ''; if ($('summary')) $('summary').value = data.personal.summary || ''; if ($('skills')) $('skills').value = data.skills || ''; }

  // keep CSS accent variable in sync
  function syncAccentCss(color){ try{ document.documentElement.style.setProperty('--accent', color); }catch(e){} }

  // menu rendering
  function renderMenuCourses(){ const menu = $('menuContentCourses'); if(!menu) return; const p = window.builderCore.computeSuggestions(data.skills); const items = p.list.slice(0,6); menu.innerHTML = items.map(i=>`<div style="margin:6px 0;padding:6px;border-radius:6px;border:1px solid #f1f5f9;background:#fff"><a href="${i.link}" target="_blank" rel="noopener noreferrer" style="color:${data.accent};font-weight:700">${i.title}</a><div style="color:#64748b;font-size:12px">${i.note}</div></div>`).join('') + `<div style="margin-top:6px;color:#64748b;font-size:12px">Level: ${p.level}</div>`; }
  function renderMenuCerts(){ const menu = $('menuContentCerts'); if(!menu) return; const items = (window.builderCore.CERTIFICATIONS||[]).slice(0,6); menu.innerHTML = items.map(i=>`<div style="margin:6px 0;padding:6px;border-radius:6px;border:1px solid #f1f5f9;background:#fff"><a href="${i.link}" target="_blank" rel="noopener noreferrer" style="color:${data.accent};font-weight:700">${i.title}</a><div style="color:#64748b;font-size:12px">${i.note}</div></div>`).join(''); }

  function showTab(tab){ const menu = $('suggestionMenu'); if(!menu) return; const tabCourses = $('tabCourses'); const tabCerts = $('tabCerts'); const menuCourses = $('menuContentCourses'); const menuCerts = $('menuContentCerts'); if(tab==='certs'){ if(tabCerts){ tabCerts.style.background='#eef2ff'; tabCerts.style.borderColor='transparent'; } if(tabCourses){ tabCourses.style.background='transparent'; } if(menuCourses) menuCourses.style.display='none'; if(menuCerts) menuCerts.style.display='block'; if($('menuOpenFull')) $('menuOpenFull').setAttribute('data-mode','certs'); renderMenuCerts(); } else { if(tabCourses){ tabCourses.style.background='#eef2ff'; tabCourses.style.borderColor='transparent'; } if(tabCerts){ tabCerts.style.background='transparent'; } if(menuCourses) menuCourses.style.display='block'; if(menuCerts) menuCerts.style.display='none'; if($('menuOpenFull')) $('menuOpenFull').setAttribute('data-mode','courses'); renderMenuCourses(); } }

  // flyPlaneAndOpen: if a target window/tab is provided, skip any animation
  // and populate the new tab immediately. If no targetWin is provided,
  // open the inline modal directly (no plane animation — the DOM element
  // was removed per request).
  function flyPlaneAndOpen(mode, startEl, targetWin){
    if(targetWin){
      // populate provided window immediately
      if(mode === 'courses') return openSuggestionsWindow(targetWin);
      return openCertificationsWindow(targetWin);
    }
    // No target window: open inline modal (previously animated)
    if(mode === 'courses') return openSuggestionsModal();
    return openCertificationsModal();
  }

  // helper to open suggestions/certs windows (and return the window)
  function openSuggestionsWindow(targetWin){ return window.builderCore && window.builderCore.computeSuggestions ? openWindowWithHtml(targetWin, renderSuggestionsHtml()) : null; }
  function openCertificationsWindow(targetWin){ return openWindowWithHtml(targetWin, renderCertificationsHtml()); }
  function openWindowWithHtml(targetWin, html){ const w = targetWin || window.open(); if(!w) return null; try{ w.document.open(); w.document.write(html); w.document.close(); }catch(e){ console.error(e); } if($('last-actions')) $('last-actions').textContent = `Opened suggestions at ${new Date().toLocaleTimeString()}`; return w; }

  function renderSuggestionsHtml(){ const p = window.builderCore.computeSuggestions(data.skills); const listHtml = p.list.map(item=>`<div style="margin:10px 0;padding:10px;border-radius:8px;border:1px solid #eef2ff;background:#fff"><a href="${item.link}" target="_blank" rel="noopener noreferrer" style="font-weight:700;color:${data.accent}">${item.title}</a><div style="color:#64748b">${item.note}</div></div>`).join(''); return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Course Suggestions</title><style>body{font-family:Inter,Arial;padding:20px;background:#f8fafc;color:#0f172a} a{color:${data.accent};font-weight:700}</style></head><body><h1>Course Suggestions — ${p.level}</h1><p style="color:#64748b">Matched: ${p.matched.join(', ') || '(none)'}</p>${listHtml}</body></html>`; }
  function renderSuggestionsHtml(){ const p = window.builderCore.computeSuggestions(data.skills); const items = p.list || []; const listHtml = items.map(item=>`<div style="margin:10px 0;padding:10px;border-radius:8px;border:1px solid #eef2ff;background:#fff"><a href="${item.link}" target="_blank" rel="noopener noreferrer" style="font-weight:700;color:${data.accent}">${item.title}</a><div style="color:#64748b">${item.note}</div><div style="margin-top:8px"><button class="add-plan" data-title="${item.title}" data-link="${item.link}" data-note="${item.note}">Add to learning plan</button></div></div>`).join('');
    return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Course Suggestions</title><style>body{font-family:Inter,Arial;padding:20px;background:#f8fafc;color:#0f172a} a{color:${data.accent};font-weight:700} .add-plan{padding:6px 8px;border-radius:8px;border:1px solid #e6e9ee;background:#fff;cursor:pointer}</style></head><body><h1>Course Suggestions — ${p.level}</h1><p style="color:#64748b">Matched: ${p.matched.join(', ') || '(none)'}</p>${listHtml}
    <script>
      (function(){ const openerHas = window.opener && window.opener._lastScoreResult; if(!openerHas){ document.querySelectorAll('.add-plan').forEach(b=>b.setAttribute('disabled','disabled')); }
        document.querySelectorAll('.add-plan').forEach(b=>{ b.addEventListener('click', function(){ try{ const item={ title:this.getAttribute('data-title'), link:this.getAttribute('data-link'), note:this.getAttribute('data-note') }; const raw = localStorage.getItem('learning_plan_v1'); const arr = raw?JSON.parse(raw):[]; if(!arr.find(x=>x.link===item.link)) arr.push(item); localStorage.setItem('learning_plan_v1', JSON.stringify(arr)); this.textContent='Added'; this.disabled=true; }catch(e){console.error(e);} }); }); })();
    </script></body></html>`; }
  function renderCertificationsHtml(){ const items = (window.builderCore.CERTIFICATIONS||[]); const listHtml = items.map(item=>`<div style="margin:10px 0;padding:10px;border-radius:8px;border:1px solid #eef2ff;background:#fff"><a href="${item.link}" target="_blank" rel="noopener noreferrer" style="font-weight:700;color:${data.accent}">${item.title}</a><div style="color:#64748b">${item.note}</div></div>`).join(''); return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Certifications</title><style>body{font-family:Inter,Arial;padding:20px;background:#f8fafc;color:#0f172a} a{color:${data.accent};font-weight:700}</style></head><body><h1>Certifications</h1>${listHtml}</body></html>`; }

  function openSuggestionsModal(){
    const modal = $('suggestionModal'); if(!modal) return openSuggestionsWindow();
    // build personalized full list (use last score tokens when available)
    const allCurated = window.builderCore && window.builderCore.CURATED ? window.builderCore.CURATED : {};
    const last = window._lastScoreResult || window.builderCore.computeSuggestions(data.skills) || {};
    const tokens = (last.matched || []).map(s=>String(s||'').toLowerCase());
    function itemScore(it){ const hay = (it.title + ' ' + (it.note||'')).toLowerCase(); let sc=0; tokens.forEach(t=>{ if(!t) return; if(hay.includes(t)) sc+=3; if(t.length>3 && hay.includes(t.slice(0,4))) sc+=1; }); return sc; }
    const perLevel = { Foundational:3, Intermediate:3, Advanced:4 };
    const ordered = [];
    ['Foundational','Intermediate','Advanced'].forEach(level=>{
      const pool = (allCurated[level]||[]).map(it=>Object.assign({level}, it)).sort((a,b)=> itemScore(b) - itemScore(a));
      const take = perLevel[level] || 0;
      for(let i=0;i<Math.min(take,pool.length);i++) ordered.push(pool[i]);
    });
    const remaining = Object.keys(allCurated).reduce((acc,k)=> acc.concat((allCurated[k]||[]).map(it=>Object.assign({level:k}, it))),[]).filter(x=> !ordered.find(o=>o.link===x.link)).sort((a,b)=> itemScore(b) - itemScore(a));
    const fullList = ordered.concat(remaining);
    // render first page with show more (inline modal)
    const pageSize = 8; const first = fullList.slice(0,pageSize);
    $('modalTitle').textContent = `Course Suggestions`;
    const canAdd = !!window._lastScoreResult;
    $('modalContent').innerHTML = '<div id="modal-suggestions-list">' + first.map(i=>`<div class="item"><a href="${i.link}" target="_blank" rel="noopener noreferrer">${i.title}</a><div style="color:#64748b;font-size:13px;margin-top:6px">${i.note}</div><div style="margin-top:8px"><button class="add-plan-inline" data-title="${escape(i.title)}" data-link="${i.link}" data-note="${escape(i.note)}" ${canAdd ? '' : 'disabled title="Calculate score to enable"'}>Add to learning plan</button></div></div>`).join('') + '</div>' + (fullList.length>pageSize ? `<div style="text-align:center;margin-top:8px"><button id="modalShowMore">Show more (${fullList.length-pageSize} more)</button></div>` : '');
    modal.style.display='flex'; modal.setAttribute('aria-hidden','false');
    // wire inline handlers
    setTimeout(()=>{
      const btn = document.getElementById('modalShowMore'); if(btn){ let shown=pageSize; btn.addEventListener('click', function(){ shown = Math.min(fullList.length, shown + pageSize); const listEl = document.getElementById('modal-suggestions-list'); listEl.innerHTML = fullList.slice(0,shown).map(i=>`<div class="item"><a href="${i.link}" target="_blank" rel="noopener noreferrer">${i.title}</a><div style="color:#64748b;font-size:13px;margin-top:6px">${i.note}</div><div style="margin-top:8px"><button class="add-plan-inline" data-title="${escape(i.title)}" data-link="${i.link}" data-note="${escape(i.note)}" ${canAdd ? '' : 'disabled title="Calculate score to enable"'}>Add to learning plan</button></div></div>`).join(''); attachInlineAddHandlers(); if(shown>=fullList.length) btn.style.display='none'; }); }
      function attachInlineAddHandlers(){ document.querySelectorAll('.add-plan-inline').forEach(b=>{ if(b._bound) return; b._bound=true; b.addEventListener('click', function(){ const item={ title:this.getAttribute('data-title'), link:this.getAttribute('data-link'), note:this.getAttribute('data-note') }; try{ const raw = localStorage.getItem('learning_plan_v1'); const arr = raw?JSON.parse(raw):[]; if(arr.find(x=>x.link===item.link)){ this.textContent='In plan'; this.disabled=true; return; } arr.push(item); localStorage.setItem('learning_plan_v1', JSON.stringify(arr)); this.textContent='Added'; this.disabled=true; this.style.background='#10b981'; this.style.color='#fff'; }catch(e){console.error(e);} }); }); }
      attachInlineAddHandlers();
    }, 50);
    if($('last-actions')) $('last-actions').textContent = `Opened suggestions at ${new Date().toLocaleTimeString()}`;
  }
  function openCertificationsModal(){ const modal = $('suggestionModal'); if(!modal) return openCertificationsWindow(); $('modalTitle').textContent = 'Recommended Certifications'; $('modalContent').innerHTML = (window.builderCore.CERTIFICATIONS||[]).map(i=>`<div class="item"><a href="${i.link}" target="_blank" rel="noopener noreferrer">${i.title}</a><div style="color:#64748b;font-size:13px;margin-top:6px">${i.note}</div></div>`).join(''); modal.style.display='flex'; modal.setAttribute('aria-hidden','false'); if($('last-actions')) $('last-actions').textContent = `Opened certifications at ${new Date().toLocaleTimeString()}`; }

  // wire events
  function wire(){
    if($('accent')) $('accent').addEventListener('input', e=>{ data.accent = e.target.value; renderPreview(); syncAccentCss(data.accent); });
    if($('name')) $('name').addEventListener('input', e=>{ data.personal.name = e.target.value; renderPreview(); });
    if($('title')) $('title').addEventListener('input', e=>{ data.personal.title = e.target.value; renderPreview(); });
    if($('email')) $('email').addEventListener('input', e=>{ data.personal.email = e.target.value; renderPreview(); });
    if($('phone')) $('phone').addEventListener('input', e=>{ data.personal.phone = e.target.value; renderPreview(); });
    if($('linkedin')) $('linkedin').addEventListener('input', e=>{ data.personal.linkedin = e.target.value; renderPreview(); });
    if($('summary')) $('summary').addEventListener('input', e=>{ data.personal.summary = e.target.value; renderPreview(); });
    if($('skills')) $('skills').addEventListener('input', e=>{ data.skills = e.target.value; renderPreview(); renderMenuCourses(); });

    const expContainer = $('exp-container'); if(expContainer){ expContainer.addEventListener('input', function(ev){ const t=ev.target; const idx=t.getAttribute('data-idx'); const field=t.getAttribute('data-field'); if(idx!==null && field){ data.experience[Number(idx)][field] = t.value; renderPreview(); } }); expContainer.addEventListener('click', function(ev){ const rem = ev.target.getAttribute('data-remove'); if(rem){ data.experience = data.experience.filter(x=>String(x.id)!==String(rem)); renderExperience(); renderPreview(); } }); }
    const eduContainer = $('edu-container'); if(eduContainer){ eduContainer.addEventListener('input', function(ev){ const t=ev.target; const idx=t.getAttribute('data-idx'); const field=t.getAttribute('data-field'); if(idx!==null && field){ data.education[Number(idx)][field] = t.value; renderPreview(); } }); eduContainer.addEventListener('click', function(ev){ const rem = ev.target.getAttribute('data-remove-edu'); if(rem){ data.education = data.education.filter(x=>String(x.id)!==String(rem)); renderEducation(); renderPreview(); } }); }

    const addExpBtn = $('add-exp'); if(addExpBtn) addExpBtn.addEventListener('click', function(){ const newId = data.experience.length ? Math.max(...data.experience.map(x=>x.id))+1 : 1; data.experience.push({ id:newId, title:'', company:'', years:'', description:'' }); renderExperience(); renderPreview(); });
    const addEduBtn = $('add-edu'); if(addEduBtn) addEduBtn.addEventListener('click', function(){ const newId = data.education.length ? Math.max(...data.education.map(x=>x.id))+1 : 1; data.education.push({ id:newId, degree:'', institution:'', years:'' }); renderEducation(); renderPreview(); });

    const saveBtn = $('saveBtn'); if(saveBtn) saveBtn.addEventListener('click', function(){ data.accent = $('accent').value; saveState(data); if($('last-actions')) $('last-actions').textContent = 'Saved locally at ' + new Date().toLocaleTimeString(); });

    const openSuggestionsBtn = $('openSuggestions'); const suggestionMenu = $('suggestionMenu'); if(openSuggestionsBtn){ openSuggestionsBtn.addEventListener('click', function(e){ e.stopPropagation(); if(!suggestionMenu) return openSuggestionsWindow(); const willShow = suggestionMenu.style.display !== 'block'; suggestionMenu.style.display = willShow ? 'block' : 'none'; if(willShow){ const mode = ($('menuOpenFull') && $('menuOpenFull').getAttribute('data-mode')) || 'courses'; showTab(mode); } }); }

  // My Plan button opens the learning plan page in a new tab
  const myPlanBtn = $('myPlanBtn'); if(myPlanBtn) myPlanBtn.addEventListener('click', function(){ const w = window.open('myplan.html', '_blank'); if(!w) return alert('Popup blocked — allow popups to open My Plan'); w.focus(); });

    const tabCourses = $('tabCourses'); const tabCerts = $('tabCerts'); if(tabCourses) tabCourses.addEventListener('click', function(e){ e.stopPropagation(); showTab('courses'); }); if(tabCerts) tabCerts.addEventListener('click', function(e){ e.stopPropagation(); showTab('certs'); });

    const menuOpenFull = $('menuOpenFull'); if(menuOpenFull) menuOpenFull.addEventListener('click', function(e){ e.stopPropagation(); if(suggestionMenu) suggestionMenu.style.display='none'; const mode = (menuOpenFull && menuOpenFull.getAttribute('data-mode')) || 'courses'; const blank = window.open('', '_blank'); if(!blank) return alert('Popup blocked — allow popups to open full suggestions.'); flyPlaneAndOpen(mode, menuOpenFull, blank); });

    // Shift+click shortcut
    if(openSuggestionsBtn) openSuggestionsBtn.addEventListener('click', function(e){ if(e.shiftKey){ e.stopPropagation(); if(suggestionMenu) suggestionMenu.style.display='none'; const mode = ($('menuOpenFull') && $('menuOpenFull').getAttribute('data-mode')) || 'courses'; const blank = window.open('', '_blank'); if(!blank){ alert('Popup blocked — allow popups to open full suggestions.'); return; } flyPlaneAndOpen(mode, openSuggestionsBtn, blank); } });

    // modal wiring
    const modal = $('suggestionModal'); if(modal){ const close = $('modalClose'); if(close) close.addEventListener('click', function(){ modal.style.display='none'; modal.setAttribute('aria-hidden','true'); }); modal.querySelector('.modal-backdrop')?.addEventListener('click', function(){ modal.style.display='none'; modal.setAttribute('aria-hidden','true'); }); }

    // score & download
    const scoreBtn = $('scoreBtn'); if(scoreBtn) scoreBtn.addEventListener('click', function(){ const res = window.builderCore.calculateScore(data); // expose last score to the page so modals/other flows can know
      window._lastScoreResult = res;
      const html = renderScorePopup(res); const w = window.open(); if(!w) return alert('Popup blocked'); w.document.write(html); w.document.close(); if($('last-actions')) $('last-actions').textContent = `Score opened (${res.overallScore}) at ${new Date().toLocaleTimeString()}`; });
    const downloadBtn = $('downloadBtn'); if(downloadBtn) downloadBtn.addEventListener('click', function(){ // pdf
      const preview = $('preview'); if(!preview) return alert('Preview missing.');
      html2canvas(preview, { scale:2, useCORS:true }).then(canvas=>{
        try{
          const imgData = canvas.toDataURL('image/jpeg', 0.95);
          // Resolve jsPDF constructor across UMD shapes
          const jsPDFCtor = (window.jspdf && (window.jspdf.jsPDF || (window.jspdf.default && window.jspdf.default.jsPDF))) || window.jsPDF || null;
          if(!jsPDFCtor){ console.error('jsPDF not found', window.jspdf, window.jsPDF); return alert('PDF library not available.'); }
          const pdf = new jsPDFCtor({ unit:'mm', format:'a4', orientation:'portrait' });
          const pxToMm = px=>px*0.264583;
          const imgWmm = pxToMm(canvas.width);
          const imgHmm = pxToMm(canvas.height);
          const pageW = pdf.internal.pageSize.getWidth();
          const ratio = Math.min(pageW / imgWmm, 1);
          const renderW = imgWmm * ratio;
          const renderH = imgHmm * ratio;
          pdf.addImage(imgData, 'JPEG', (pageW - renderW)/2, 10, renderW, renderH);
          const filename = (data.personal?.name || 'resume').replace(/\s+/g,'_').toLowerCase() + '_resume.pdf';
          if(typeof pdf.save === 'function') pdf.save(filename);
          else if(typeof pdf.output === 'function'){ const blob = pdf.output('blob'); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); }
          if($('last-actions')) $('last-actions').textContent = 'Downloaded PDF';
        }catch(err){ console.error(err); alert('PDF generation failed — see console.'); }
      }).catch(err=>{ console.error(err); alert('Canvas rendering failed — see console.'); });
    });
  }

  function renderScorePopup(res){
    const score = Number(res.overallScore || 0);
    const metricsHtml = res.analysis.map(a=>`<div class="metric-card"><div class="metric-head"><strong>${a.metric}</strong><span class="points">${a.points} pts</span></div><div class="metric-feedback">${a.feedback}</div></div>`).join('');
    const matched = (res.matched || []).join(', ') || '(none)';
    const verbs = (res.verbsFound || []).join(', ') || '(none)';
    const accent = data.accent || '#4f46e5';
    const color = score >= 80 ? '#10b981' : (score >= 60 ? '#f59e0b' : '#ef4444');
    const r = 48; const c = Math.PI * 2 * r; const offset = Math.round(c * (1 - (score/100)));

    // build an ordered suggestions list across levels (prefer matches)
    const allCurated = window.builderCore && window.builderCore.CURATED ? window.builderCore.CURATED : {};
    const tokens = (res.matched || []).map(s=>String(s||'').toLowerCase());
    function itemScore(it){ const hay = (it.title + ' ' + (it.note||'')).toLowerCase(); let sc=0; tokens.forEach(t=>{ if(!t) return; if(hay.includes(t)) sc+=3; if(t.length>3 && hay.includes(t.slice(0,4))) sc+=1; }); return sc; }
    const perLevel = { Foundational:3, Intermediate:3, Advanced:4 };
    const ordered = [];
    ['Foundational','Intermediate','Advanced'].forEach(level=>{
      const pool = (allCurated[level]||[]).map(it=>Object.assign({level}, it)).sort((a,b)=> itemScore(b) - itemScore(a));
      const take = perLevel[level] || 0;
      for(let i=0;i<Math.min(take,pool.length);i++) ordered.push(pool[i]);
    });
    const remaining = Object.keys(allCurated).reduce((acc,k)=> acc.concat((allCurated[k]||[]).map(it=>Object.assign({level:k}, it))),[]).filter(x=> !ordered.find(o=>o.link===x.link)).sort((a,b)=> itemScore(b) - itemScore(a));
    const fullList = ordered.concat(remaining);
    const pageSize = 10;

    // embed fullList into the popup as JSON (safe-escape '<')
    const safeJson = JSON.stringify(fullList).replace(/</g,'\\u003c');

    return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Resume Score</title>
    <style>
      :root{--accent:${accent};--score-color:${color}}
      body{font-family:Inter,Arial,Helvetica,sans-serif;padding:18px;background:#f8fafc;color:#0f172a}
      .wrap{max-width:980px;margin:0 auto;display:grid;grid-template-columns:180px 1fr;gap:18px;align-items:start}
      .badge{background:linear-gradient(180deg,rgba(255,255,255,0.9),#fff);border-radius:12px;padding:18px;display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 10px 30px rgba(2,6,23,0.08)}
      .score-svg{width:120px;height:120px}
      .score-num{font-weight:800;font-size:28px;margin-top:8px;color:var(--score-color)}
      h1{margin:0 0 6px 0;font-size:20px}
      .subtitle{color:#64748b;font-size:13px;margin-bottom:12px}
      .metric-list{display:flex;flex-direction:column;gap:10px}
      .metric-card{background:#fff;border-radius:10px;padding:12px;border:1px solid #eef2ff}
      .metric-head{display:flex;justify-content:space-between;align-items:center}
      .metric-feedback{color:#64748b;margin-top:8px;font-size:13px}
      .actions{margin-top:14px;display:flex;gap:8px}
      .btn{padding:8px 12px;border-radius:10px;border:0;cursor:pointer;font-weight:700}
      .btn-primary{background:var(--accent);color:#fff}
      .btn-ghost{background:transparent;border:1px solid #e6e9ee;color:#0f172a}
      .matched{color:#0f172a;font-size:13px;margin-top:8px}
      .suggestions{margin-top:18px;background:#fff;padding:12px;border-radius:10px;border:1px solid #eef2ff}
      .sugg-item{margin-bottom:10px}
      .add-plan{padding:6px 8px;border-radius:8px;border:1px solid #e6e9ee;background:#fff;cursor:pointer}
      @media (max-width:720px){ .wrap{grid-template-columns:1fr; } .badge{order:2} }
    </style>
    </head><body>
    <h1>Resume Score</h1>
    <div class="subtitle">Matched skills: ${matched} — Verbs: ${verbs}</div>
    <div class="wrap">
      <div class="badge">
        <svg class="score-svg" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="g" x1="0%" x2="100%" y1="0%" y2="100%">
              <stop offset="0%" stop-color="${accent}" stop-opacity="0.95"/>
              <stop offset="100%" stop-color="${color}"/>
            </linearGradient>
          </defs>
          <circle cx="60" cy="60" r="48" stroke="#eef2ff" stroke-width="12" fill="none"/>
          <circle id="progress" cx="60" cy="60" r="48" stroke="url(#g)" stroke-width="12" stroke-linecap="round" fill="none" stroke-dasharray="${c}" stroke-dashoffset="${c}" transform="rotate(-90 60 60)" />
          <text x="60" y="66" text-anchor="middle" font-size="20" font-weight="800" fill="#0f172a">${score}%</text>
        </svg>
        <div class="score-num">Overall: ${score}/100</div>
        <div class="matched">${res.summaryWords || ''} words in summary</div>
      </div>
      <div>
        <div class="metric-list">${metricsHtml}</div>
        <div class="actions">
          <button class="btn btn-primary" id="openBuilder">Open Builder</button>
          <button class="btn btn-ghost" id="openSuggestions">View in Popup</button>
          <button class="btn btn-ghost" id="openAll">See all (open in builder)</button>
        </div>
        <div id="suggestions" class="suggestions">
          <h3 style="margin-top:0">Suggested courses</h3>
          <div id="suggestions-list"></div>
          <div id="suggestions-more" style="text-align:center;margin-top:8px"></div>
        </div>
      </div>
    </div>
    <script>
  // embed suggestions data
  const SUGGESTIONS = ${safeJson};
  const PAGE_SIZE = ${pageSize};
  const POP_ACCENT = ${JSON.stringify(accent)};
      let shown = Math.min(PAGE_SIZE, SUGGESTIONS.length);
      function esc(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function renderList(){ const el = document.getElementById('suggestions-list'); if(!el) return; el.innerHTML = SUGGESTIONS.slice(0,shown).map(function(i){ return '<div class="sugg-item" data-link="'+i.link+'">' + '<a href="'+i.link+'" target="_blank" rel="noopener noreferrer" style="color:'+POP_ACCENT+';font-weight:700">' + esc(i.title) + '</a>' + '<div style="color:#64748b;font-size:13px;margin-top:6px">' + esc(i.note) + '</div>' + '<div style="margin-top:8px"><button class="add-plan" data-title="'+esc(i.title)+'" data-link="'+esc(i.link)+'" data-note="'+esc(i.note)+'" data-level="'+esc(i.level||'')+'">Add to learning plan</button></div></div>'; }).join('');
        const moreEl = document.getElementById('suggestions-more'); if(!moreEl) return; if(shown < SUGGESTIONS.length){ moreEl.innerHTML = '<button id="showMore" class="btn btn-ghost">Show more ('+(SUGGESTIONS.length - shown)+' more)</button>'; document.getElementById('showMore').addEventListener('click', function(){ shown = Math.min(SUGGESTIONS.length, shown + PAGE_SIZE); renderList(); }); } else { moreEl.innerHTML = ''; }
        attachAddHandlers(); }
      function attachAddHandlers(){ document.querySelectorAll('.add-plan').forEach(btn=>{ if(btn._bound) return; btn._bound = true; btn.addEventListener('click', function(){ const item = { title: this.dataset.title, link: this.dataset.link, note: this.dataset.note, level: this.dataset.level }; try{ const raw = localStorage.getItem('learning_plan_v1'); const list = raw ? JSON.parse(raw) : []; if(list.find(x=>x.link===item.link)){ this.textContent='In plan'; this.disabled=true; return; } list.push(item); localStorage.setItem('learning_plan_v1', JSON.stringify(list)); this.textContent='Added'; this.disabled=true; this.style.background='#10b981'; this.style.color='#fff'; }catch(e){ console.error(e); alert('Failed to add to learning plan'); } }); }); }

      // animate progress stroke
      (function(){
        const progress = document.getElementById('progress');
        if(!progress) return;
        const circumference = ${c};
        const targetOffset = ${offset};
        let start = null; const duration = 700;
        function step(ts){ if(!start) start=ts; const t = Math.min(1, (ts-start)/duration); const eased = (--t)*t*t+1; const cur = Math.round(circumference - (circumference - targetOffset) * eased); progress.setAttribute('stroke-dashoffset', cur); if(eased<1) requestAnimationFrame(step); }
        requestAnimationFrame(step);
      })();

      document.getElementById('openBuilder').addEventListener('click', function(){ window.location.href = 'builder.html'; });
      document.getElementById('openSuggestions').addEventListener('click', function(){ const el = document.getElementById('suggestions'); if(el) el.scrollIntoView({behavior:'smooth'}); else { const w = window.open('builder.html', '_blank'); if(!w) return alert('Popup blocked'); w.focus(); } });
      document.getElementById('openAll').addEventListener('click', function(){ const w = window.open('builder.html?openSuggestions=1', '_blank'); if(!w) return alert('Popup blocked'); w.focus(); });

      // initial render
      renderList();
    </script>
    </body></html>`;
  }

  // initialization
  function init(){ initFields(); renderExperience(); renderEducation(); renderPreview(); renderMenuCourses(); }
  // If builder opened with query ?openSuggestions=1 or ?openCerts=1, open modal
  function checkOpenFromQuery(){
    try{
      const params = new URLSearchParams(window.location.search);
      if(params.get('openSuggestions') === '1'){
        // open suggestions modal right away
        setTimeout(()=> openSuggestionsModal(), 300);
      }
      if(params.get('openCerts') === '1'){
        setTimeout(()=> openCertificationsModal(), 300);
      }
    }catch(e){/* ignore */}
  }

  function init(){ initFields(); renderExperience(); renderEducation(); renderPreview(); renderMenuCourses(); checkOpenFromQuery(); }
  init(); wire();

})();
