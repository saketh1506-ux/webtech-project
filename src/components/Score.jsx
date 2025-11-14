import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CERTIFICATIONS } from '../lib/builderCore.js';

export default function Score(){
  const navigate = useNavigate();
  const [payload, setPayload] = useState(null);
  const progressRef = useRef(null);

  // Load computed score + suggestions from Builder
  useEffect(()=>{
    try{
      const raw = localStorage.getItem('score_page_v1');
      const data = raw ? JSON.parse(raw) : null;
      if(!data || !data.res){ navigate('/builder', { replace:true }); return; }
      setPayload(data);
    }catch(e){ navigate('/builder', { replace:true }); }
  }, [navigate]);

  const accent = payload?.accent || '#4f46e5';
  const res = payload?.res || { overallScore:0, analysis:[], matched:[], verbsFound:[], summaryWords:0 };
  const sugg = payload?.sugg || { level:'', list:[] };
  const score = Number(res.overallScore || 0);
  const color = score >= 80 ? '#10b981' : (score >= 60 ? '#f59e0b' : '#ef4444');
  const r = 48; const circumference = Math.PI * 2 * r; const targetOffset = Math.round(circumference * (1 - (score/100)));

  function addToPlan(item){
    try{
      const raw = localStorage.getItem('learning_plan_v1');
      const list = raw ? JSON.parse(raw) : [];
      if(!list.find(x=>x.link===item.link)) list.push(item);
      localStorage.setItem('learning_plan_v1', JSON.stringify(list));
      alert('Added to My Plan');
    }catch(e){ alert('Failed to add to plan'); }
  }

  // Animate ring
  useEffect(()=>{
    if(!payload) return; // run only when we have data
    const el = progressRef.current; if(!el) return;
    let start = null; const duration = 700;
    function step(ts){
      if(!start) start = ts;
      const t = Math.min(1, (ts - start) / duration);
      const eased = (--t)*t*t + 1; // easeOutCubic
      const cur = Math.round(circumference - (circumference - targetOffset) * eased);
      el.setAttribute('stroke-dashoffset', String(cur));
      if(eased < 1) requestAnimationFrame(step);
    }
    el.setAttribute('stroke-dasharray', String(circumference));
    el.setAttribute('stroke-dashoffset', String(circumference));
    const raf = requestAnimationFrame(step);
    return ()=> cancelAnimationFrame(raf);
  }, [payload, circumference, targetOffset]);

  if(!payload){
    return (
      <div style={{fontFamily:'Inter,Arial,Helvetica,sans-serif', padding:18, background:'#0b1220', color:'#e6ecff', minHeight:'100vh'}}>
        <div style={{maxWidth:980,margin:'0 auto'}}>
          <h1 style={{margin:0,fontSize:18}}>Loading score…</h1>
        </div>
      </div>
    );
  }

  return (
    <div style={{fontFamily:'Inter,Arial,Helvetica,sans-serif', padding:18, background:'#0b1220', color:'#e6ecff', minHeight:'100vh'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',maxWidth:980,margin:'0 auto 12px'}}>
        <div>
          <h1 style={{margin:0,fontSize:22}}>Resume Score</h1>
          <div style={{color:'#a8b5ff',fontSize:13}}>Matched skills: {(res.matched||[]).join(', ') || '(none)'} — Verbs: {(res.verbsFound||[]).join(', ')||'(none)'} — {res.summaryWords||0} words in summary</div>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button className="btn-save" style={{padding:'8px 12px',borderRadius:10,border:'1px solid #2b3557',background:'#0f172a',color:'#e6ecff'}} onClick={()=>navigate('/builder')}>Back to Builder</button>
          <button className="btn-save" style={{padding:'8px 12px',borderRadius:10,border:'1px solid #2b3557',background:'#0f172a',color:'#e6ecff'}} onClick={()=>navigate('/myplan')}>My Plan</button>
        </div>
      </div>

      <div style={{maxWidth:980, margin:'0 auto', display:'grid', gridTemplateColumns:'200px 1fr', gap:18, alignItems:'start'}}>
        <div style={{background:'linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))', border:'1px solid rgba(99,102,241,0.15)', borderRadius:12, padding:18, display:'flex', flexDirection:'column', alignItems:'center', boxShadow:'0 10px 30px rgba(2,6,23,0.35)'}}>
          <svg style={{width:120,height:120}} viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="g" x1="0%" x2="100%" y1="0%" y2="100%">
                <stop offset="0%" stopColor={accent} stopOpacity="0.95" />
                <stop offset="100%" stopColor={color} />
              </linearGradient>
            </defs>
            <circle cx="60" cy="60" r="48" stroke="#1f2a44" strokeWidth="12" fill="none"/>
            <circle ref={progressRef} cx="60" cy="60" r="48" stroke="url(#g)" strokeWidth="12" strokeLinecap="round" fill="none" transform="rotate(-90 60 60)" />
            <text x="60" y="66" textAnchor="middle" fontSize="20" fontWeight="800" fill="#e6ecff">{score}%</text>
          </svg>
          <div style={{fontWeight:800, fontSize:28, marginTop:8, color}}>{`Overall: ${score}/100`}</div>
        </div>
        <div>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {(res.analysis||[]).map(a=> (
              <div key={a.metric} style={{background:'rgba(17,24,39,0.6)', border:'1px solid rgba(99,102,241,0.12)', borderRadius:10, padding:12}}>
                <div style={{display:'flex',justifyContent:'space-between'}}>
                  <strong>{a.metric}</strong>
                  <span>{a.points} pts</span>
                </div>
                <div style={{color:'#a3b0d8',marginTop:8,fontSize:13}}>{a.feedback}</div>
              </div>
            ))}
          </div>

          <div style={{marginTop:16, background:'rgba(17,24,39,0.6)', border:'1px solid rgba(99,102,241,0.12)', borderRadius:10, padding:12}}>
            <h3 style={{marginTop:0}}>Course Suggestions {sugg.level ? `(${sugg.level})` : ''}</h3>
            {(sugg.list||[]).slice(0,10).map(i=> (
              <div key={i.link} style={{margin:'10px 0'}}>
                <a href={i.link} style={{color:accent, fontWeight:700}}>{i.title}</a>
                <div style={{color:'#a3b0d8', fontSize:13, marginTop:6}}>{i.note || ''}</div>
                <div style={{marginTop:6}}>
                  <button onClick={()=>addToPlan({ title:i.title, link:i.link, note:i.note || '', level:sugg.level })} style={{padding:'6px 8px', borderRadius:8, border:'1px solid #2b3557', background:'#0f172a', color:'#e6ecff'}}>Add to plan</button>
                </div>
              </div>
            ))}
          </div>

          <div style={{marginTop:16, background:'rgba(17,24,39,0.6)', border:'1px solid rgba(99,102,241,0.12)', borderRadius:10, padding:12}}>
            <h3 style={{marginTop:0}}>Recommended Certifications</h3>
            {CERTIFICATIONS.slice(0,8).map(i=> (
              <div key={i.link} style={{margin:'10px 0'}}>
                <a href={i.link} style={{color:accent, fontWeight:700}}>{i.title}</a>
                <div style={{color:'#a3b0d8', fontSize:13, marginTop:6}}>{i.note || ''}</div>
                <div style={{marginTop:6}}>
                  <button onClick={()=>addToPlan({ title:i.title, link:i.link, note:i.note || '', level:'Cert' })} style={{padding:'6px 8px', borderRadius:8, border:'1px solid #2b3557', background:'#0f172a', color:'#e6ecff'}}>Add to plan</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
