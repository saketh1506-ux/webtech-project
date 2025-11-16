import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { computeSuggestions, calculateScore } from '../lib/builderCore.js';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const defaultData = {
  personal: {
    name: 'Alex Morgan',
    title: 'Senior MERN Engineer',
    email: 'alex.morgan@example.com',
    phone: '+1 (555) 123-4567',
    linkedin: 'linkedin.com/in/alexmorgan',
    summary:
      'Senior MERN engineer with 7+ years delivering scalable, user-centric web apps. Designed and implemented React/Next.js frontends and Node.js/Express APIs backed by MongoDB. Led teams, optimized performance, and improved reliability through testing and clean architecture. Proven impact with measurable results, strong communication, and a continuous learning mindset aligned to business goals.'
  },
  experience: [
    {
      id: 1,
      title: 'Senior MERN Engineer',
      company: 'Acme Tech',
      years: '2021 - Present',
      description:
        'Led and engineered a MERN platform serving 1M+ users; optimized React rendering and Node.js APIs, reducing TTFB by 45% and increasing throughput 3x. Implemented CI testing, designed REST API contracts, and created reusable components; managed cross-functional delivery and mentored 5 engineers.'
    },
    {
      id: 2,
      title: 'Full-Stack Developer',
      company: 'Bright Labs',
      years: '2018 - 2021',
      description:
        'Designed and developed React/Redux features and Express services; implemented Mongoose data models and optimized MongoDB indexes, reducing query time by 60%. Created TypeScript tooling, implemented authentication, and increased conversion by 18% through A/B-tested UI improvements.'
    }
  ],
  education: [
    { id: 1, degree: 'B.Tech in Computer Science', institution: 'State University', years: '2012 - 2016' }
  ],
  skills:
    'React, Next.js, Redux, TypeScript, JavaScript, Node.js, Express, REST API, MongoDB, Mongoose, Tailwind, MERN',
  accent: '#4f46e5',
  textColor: '#334155'
};

