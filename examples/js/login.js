document.addEventListener('DOMContentLoaded', function(){
  const form = document.querySelector('.form-box');
  const toggle = document.getElementById('toggle');
  let showingRegister = false;

  toggle.addEventListener('click', ()=>{
    showingRegister = !showingRegister;
    if(showingRegister){
      form.classList.add('register');
      toggle.textContent = 'Back to Login';
    } else {
      form.classList.remove('register');
      toggle.textContent = 'Switch to Register';
    }
  });

  // simple submit handler (demo only)
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    alert('Demo: form submitted — this is an example only.');
  });
});
