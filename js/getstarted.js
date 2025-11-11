// getstarted.js — robot interaction: move robot toward CTA when hovered/clicked
document.addEventListener('DOMContentLoaded', function(){
  const card = document.querySelector('.card3d .card-inner');
  const exploreBtn = document.getElementById('exploreCourses');
  const docsBtn = document.getElementById('btnDocs');
  const featureItems = document.querySelectorAll('.feature-list .fitem');

  // 3D tilt effect on mouse move
  const cardWrap = document.getElementById('card3d');
  if(cardWrap && card){
    cardWrap.addEventListener('mousemove', function(e){
      const r = cardWrap.getBoundingClientRect();
      const mx = (e.clientX - r.left) / r.width - 0.5;
      const my = (e.clientY - r.top) / r.height - 0.5;
      const rotY = mx * 12; const rotX = -my * 8;
      const transX = mx * -10; const transY = my * -6;
      card.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) translate3d(${transX}px, ${transY}px, 6px)`;
    });
    cardWrap.addEventListener('mouseleave', function(){ card.style.transform = ''; });
  }

  // CTA hover pulse
  if(exploreBtn){
    exploreBtn.addEventListener('mouseenter', ()=> exploreBtn.style.transform = 'scale(1.03)');
    exploreBtn.addEventListener('mouseleave', ()=> exploreBtn.style.transform = '');
    exploreBtn.addEventListener('click', function(e){
      e.preventDefault();
      const w = window.open('builder.html', '_blank');
      if(!w) return alert('Popup blocked — allow popups to open the builder');
      w.focus();
    });
  }

  // Docs button opens builder docs (fallback to builder)
  if(docsBtn) docsBtn.addEventListener('click', function(){ window.open('builder.html', '_blank'); });

  // left-panel Get started button (id: btnGetStarted) — open builder in new tab
  const leftGetStarted = document.getElementById('btnGetStarted');
  if(leftGetStarted){
    leftGetStarted.addEventListener('click', function(e){ e.preventDefault(); const w = window.open('builder.html','_blank'); if(!w) return alert('Popup blocked — allow popups to open the builder'); w.focus(); });
  }

  // feature hover: highlight and show small tip
  featureItems.forEach(fi => {
    fi.addEventListener('mouseenter', ()=> fi.style.transform = 'translateX(-8px)');
    fi.addEventListener('mouseleave', ()=> fi.style.transform = '');
    fi.addEventListener('click', ()=> { const txt = fi.querySelector('strong').textContent; alert(txt + ': Click Get started to try.'); });
  });
});