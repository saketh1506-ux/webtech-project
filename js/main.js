// Landing -> open builder (separated file)
(function(){
  const HIDE_KEY = 'mern_hide_splash_singlefile_v1';
  const getStartedBtn = document.getElementById('getStarted');
  const skipBtn = document.getElementById('skipBtn');
  const tourBtn = document.getElementById('tourBtn');
  const dont = document.getElementById('dontShowAgain');

  function openBuilder(savePref) {
    if (savePref) localStorage.setItem(HIDE_KEY, '1');
    const w = window.open('builder.html', '_blank');
    if (!w) { alert('Popup blocked — allow popups or open the builder manually'); return; }
    w.focus();
  }

  // auto-open if user chose don't show again earlier
  if (localStorage.getItem(HIDE_KEY) === '1') {
    openBuilder(false);
  }

  if (getStartedBtn) getStartedBtn.addEventListener('click', () => openBuilder(dont.checked));
  if (skipBtn) skipBtn.addEventListener('click', () => openBuilder(dont.checked));
  if (tourBtn) tourBtn.addEventListener('click', () => {
    alert('Quick tour:\n• Get started opens the builder in a new tab.\n• Save stores your resume locally.\n• Suggestion opens curated MERN courses.\n• Get Score opens a report.\n• Download exports a multi-page PDF.');
  });
  // Open examples (order button) demo
  const orderDemoBtn = document.getElementById('orderDemoBtn');
  if (orderDemoBtn) orderDemoBtn.addEventListener('click', () => {
    const w = window.open('examples/order-button.html', '_blank');
    if (!w) return alert('Popup blocked — allow popups to view the demo');
    w.focus();
  });

  // subtle 3D parallax for landing scene
  function initParallax() {
    const scene = document.querySelector('.scene');
    if (!scene) return;
    const cards = scene.querySelectorAll('.card');
    let raf = null;
    let mouse = { x: 0, y: 0 };
    let bounds = null;

    function update() {
      if (!bounds) bounds = scene.getBoundingClientRect();
      const nx = (mouse.x - bounds.left) / bounds.width - 0.5;
      const ny = (mouse.y - bounds.top) / bounds.height - 0.5;
      const rotY = nx * 10; // degrees
      const rotX = -ny * 8;
      scene.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      // move individual cards for depth
      cards.forEach((c, i) => {
        const depth = (i - (cards.length/2)) * 10;
        const tx = nx * depth * -6;
        const ty = ny * depth * -6;
        c.style.transform = `translate3d(${tx}px, ${ty}px, ${depth}px)`;
      });
      raf = null;
    }

    scene.addEventListener('mousemove', function(e){ mouse.x = e.clientX; mouse.y = e.clientY; if (!raf) raf = requestAnimationFrame(update); });
    scene.addEventListener('mouseleave', function(){ bounds = null; scene.style.transform = 'rotateX(0deg) rotateY(0deg)'; cards.forEach((c)=> c.style.transform=''); });
  }
  // init after DOM ready
  document.addEventListener('DOMContentLoaded', initParallax);
})();