export default function Builder(){
  const navigate = useNavigate();
  const [data, setData] = useState(defaultData);
  const [saving, setSaving] = useState(false);

  function update(fieldPath, value){
    setData(curr => {
      const copy = JSON.parse(JSON.stringify(curr));
      const [section, field] = fieldPath.split('.');
      if(section === 'personal') copy.personal[field] = value;
      else copy[fieldPath] = value;
      return copy;
    });
  }

  function updateAccent(e){ update('personal.accent', e.target.value); setData(d=>({...d, accent:e.target.value})); }
  function addExp(){ setData(d=>({ ...d, experience: d.experience.concat({ id: Date.now(), title:'', company:'', years:'', description:'' }) })); }
  function addEdu(){ setData(d=>({ ...d, education: d.education.concat({ id: Date.now(), degree:'', institution:'', years:'' }) })); }
  function removeExp(id){ setData(d=>({ ...d, experience: d.experience.filter(x=>x.id!==id) })); }
  function removeEdu(id){ setData(d=>({ ...d, education: d.education.filter(x=>x.id!==id) })); }

  function runScore(){
    const res = calculateScore(data);
    const sugg = computeSuggestions(data.skills);
    try{
      localStorage.setItem('score_page_v1', JSON.stringify({ res, sugg, accent: data.accent || '#4f46e5' }));
    }catch(e){ /* ignore storage errors */ }
    // Use hard navigation to avoid any router edge cases
    window.location.assign('/score');
  }

  async function downloadPdf(){
    const el = document.getElementById('resumePreview');
    if(!el) return;
    const canvas = await html2canvas(el, { scale: 2, background: '#ffffff', useCORS: true });
    const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });

    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const margin = 10; // mm

    const pxToMm = px => px * 0.264583;
    const mmToPx = mm => mm / 0.264583;
    const imgWmm = pxToMm(canvas.width);
    const pxPerMm = canvas.width / imgWmm;

    const renderW = Math.min(pageW - margin * 2, imgWmm);
    const scale = renderW / imgWmm; // scaling applied in PDF
    const pageContentHmm = pageH - margin * 2; // mm

    // Slice height in source pixels that fits one page after scaling
    const sliceHeightPx = Math.floor((pageContentHmm / scale) * pxPerMm);

    let y = 0; let pageIndex = 0;
    while (y < canvas.height) {
      const sliceH = Math.min(sliceHeightPx, canvas.height - y);
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = sliceH;
      const ctx = tempCanvas.getContext('2d');
      ctx.drawImage(canvas, 0, y, canvas.width, sliceH, 0, 0, canvas.width, sliceH);
      const imgData = tempCanvas.toDataURL('image/jpeg', 0.95);

      if (pageIndex > 0) pdf.addPage();
      const renderH = pxToMm(sliceH) * scale; // mm after scaling
      const x = (pageW - renderW) / 2;
      pdf.addImage(imgData, 'JPEG', x, margin, renderW, renderH, undefined, 'FAST');

      y += sliceH;
      pageIndex += 1;
    }

    const filename = (data.personal.name || 'resume').replace(/\s+/g, '_').toLowerCase() + '_resume.pdf';
    pdf.save(filename);
  }

  async function saveToBackend(){
    setSaving(true);
    try {
      const res = await fetch('/api/resumes', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) });
      if(!res.ok) throw new Error('Save failed');
      const json = await res.json();
      alert('Saved resume with id ' + json._id);
    } catch(e){ alert('Backend save failed (check server / Mongo).'); } finally { setSaving(false); }
  }

  function addToPlan(item){
    try{
      const raw = localStorage.getItem('learning_plan_v1');
      const list = raw ? JSON.parse(raw) : [];
      if(!list.find(x=>x.link === item.link)) list.push(item);
      localStorage.setItem('learning_plan_v1', JSON.stringify(list));
      alert('Added to My Plan');
    }catch(e){ console.error(e); alert('Failed to save to plan'); }
  }

  return (
    <div style={{fontFamily:'Inter,Arial',padding:18,maxWidth:1300,margin:'0 auto'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
        <div>
          <div style={{fontWeight:800,fontSize:20}}>ElevateCV</div>
          <div style={{color:'#64748b',fontSize:13}}>Edit, score, suggest & export PDF.</div>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button onClick={runScore} className="btn-save">Get Score</button>
          <button onClick={downloadPdf} className="btn-dl">PDF</button>
          <button onClick={saveToBackend} disabled={saving} className="btn-save">{saving? 'Saving...' : 'Save DB'}</button>
          <button onClick={()=>navigate('/myplan')} className="btn-ghost">My Plan</button>
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'340px 1fr',gap:18}}>
        <div>
          <section className="card">
            <h3>Personal</h3>
            <label>Accent</label><input type="color" value={data.accent} onChange={e=>setData(d=>({...d, accent:e.target.value}))} />
            <label>Font Color</label><input type="color" value={data.textColor} onChange={e=>setData(d=>({...d, textColor:e.target.value}))} />
            <label>Name</label><input value={data.personal.name} onChange={e=>update('personal.name', e.target.value)} />
            <label>Title</label><input value={data.personal.title} onChange={e=>update('personal.title', e.target.value)} />
            <label>Email</label><input value={data.personal.email} onChange={e=>update('personal.email', e.target.value)} />
            <label>Phone</label><input value={data.personal.phone} onChange={e=>update('personal.phone', e.target.value)} />
            <label>LinkedIn</label><input value={data.personal.linkedin} onChange={e=>update('personal.linkedin', e.target.value)} />
            <label>Summary</label><textarea rows={4} value={data.personal.summary} onChange={e=>update('personal.summary', e.target.value)} />
          </section>
          <section className="card" style={{marginTop:12}}>
            <h3>Experience</h3>
            {data.experience.map(item => (
              <div key={item.id} style={{border:'1px solid #eef2ff',padding:8,borderRadius:8,marginBottom:8}}>
                <input placeholder="Title" value={item.title} onChange={e=>setData(d=>({...d,experience:d.experience.map(x=>x.id===item.id? {...x,title:e.target.value}:x)}))} />
                <input placeholder="Company" value={item.company} onChange={e=>setData(d=>({...d,experience:d.experience.map(x=>x.id===item.id? {...x,company:e.target.value}:x)}))} />
                <input placeholder="Years" value={item.years} onChange={e=>setData(d=>({...d,experience:d.experience.map(x=>x.id===item.id? {...x,years:e.target.value}:x)}))} />
                <textarea rows={3} placeholder="Description" value={item.description} onChange={e=>setData(d=>({...d,experience:d.experience.map(x=>x.id===item.id? {...x,description:e.target.value}:x)}))} />
                <div style={{textAlign:'right'}}><button className="btn-remove" onClick={()=>removeExp(item.id)}>Remove</button></div>
              </div>
            ))}
            <button onClick={addExp} className="btn-save">+ Add Experience</button>
          </section>
          <section className="card" style={{marginTop:12}}>
            <h3>Education</h3>
            {data.education.map(item => (
              <div key={item.id} style={{border:'1px solid #eef2ff',padding:8,borderRadius:8,marginBottom:8}}>
                <input placeholder="Degree" value={item.degree} onChange={e=>setData(d=>({...d,education:d.education.map(x=>x.id===item.id? {...x,degree:e.target.value}:x)}))} />
                <input placeholder="Institution" value={item.institution} onChange={e=>setData(d=>({...d,education:d.education.map(x=>x.id===item.id? {...x,institution:e.target.value}:x)}))} />
                <input placeholder="Years" value={item.years} onChange={e=>setData(d=>({...d,education:d.education.map(x=>x.id===item.id? {...x,years:e.target.value}:x)}))} />
                <div style={{textAlign:'right'}}><button className="btn-remove" onClick={()=>removeEdu(item.id)}>Remove</button></div>
              </div>
            ))}
            <button onClick={addEdu} className="btn-save">+ Add Education</button>
          </section>
          <section className="card" style={{marginTop:12}}>
            <h3>Skills</h3>
            <textarea rows={2} value={data.skills} onChange={e=>setData(d=>({...d, skills:e.target.value}))} />
          </section>
        </div>
        <div>
          <section className="card">
            <h3>Preview</h3>
            <div id="resumePreview" style={{borderBottom:`6px solid ${data.accent}`,paddingBottom:10,color:data.textColor}}>
              <div style={{fontWeight:800,fontSize:18}}>{data.personal.name}</div>
              <div style={{color:data.accent,fontWeight:700}}>{data.personal.title}</div>
              <div style={{color:'#64748b',fontSize:13,marginTop:6}}>{data.personal.phone} | {data.personal.email} | {data.personal.linkedin}</div>
              <div style={{marginTop:10}}><strong>Summary</strong><div style={{color:data.textColor}}>{data.personal.summary}</div></div>
              <div style={{marginTop:10}}><strong>Experience</strong>{data.experience.map(e=> <div key={e.id} style={{marginTop:8}}><div style={{fontWeight:600}}>{e.title} • {e.company} <span style={{color:'#64748b',fontWeight:400}}>({e.years})</span></div><div style={{color:data.textColor}}>{e.description}</div></div>)}</div>
              <div style={{marginTop:10}}><strong>Education</strong>{data.education.map(e=> <div key={e.id} style={{marginTop:8}}><div style={{fontWeight:600}}>{e.degree} <span style={{color:'#64748b'}}>({e.years})</span></div><div style={{color:data.textColor}}>{e.institution}</div></div>)}</div>
              <div style={{marginTop:10}}><strong>Skills</strong><div style={{color:data.textColor}}>{data.skills}</div></div>
            </div>
          </section>
          {/* Suggestions and Certifications removed as requested. Score details are shown on the /score page. */}
        </div>
      </div>
    </div>
  );
}
