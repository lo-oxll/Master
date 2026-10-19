
const $=s=>document.querySelector(s);
const q=$('#q');if(q)q.addEventListener('input',()=>{const v=q.value.trim().toLowerCase();
document.querySelectorAll('.card,.term').forEach(c=>c.style.display=c.textContent.toLowerCase().includes(v)?'':'none')});
const d=$('#topics');if(d){const k='prog:'+d.dataset.id;let s=JSON.parse(localStorage.getItem(k)||'[]');
const upd=()=>{const n=d.querySelectorAll('input'),c=[...n].filter(x=>x.checked).length;
$('#bar i').style.width=(c/n.length*100)+'%';$('#cnt').textContent=c+' / '+n.length;
localStorage.setItem(k,JSON.stringify([...n].map(x=>x.checked)))};
d.querySelectorAll('input').forEach((x,i)=>{x.checked=!!s[i];x.addEventListener('change',upd)});upd()}
(function(){const n=document.getElementById('notes');if(n){const k='note:'+n.dataset.id;n.value=localStorage.getItem(k)||'';n.oninput=()=>localStorage.setItem(k,n.value)}
const b=document.querySelector('.bm');if(b){const k='bm:'+b.dataset.id,u=location.pathname.split('/').pop(),sh=()=>b.textContent=localStorage.getItem(k)?'★ محفوظ':'☆ إضافة لدفتري';sh();b.onclick=()=>{localStorage.getItem(k)?localStorage.removeItem(k):localStorage.setItem(k,JSON.stringify([b.dataset.t,u]));sh()}}
const m=document.getElementById('mylist');if(m){let h='';for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k.startsWith('bm:')){const[t,u]=JSON.parse(localStorage.getItem(k)),nt=localStorage.getItem('note:'+k.slice(3))||'';h+='<div class="term"><a href="'+u+'"><b>'+t+'</b></a><p>'+nt.replace(/</g,'&lt;')+'</p></div>'}}m.innerHTML=h||'<p class="meta">لا مواضيع محفوظة بعد.</p>'}})();
(function(){const e=document.getElementById('exp');if(e)e.onclick=()=>{let md='# دفتر الباحث\n\n';for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k.startsWith('bm:')){const[t,u]=JSON.parse(localStorage.getItem(k));md+='## '+t+'\n('+u+')\n\n'+(localStorage.getItem('note:'+k.slice(3))||'')+'\n\n'}}const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([md],{type:'text/markdown'}));a.download='research-notes.md';a.click()}})();
