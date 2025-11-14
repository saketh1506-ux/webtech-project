import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();
  const openBuilder = () => navigate('/builder');
  return (
    <main className="landing" style={{fontFamily:'Inter,Arial'}}>
      <section className="hero-shell">
        <div className="hero-card">
          <header className="brand">
            <span className="bolt">⚡</span>
            <span className="brand-text"><strong>ElevateCV</strong></span>
          </header>

          <h1 className="hero-title">Make a recruiter-ready MERN
            <br/>resume — fast.</h1>
          <p className="hero-sub">Live preview, rule-based scoring, curated course suggestions, and
            downloadable multi-page PDF export. Click <strong>Get started</strong> to open the builder.</p>

          <div className="cta-row">
            <Link to="/getstarted" className="btn btn-primary">Get started →</Link>
            <button onClick={openBuilder} className="btn btn-dark">Open builder</button>
            <Link to="/getstarted" className="btn btn-ghost">Quick tour</Link>
          </div>

          <div className="pill-row">
            <span className="pill">Live preview</span>
            <span className="pill">Course suggestions</span>
            <span className="pill">Rule-based score</span>
            <span className="pill">Download PDF</span>
          </div>

          <div className="tip-row">
            <span className="tip">Tip: Open the builder in a new tab so you can keep this landing page open.</span>
            <label className="chk"><input type="checkbox"/> Don't show again</label>
          </div>
        </div>
        <div className="hero-glow" aria-hidden="true" />
      </section>
    </main>
  );
}
