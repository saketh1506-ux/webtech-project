import React, { useEffect, useState } from 'react';

export default function MyPlan(){
  const KEY = 'learning_plan_v1';
  const [list, setList] = useState([]);

  useEffect(()=>{ load(); },[]);

  function load(){
    try{ const raw = localStorage.getItem(KEY); setList(raw? JSON.parse(raw): []); }
    catch(e){ console.error(e); setList([]); }
  }

  function save(next){ try{ localStorage.setItem(KEY, JSON.stringify(next)); }catch(e){ console.error(e);} }

  function clear(){ if(!window.confirm('Clear all saved courses from your learning plan?')) return; localStorage.removeItem(KEY); setList([]); }

  function exportJson(){ const blob = new Blob([JSON.stringify(list,null,2)], {type:'application/json'}); const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='learning_plan.json'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); }

  function openAt(i){ const it = list[i]; if(!it) return; window.location.assign(it.link); }
  function removeAt(i){ const next = list.slice(); next.splice(i,1); setList(next); save(next); }

  return (
    <div style={{fontFamily:'Inter,Arial',padding:20,maxWidth:900,margin:'0 auto'}}>
      <h1>My Learning Plan</h1>
      <div style={{display:'flex',gap:8,marginBottom:12}}>
        <button className="btn-ghost" onClick={exportJson}>Export JSON</button>
        <button className="btn-dl" onClick={clear}>Clear All</button>
      </div>
      {(!list || list.length===0) && <div style={{color:'#64748b'}}>No courses in your plan yet. Add some from Builder → Suggestions.</div>}
      {list && list.map((it,i)=> (
        <div key={i} className="card" style={{marginBottom:10}}>
          <div style={{display:'flex',justifyContent:'space-between',gap:12,alignItems:'center'}}>
            <div style={{flex:1}}>
              <div style={{fontWeight:700}}><a href={it.link} style={{color:'#4f46e5'}}>{it.title}</a></div>
              <div style={{color:'#64748b',fontSize:13}}>{it.note || ''} {it.level? ' • ' + it.level : ''}</div>
            </div>
            <div style={{textAlign:'right'}}>
              <div style={{marginBottom:8}}><button className="btn" onClick={()=>openAt(i)}>Open</button></div>
              <div><button className="btn" style={{background:'#ef4444',color:'#fff'}} onClick={()=>removeAt(i)}>Remove</button></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
