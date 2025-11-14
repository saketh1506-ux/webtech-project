import React from 'react';
import { Link } from 'react-router-dom';
import { CURATED, CERTIFICATIONS } from '../lib/builderCore.js';

export default function Courses(){
  const sections = [
    { key: 'Foundational', items: CURATED.Foundational },
    { key: 'Intermediate', items: CURATED.Intermediate },
    { key: 'Advanced', items: CURATED.Advanced },
  ];

  return (
    <div className="courses-page" style={{fontFamily:'Inter,Arial'}}>
      <header className="gs-header">
        <div className="container bar">
          <div className="logo">ElevateCV</div>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/builder">Builder</Link>
            <Link to="/myplan">My Plan</Link>
          </nav>
        </div>
      </header>

      <main className="container" style={{padding:'32px 16px'}}>
        <h1 style={{margin:'0 0 8px'}}>Explore Courses</h1>
        <p className="lead" style={{margin:'0 0 24px', color:'#555'}}>Curated learning resources to grow your MERN skills.</p>

        <div className="course-sections" style={{display:'grid', gap:'24px'}}>
          {sections.map(sec => (
            <section key={sec.key}>
              <h2 style={{margin:'0 0 12px'}}>{sec.key}</h2>
              <div className="grid" style={{display:'grid', gap:'12px', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))'}}>
                {sec.items.map((c, idx) => (
                  <a key={idx} href={c.link} target="_blank" rel="noreferrer" className="card" style={{
                    display:'block', padding:'14px 16px', border:'1px solid #e5e7eb', borderRadius:10, background:'#fff', textDecoration:'none'
                  }}>
                    <div style={{fontWeight:600, color:'#111'}}>{c.title}</div>
                    {c.note && <div style={{fontSize:13, color:'#555', marginTop:6}}>{c.note}</div>}
                    <div style={{fontSize:12, color:'#2563eb', marginTop:10}}>Open resource →</div>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section style={{marginTop:32}}>
          <h2 style={{margin:'0 0 12px'}}>Recommended Certifications</h2>
          <div className="grid" style={{display:'grid', gap:'12px', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))'}}>
            {CERTIFICATIONS.map((c, idx) => (
              <a key={idx} href={c.link} target="_blank" rel="noreferrer" className="card" style={{
                display:'block', padding:'14px 16px', border:'1px solid #e5e7eb', borderRadius:10, background:'#fff', textDecoration:'none'
              }}>
                <div style={{fontWeight:600, color:'#111'}}>{c.title}</div>
                {c.note && <div style={{fontSize:13, color:'#555', marginTop:6}}>{c.note}</div>}
                <div style={{fontSize:12, color:'#2563eb', marginTop:10}}>View certification →</div>
              </a>
            ))}
          </div>
        </section>

        <div style={{marginTop:32, display:'flex', gap:12}}>
          <Link to="/builder" className="btn ghost">Back to Builder</Link>
          <Link to="/myplan" className="btn primary">Go to My Plan</Link>
        </div>
      </main>
    </div>
  );
}
