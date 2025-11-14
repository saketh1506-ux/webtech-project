import React from 'react';
import { Link } from 'react-router-dom';

export default function App() {
  return (
    <div style={{padding:20,fontFamily:'Inter,Arial'}}>
      <h2>Fallback App Shell</h2>
      <p>Use the navigation below:</p>
      <nav style={{display:'flex',gap:12}}>
        <Link to="/">Landing</Link>
        <Link to="/getstarted">Get Started</Link>
        <Link to="/builder">Builder</Link>
        <Link to="/myplan">My Plan</Link>
      </nav>
    </div>
  );
}
