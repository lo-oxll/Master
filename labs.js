const lab=document.getElementById('lab');if(lab){
const id=lab.dataset.lab,$=s=>lab.querySelector(s),R=Math.random;
const tbl=(rows)=>!rows.length?'<p class="meta">لا نتائج</p>':'<div style="overflow-x:auto"><table><tr>'+Object.keys(rows[0]).map(k=>'<th>'+k+'</th>').join('')+'</tr>'+rows.map(r=>'<tr>'+Object.values(r).map(v=>'<td>'+v+'</td>').join('')+'</tr>').join('')+'</table></div>';
function hist(cv,data,bins=30){const c=cv.getContext('2d'),w=cv.width,h=cv.height;c.clearRect(0,0,w,h);
const mn=Math.min(...data),mx=Math.max(...data),b=Array(bins).fill(0);data.forEach(v=>b[Math.min(bins-1,Math.floor((v-mn)/(mx-mn||1)*bins))]++);
const m=Math.max(...b);c.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--c').trim()||'#2d5bff';b.forEach((n,i)=>c.fillRect(i*w/bins+1,h-n/m*(h-4),w/bins-2,n/m*(h-4)))}
const L={
'db-concepts-7':()=>{const D={emp:[{id:1,name:'سارة',dept:'IT',salary:900},{id:2,name:'علي',dept:'HR',salary:700},{id:3,name:'نور',dept:'IT',salary:1100},{id:4,name:'عمر',dept:'Sales',salary:800},{id:5,name:'ليلى',dept:'HR',salary:950}],dept:[{dept:'IT',floor:3},{dept:'HR',floor:1},{dept:'Sales',floor:2}]};
lab.innerHTML=`<p>جدولان: <b>emp</b>(id,name,dept,salary) و <b>dept</b>(dept,floor). اكتب استعلام SELECT ... FROM ... WHERE ... ORDER BY.</p><input id="s" value="SELECT name, salary FROM emp WHERE salary > 800 ORDER BY salary DESC"><button id="go">تشغيل</button><div id="o"></div>`;
$('#go').onclick=()=>{const m=$('#s').value.match(/^\s*select\s+(.+?)\s+from\s+(\w+)(?:\s+where\s+(\w+)\s*(>=|<=|!=|=|>|<)\s*'?([^'\s;]+)'?)?(?:\s+order\s+by\s+(\w+)(?:\s+(asc|desc))?)?\s*;?\s*$/i);
if(!m||!D[m[2]])return $('#o').innerHTML='<p class="err">استعلام غير مفهوم أو جدول غير موجود</p>';
let r=D[m[2]].slice();if(m[3]){const v=isNaN(m[5])?m[5]:+m[5];r=r.filter(x=>({'=':x[m[3]]==v,'>':x[m[3]]>v,'<':x[m[3]]<v,'>=':x[m[3]]>=v,'<=':x[m[3]]<=v,'!=':x[m[3]]!=v})[m[4]])}
if(m[6])r.sort((a,b)=>(a[m[6]]>b[m[6]]?1:-1)*(/desc/i.test(m[7])?-1:1));
if(m[1].trim()!='*'){const c=m[1].split(',').map(s=>s.trim());r=r.map(x=>Object.fromEntries(c.map(k=>[k,x[k]])))}$('#o').innerHTML=tbl(r)};$('#go').click()},
'db-concepts-4':()=>{lab.innerHTML=`<p>تحويل مبلغ من حساب A إلى B. جرّب الانهيار في المنتصف مع وبدون معاملة (Atomicity).</p>مبلغ: <input id="a" type="number" value="200" style="width:90px"> <label><input type="checkbox" id="c"> انهيار بعد الخصم</label> <label><input type="checkbox" id="t" checked> استخدام معاملة (BEGIN/ROLLBACK)</label><button id="go">نفّذ</button><button id="rs">إعادة</button><pre id="o"></pre>`;let A=1000,B=500;
const show=l=>$('#o').textContent=l.join('\n')+`\n\nA=${A}  B=${B}  المجموع=${A+B} ${A+B==1500?'✅ متسق':'❌ فقدان بيانات!'}`;
$('#go').onclick=()=>{const x=+$('#a').value,l=[],t=$('#t').checked,a0=A;if(t)l.push('BEGIN');A-=x;l.push('UPDATE A: -'+x);
if($('#c').checked){l.push('💥 انهيار!');if(t){A=a0;l.push('ROLLBACK ← تراجع تلقائي')}else l.push('لا معاملة: بقي الخصم بلا إضافة')}else{B+=x;l.push('UPDATE B: +'+x);if(t)l.push('COMMIT')}show(l)};$('#rs').onclick=()=>{A=1000;B=500;show([])};show([])},
'fundamentals-db':()=>{lab.innerHTML=`<p>حساب إغلاق السمات (Attribute Closure) لمعرفة المفاتيح المرشحة.</p>السمات: <input id="u" value="A,B,C,D,E"><br>الاعتماديات (X->Y مفصولة بفاصلة منقوطة):<input id="f" value="A->B; B->C; CD->E"><br>إغلاق: <input id="x" value="A,D"><button id="go">احسب</button><div id="o"></div>`;
$('#go').onclick=()=>{const p=s=>s.replace(/[\s,]/g,'').split(''),U=p($('#u').value),F=$('#f').value.split(';').map(s=>s.split('->').map(p)).filter(f=>f.length==2),c=new Set(p($('#x').value)),st=[];let ch=true;
while(ch){ch=false;for(const[l,r]of F)if(l.every(a=>c.has(a))&&r.some(a=>!c.has(a))){r.forEach(a=>c.add(a));st.push(l.join('')+'→'+r.join(''));ch=true}}
$('#o').innerHTML=`<p>الإغلاق: <b>{${[...c]}}</b></p><p>خطوات: ${st.join(' ، ')||'—'}</p><p>${U.every(a=>c.has(a))?'✅ مفتاح فائق (Superkey)':'❌ ليس مفتاحاً'}</p>`};$('#go').click()},
'advanced-dbms':()=>{lab.innerHTML=`<p>الالتزام ثنائي الطور (2PC): المنسّق يسأل المشاركين ثم يقرّر.</p><label><input type=checkbox id=n1 checked> العقدة 1 توافق</label> <label><input type=checkbox id=n2 checked> العقدة 2 توافق</label> <label><input type=checkbox id=n3 checked> العقدة 3 توافق</label><br><button id="go">شغّل</button><pre id="o"></pre>`;
$('#go').onclick=()=>{const v=[1,2,3].map(i=>$('#n'+i).checked),l=['المرحلة 1 (Prepare): المنسّق → الكل'];v.forEach((y,i)=>l.push(`  العقدة ${i+1}: ${y?'VOTE-COMMIT ✅':'VOTE-ABORT ❌'}`));const ok=v.every(Boolean);l.push('المرحلة 2: القرار = '+(ok?'GLOBAL-COMMIT':'GLOBAL-ABORT'));l.push('الكل ينفّذ '+(ok?'الالتزام':'التراجع'));$('#o').textContent=l.join('\n')};$('#go').click()},
'image-processing':()=>{lab.innerHTML=`<canvas id="cv" width="240" height="240" style="max-width:100%;border:1px solid var(--bd)"></canvas> <canvas id="hs" width="240" height="120" style="max-width:100%"></canvas><br><button data-f="gray">رمادي</button><button data-f="inv">عكس</button><button data-f="blur">تمويه</button><button data-f="edge">حواف (Sobel)</button><button data-f="th">عتبة</button> <input id="t" type="range" min="0" max="255" value="128"><button id="rs">إعادة</button> <input type="file" id="fl" accept="image/*">`;
const cv=$('#cv'),c=cv.getContext('2d');function init(){const g=c.createLinearGradient(0,0,240,240);g.addColorStop(0,'#223');g.addColorStop(1,'#eee');c.fillStyle=g;c.fillRect(0,0,240,240);c.fillStyle='#e33';c.beginPath();c.arc(100,100,60,0,7);c.fill();c.fillStyle='#39f';c.fillRect(120,130,90,70);dh()}
function gy(d,i){return .3*d[i]+.59*d[i+1]+.11*d[i+2]}
function dh(){const d=c.getImageData(0,0,240,240).data,b=Array(256).fill(0);for(let i=0;i<d.length;i+=4)b[gy(d,i)|0]++;const h=$('#hs').getContext('2d'),m=Math.max(...b);h.clearRect(0,0,240,120);h.fillStyle='#888';b.forEach((n,i)=>h.fillRect(i*240/256,120-n/m*115,1,n/m*115))}
lab.querySelectorAll('[data-f]').forEach(bt=>bt.onclick=()=>{const im=c.getImageData(0,0,240,240),d=im.data,o=new Uint8ClampedArray(d),f=bt.dataset.f,W=240;
for(let y=1;y<239;y++)for(let x=1;x<239;x++){const i=(y*W+x)*4;if(f=='gray'){const v=gy(d,i);o[i]=o[i+1]=o[i+2]=v}else if(f=='inv'){for(let k=0;k<3;k++)o[i+k]=255-d[i+k]}else if(f=='th'){o[i]=o[i+1]=o[i+2]=gy(d,i)>$('#t').value?255:0}
else if(f=='blur'){for(let k=0;k<3;k++){let s=0;for(let a=-1;a<2;a++)for(let b=-1;b<2;b++)s+=d[i+(a*W+b)*4+k];o[i+k]=s/9}}
else{const p=(a,b)=>gy(d,i+(a*W+b)*4),gx=-p(-1,-1)-2*p(0,-1)-p(1,-1)+p(-1,1)+2*p(0,1)+p(1,1),gv=-p(-1,-1)-2*p(-1,0)-p(-1,1)+p(1,-1)+2*p(1,0)+p(1,1);o[i]=o[i+1]=o[i+2]=Math.min(255,Math.hypot(gx,gv))}}
im.data.set(o);c.putImageData(im,0,0);dh()});
$('#rs').onclick=init;$('#fl').onchange=e=>{const im=new Image();im.onload=()=>{c.drawImage(im,0,0,240,240);dh()};im.src=URL.createObjectURL(e.target.files[0])};init()},
'cpp-oop':()=>{lab.innerHTML=`<p>أنشئ كائنات من أصناف مشتقة وخزّنها في <code>Shape*</code>، ثم استدعِ <code>area()</code> افتراضياً.</p><select id="k"><option>Circle</option><option>Rect</option><option>Triangle</option></select> أ: <input id="a" type="number" value="3" style="width:70px"> ب: <input id="b" type="number" value="4" style="width:70px"><button id="ad">أضف</button><button id="rs">مسح</button><pre id="o"></pre>`;let S=[];
const ar={Circle:(a)=>Math.PI*a*a,Rect:(a,b)=>a*b,Triangle:(a,b)=>a*b/2};
const draw=()=>{$('#o').textContent='class Shape { public: virtual double area()=0; };\nclass Circle:public Shape{...}  class Rect:public Shape{...}\n\nfor(Shape* s : v)\n  cout << s->area();   // ربط ديناميكي\n\n'+S.map((s,i)=>`v[${i}] = new ${s[0]}(${s[1]},${s[2]}) → ${ar[s[0]](s[1],s[2]).toFixed(2)}`).join('\n')+(S.length?'\nالمجموع = '+S.reduce((t,s)=>t+ar[s[0]](s[1],s[2]),0).toFixed(2):'')};
$('#ad').onclick=()=>{S.push([$('#k').value,+$('#a').value,+$('#b').value]);draw()};$('#rs').onclick=()=>{S=[];draw()};draw()},
'vbnet':()=>{lab.innerHTML=`<p>محاكاة نموذج Windows Forms: تفاعل مع العناصر وشاهد معالجات الأحداث.</p><div style="border:1px solid var(--bd);padding:14px;border-radius:10px"><input id="tb" placeholder="TextBox1"> <button id="bt">Button1</button> <label><input type="checkbox" id="ck"> CheckBox1</label></div><pre id="o" style="max-height:200px;overflow:auto"></pre>`;
const lg=(s)=>{$('#o').textContent=s+'\n'+$('#o').textContent},tb=$('#tb');
$('#bt').onclick=()=>{lg(`Private Sub Button1_Click(...) Handles Button1.Click\n    MessageBox.Show("مرحباً " & TextBox1.Text)\nEnd Sub`);alert('مرحباً '+tb.value)};
tb.oninput=()=>lg('Private Sub TextBox1_TextChanged(...) Handles TextBox1.TextChanged  → "'+tb.value+'"');
$('#ck').onchange=e=>lg('Private Sub CheckBox1_CheckedChanged(...)  → Checked = '+(e.target.checked?'True':'False'));
$('#bt').onmouseenter=()=>lg('Button1_MouseEnter')},
'statistics':()=>{lab.innerHTML=`<p>مبرهنة النهاية المركزية: توزيع متوسطات عينات حجم n يقترب من الطبيعي.</p><select id="d"><option value="u">منتظم</option><option value="e">أسّي</option><option value="b">ثنائي (p=0.1)</option></select> n: <input id="n" type="range" min="1" max="100" value="1"> <b id="nv">1</b><br><canvas id="cv" width="480" height="180" style="max-width:100%"></canvas><p id="o"></p>`;
const g={u:()=>R(),e:()=>-Math.log(1-R()),b:()=>R()<.1?1:0};
const run=()=>{const n=+$('#n').value,f=g[$('#d').value],m=[];$('#nv').textContent=n;for(let i=0;i<3000;i++){let s=0;for(let j=0;j<n;j++)s+=f();m.push(s/n)}
const mu=m.reduce((a,b)=>a+b)/m.length,v=m.reduce((a,b)=>a+(b-mu)**2,0)/m.length;hist($('#cv'),m);$('#o').textContent=`متوسط المتوسطات = ${mu.toFixed(3)} ، التباين = ${v.toFixed(4)} (يتناقص تقريباً بمقدار 1/n)`};
$('#n').oninput=run;$('#d').onchange=run;run()},
'dist':()=>{lab.innerHTML=`<select id="t"><option value="b">ذات الحدين (n,p)</option><option value="p">بواسون (λ)</option><option value="n">طبيعي (μ=0,σ)</option></select> <label>معامل 1 <input id="a" type="range" min="1" max="60" value="20"></label> <label>معامل 2 <input id="b" type="range" min="1" max="99" value="30"></label><canvas id="cv" width="480" height="180" style="max-width:100%"></canvas><p id="o"></p>`;
const lf=n=>{let s=0;for(let i=2;i<=n;i++)s+=Math.log(i);return s};
const go=()=>{const t=$('#t').value,a=+$('#a').value,b=$('#b').value/100,P=[],X=[];let mu,v;
if(t=='b'){for(let k=0;k<=a;k++){P.push(Math.exp(lf(a)-lf(k)-lf(a-k)+k*Math.log(b)+(a-k)*Math.log(1-b)));X.push(k)}mu=a*b;v=a*b*(1-b)}
else if(t=='p'){const l=a/2;for(let k=0;k<=l*3+10;k++){P.push(Math.exp(-l+k*Math.log(l)-lf(k)));X.push(k)}mu=v=l}
else{const s=a/10;for(let i=0;i<61;i++){const x=-4*s+i*8*s/60;P.push(Math.exp(-x*x/2/s/s));X.push(x)}mu=0;v=s*s}
const c=$('#cv').getContext('2d'),m=Math.max(...P),w=480/P.length;c.clearRect(0,0,480,180);c.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--c').trim()||'#2d5bff';P.forEach((p,i)=>c.fillRect(i*w+1,175-p/m*165,w-2,p/m*165));
$('#o').textContent='المتوسط = '+mu.toFixed(2)+'  ،  التباين = '+v.toFixed(2)};['t','a','b'].forEach(i=>$('#'+i).oninput=go);go()},
'ci':()=>{lab.innerHTML=`<p>100 عينة من N(50,10): كم فترة ثقة تحتوي المتوسط الحقيقي 50؟</p>n: <input id="n" type="range" min="5" max="100" value="25"> مستوى: <select id="z"><option value="1.645">90%</option><option value="1.96" selected>95%</option><option value="2.576">99%</option></select><button id="go">أعد التوليد</button><canvas id="cv" width="480" height="260" style="max-width:100%"></canvas><p id="o"></p>`;
const nr=()=>Math.sqrt(-2*Math.log(1-R()))*Math.cos(6.2832*R());
const go=()=>{const n=+$('#n').value,z=+$('#z').value,c=$('#cv').getContext('2d');c.clearRect(0,0,480,260);let hit=0;const sc=x=>(x-40)*24;
c.strokeStyle='#888';c.beginPath();c.moveTo(sc(50),0);c.lineTo(sc(50),260);c.stroke();
for(let i=0;i<100;i++){let s=0;for(let j=0;j<n;j++)s+=50+10*nr();const m=s/n,h=z*10/Math.sqrt(n),ok=Math.abs(m-50)<h;hit+=ok;c.strokeStyle=ok?'#2a9d4a':'#d33';c.beginPath();c.moveTo(sc(m-h),i*2.6+2);c.lineTo(sc(m+h),i*2.6+2);c.stroke()}
$('#o').textContent='غطّت '+hit+' من 100 فترة المتوسط الحقيقي (الأحمر = أخطأ)'};$('#go').onclick=go;$('#n').oninput=go;$('#z').onchange=go;go()},
'mle':()=>{lab.innerHTML=`<p>تجربة برنولي: k نجاحاً من n محاولة. حرّك p لترى دالة الإمكان.</p>n: <input id="n" type="number" value="20" style="width:70px"> k: <input id="k" type="number" value="7" style="width:70px"> p: <input id="p" type="range" min="1" max="99" value="50"><canvas id="cv" width="480" height="180" style="max-width:100%"></canvas><p id="o"></p>`;
const go=()=>{const n=+$('#n').value,k=+$('#k').value,p0=$('#p').value/100,c=$('#cv').getContext('2d'),f=p=>k*Math.log(p)+(n-k)*Math.log(1-p),pts=[];for(let i=1;i<100;i++)pts.push(f(i/100));const mx=Math.max(...pts),mn=Math.min(...pts.filter(isFinite),mx-30);
c.clearRect(0,0,480,180);c.strokeStyle='#2d5bff';c.beginPath();pts.forEach((v,i)=>{const y=175-(Math.max(v,mn)-mn)/(mx-mn)*165;i?c.lineTo(i*4.8,y):c.moveTo(0,y)});c.stroke();c.strokeStyle='#d33';c.beginPath();c.moveTo(p0*480,0);c.lineTo(p0*480,180);c.stroke();
$('#o').textContent='logL('+p0+') = '+f(p0).toFixed(2)+'  ،  المقدّر الأعظم p̂ = k/n = '+(k/n).toFixed(3)};['n','k','p'].forEach(i=>$('#'+i).oninput=go);go()},
'corr':()=>{lab.innerHTML=`<p>بيانات ثنائية المتغير: غيّر معامل الارتباط ρ وشاهد خط الانحدار.</p>ρ: <input id="r" type="range" min="-99" max="99" value="70"> <button id="go">عينة جديدة</button><canvas id="cv" width="320" height="320" style="max-width:100%;border:1px solid var(--bd)"></canvas><p id="o"></p>`;
const nr=()=>Math.sqrt(-2*Math.log(1-R()))*Math.cos(6.2832*R());
const go=()=>{const r=$('#r').value/100,P=[],c=$('#cv').getContext('2d');for(let i=0;i<150;i++){const a=nr(),b=nr();P.push([a,r*a+Math.sqrt(1-r*r)*b])}
const mx=P.reduce((s,p)=>s+p[0],0)/150,my=P.reduce((s,p)=>s+p[1],0)/150;let sxy=0,sxx=0,syy=0;P.forEach(p=>{sxy+=(p[0]-mx)*(p[1]-my);sxx+=(p[0]-mx)**2;syy+=(p[1]-my)**2});const sl=sxy/sxx,ic=my-sl*mx;
c.clearRect(0,0,320,320);c.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--c').trim()||'#2d5bff';P.forEach(p=>{c.beginPath();c.arc(160+p[0]*50,160-p[1]*50,3,0,7);c.fill()});c.strokeStyle='#d33';c.beginPath();c.moveTo(0,160-(ic+sl*-3.2)*50);c.lineTo(320,160-(ic+sl*3.2)*50);c.stroke();
$('#o').textContent='r العيّنة = '+(sxy/Math.sqrt(sxx*syy)).toFixed(3)+'  ،  y = '+ic.toFixed(2)+' + '+sl.toFixed(2)+'x'};$('#r').oninput=go;$('#go').onclick=go;go()},
'inh':()=>{lab.innerHTML=`<p>ترتيب استدعاء البواني والهوادم في سلسلة الوراثة A ← B ← C.</p><label><input type="checkbox" id="v" checked> هادم افتراضي (virtual ~A / Overrides)</label> <button id="go">أنشئ C* عبر مؤشر A* ثم احذف</button><pre id="o"></pre>`;
$('#go').onclick=()=>{const v=$('#v').checked;$('#o').textContent='A* p = new C();   // VB: Dim p As A = New C()\n\nA()\nB()\nC()\n\ndelete p;\n'+(v?'~C()\n~B()\n~A()\n✅ تحرير كامل':'~A()\n❌ لم يُستدعَ ~C و ~B: تسرّب موارد (سلوك غير معرّف)')};$('#go').click()},
'ptr':()=>{lab.innerHTML=`<p>مصفوفة int a[8] ومؤشر p. جرّب p++ و *p = v.</p><button id="a">p++</button><button id="b">p--</button> *p = <input id="v" type="number" value="9" style="width:70px"><button id="w">اكتب</button><div id="o"></div>`;const a=[3,1,4,1,5,9,2,6];let p=0;
const dr=()=>{$('#o').innerHTML='<table><tr><th>العنوان</th>'+a.map((_,i)=>'<td>0x'+(4096+4*i).toString(16)+'</td>').join('')+'</tr><tr><th>القيمة</th>'+a.map((x,i)=>'<td'+(i==p?' style="background:var(--ac);color:#fff"':'')+'>'+x+'</td>').join('')+'</tr></table><p>p = 0x'+(4096+4*p).toString(16)+'  ،  *p = '+a[p]+'  ،  p - a = '+p+'</p>'};
$('#a').onclick=()=>{p=Math.min(7,p+1);dr()};$('#b').onclick=()=>{p=Math.max(0,p-1);dr()};$('#w').onclick=()=>{a[p]=+$('#v').value;dr()};dr()},
'quant':()=>{lab.innerHTML=`<p>أخذ العينات (الدقة المكانية) والتكميم (عدد مستويات الرمادي).</p>دقة: <input id="s" type="range" min="0" max="4" value="0"> بتات: <input id="q" type="range" min="1" max="8" value="8"><br><canvas id="cv" width="256" height="256" style="max-width:100%"></canvas><p id="o"></p>`;
const N=128,g=new Float32Array(N*N);for(let y=0;y<N;y++)for(let x=0;x<N;x++){let v=x*1.5+y*.5;if((x-60)**2+(y-60)**2<1600)v=230-x;g[y*N+x]=Math.min(255,v)}
const go=()=>{const s=1<<$('#s').value,q=+$('#q').value,L=1<<q,c=$('#cv'),x=c.getContext('2d'),im=x.createImageData(256,256);
for(let y=0;y<256;y++)for(let X=0;X<256;X++){const by=Math.floor(y/2/s)*s,bx=Math.floor(X/2/s)*s;let t=0;for(let j=0;j<s;j++)for(let i=0;i<s;i++)t+=g[Math.min(N-1,by+j)*N+Math.min(N-1,bx+i)];t/=s*s;const v=Math.floor(t/256*L)*255/(L-1),k=(y*256+X)*4;im.data[k]=im.data[k+1]=im.data[k+2]=v;im.data[k+3]=255}
x.putImageData(im,0,0);$('#o').textContent='الدقة '+N/s+'×'+N/s+' ، '+L+' مستوى ، الحجم التقريبي '+(N/s*N/s*q/8|0)+' بايت'};$('#s').oninput=go;$('#q').oninput=go;go()},
'kern':()=>{lab.innerHTML=`<p>الالتفاف (Convolution) بنواة 3×3 على صورة اختبار.</p><select id="p"><option value="0,0,0,0,1,0,0,0,0">هوية</option><option value="1,1,1,1,1,1,1,1,1">تمويه</option><option value="0,-1,0,-1,5,-1,0,-1,0">حدّة</option><option value="-1,-1,-1,-1,8,-1,-1,-1,-1">حواف</option><option value="-2,-1,0,-1,1,1,0,1,2">نقش</option></select> <input id="k" style="width:220px"> <button id="go">طبّق</button><br><canvas id="cv" width="128" height="128" style="width:256px;image-rendering:pixelated"></canvas>`;
const N=128,g=new Float32Array(N*N);for(let y=0;y<N;y++)for(let x=0;x<N;x++){let v=x+y*.5;if((x-60)**2+(y-60)**2<1600)v=230-x;if(x>90&&y>80)v=30;g[y*N+x]=Math.min(255,v)}
$('#p').onchange=()=>{$('#k').value=$('#p').value;go()};
const go=()=>{const K=$('#k').value.split(',').map(Number),sum=K.reduce((a,b)=>a+b)||1,c=$('#cv').getContext('2d'),im=c.createImageData(N,N);
for(let y=0;y<N;y++)for(let x=0;x<N;x++){let t=0;for(let j=-1;j<2;j++)for(let i=-1;i<2;i++)t+=K[(j+1)*3+i+1]*g[Math.min(N-1,Math.max(0,y+j))*N+Math.min(N-1,Math.max(0,x+i))];t=sum==1||sum==9?t/(sum==9?9:1):t+(sum==0?128:0);const k=(y*N+x)*4;im.data[k]=im.data[k+1]=im.data[k+2]=Math.max(0,Math.min(255,t));im.data[k+3]=255}c.putImageData(im,0,0)};$('#go').onclick=go;$('#p').onchange()}
};
L[id]&&L[id]()}
