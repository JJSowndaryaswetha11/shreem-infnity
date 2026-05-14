
// Preloader
window.addEventListener('load',()=>{setTimeout(()=>{document.getElementById('preloader').classList.add('hidden');},1400);});

// Custom cursor
const cur=document.getElementById('cur'),curR=document.getElementById('curRing');
document.addEventListener('mousemove',e=>{cur.style.left=e.clientX+'px';cur.style.top=e.clientY+'px';curR.style.left=e.clientX+'px';curR.style.top=e.clientY+'px';});

// Nav scroll
window.addEventListener('scroll',()=>{
  document.getElementById('navbar').classList.toggle('scrolled',window.scrollY>50);
  document.getElementById('btt').classList.toggle('show',window.scrollY>400);
});

// Hamburger
document.getElementById('ham').addEventListener('click',()=>document.getElementById('mobMenu').classList.toggle('open'));
function closeMob(){document.getElementById('mobMenu').classList.remove('open');}

// Reveal animations
const revObserver=new IntersectionObserver(entries=>{
  entries.forEach((e,i)=>{if(e.isIntersecting){setTimeout(()=>e.target.classList.add('in'),i*90);revObserver.unobserve(e.target);}});
},{threshold:0.08,rootMargin:'0px 0px -30px 0px'});
document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el=>revObserver.observe(el));

// Form
function handleSubmit(){alert('Thank you! We will contact you within 24 hours to confirm your appointment. ✦\n\nSee you soon at Shreeminfinity!');}
