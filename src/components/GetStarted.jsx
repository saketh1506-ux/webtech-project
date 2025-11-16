import React, { useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function GetStarted(){
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const innerRef = useRef(null);

  useEffect(()=>{
    const wrap = cardRef.current;
    const inner = innerRef.current;
    if(!wrap || !inner) return;
    function onMove(e){
      const r = wrap.getBoundingClientRect();
      const mx = (e.clientX - r.left) / r.width - 0.5;
      const my = (e.clientY - r.top) / r.height - 0.5;
      const rotY = mx * 12; const rotX = -my * 8;
      const transX = mx * -10; const transY = my * -6;
      inner.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) translate3d(${transX}px, ${transY}px, 6px)`;
    }
    function onLeave(){ inner.style.transform=''; }
    wrap.addEventListener('mousemove', onMove);
    wrap.addEventListener('mouseleave', onLeave);
    return ()=>{ wrap.removeEventListener('mousemove', onMove); wrap.removeEventListener('mouseleave', onLeave); };
  },[]);

  async function handleExploreCourses(){
    try{
      // Fire API calls so they show in backend logs immediately
      await Promise.allSettled([
        fetch('/api/links?kind=course'),
        fetch('/api/links?kind=certification')
      ]);
    }catch(_e){ /* ignore */ }
    navigate('/courses');
  }

  return (
    <div className="gs-page" style={{fontFamily:'Inter,Arial'}}>
      <header className="gs-header">
        <div className="container bar">
          <div className="logo">ElevateCV</div>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/builder">Builder</Link>
            <Link to="/builder" className="cta">Get started</Link>
          </nav>
        </div>
      </header>

      <main className="gs-hero">
        <div className="container hero-grid">
          <section className="hero-left">
            <div className="eyebrow">INTRODUCING</div>
            <h1>Resume Builder for Developers</h1>
            <p className="lead">Quickly craft an ATS-friendly MERN resume, highlight quantified achievements, and get curated course suggestions to grow your skills.</p>
            <div className="hero-actions">
              <button onClick={()=>navigate('/builder')} className="btn ghost">Documentation</button>
              <button onClick={()=>navigate('/builder')} className="btn primary">Get started</button>
            </div>
          </section>

          <section className="hero-right">
            <div id="interactivePanel" className="panel">
              <div id="card3d" className="card3d" ref={cardRef}>
                <div className="card-inner" ref={innerRef}>
                  <div className="card-face">
                    <h3>Build. Improve. Ship.</h3>
                    <p className="card-desc">Create a recruiter-ready MERN resume and get course recommendations tailored to your skills.</p>
                    <div className="card-cta">
                      <button onClick={handleExploreCourses} className="btn primary">Explore Courses</button>
                    </div>
                  </div>
                </div>
              </div>

              <div id="featureList" className="feature-list">
                <div className="fitem"><strong>Live Preview</strong><span>See edits instantly</span></div>
                <div className="fitem"><strong>Score Report</strong><span>Actionable suggestions</span></div>
                <div className="fitem"><strong>Curated Courses</strong><span>Paths to level up</span></div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
