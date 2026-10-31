/* مرجع الدراسات العليا — سلوك الواجهة المشترك */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const ls = (() => { try { localStorage.setItem('_t', 1); localStorage.removeItem('_t'); return localStorage; } catch (e) { const m = {}; return { getItem: k => m[k] ?? null, setItem: (k, v) => { m[k] = String(v) }, removeItem: k => { delete m[k] }, key: i => Object.keys(m)[i], get length() { return Object.keys(m).length } }; } })();
  const rd = k => { try { return JSON.parse(ls.getItem(k)); } catch (e) { return null; } };
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const page = location.pathname.split('/').pop() || 'index.html';
  const body = document.body, root = document.documentElement;
  const keys = p => { const o = []; for (let i = 0; i < ls.length; i++) { const k = ls.key(i); if (k && k.startsWith(p)) o.push(k); } return o; };
  const toast = msg => { const t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = msg; body.append(t); setTimeout(() => t.remove(), 2100); };

  /* ---- الوضع الداكن ---- */
  const th = $('#theme');
  const meta = document.querySelector('meta[name=theme-color]') || Object.assign(document.createElement('meta'), { name: 'theme-color' });
  document.head.append(meta);
  const applyTheme = d => { root.dataset.theme = d; meta.content = d === 'dark' ? '#151c27' : '#ffffff'; th && th.setAttribute('aria-pressed', d === 'dark'); };
  th && (th.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 0 0 18z" fill="currentColor"/></svg>');
  const mnb = $('#menu'); mnb && (mnb.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>');
  applyTheme(root.dataset.theme || 'light');
  th && th.addEventListener('click', () => { const d = root.dataset.theme === 'dark' ? 'light' : 'dark'; applyTheme(d); ls.setItem('theme', d); });

  /* ---- القائمة الجانبية (جوال) ---- */
  const mn = $('#menu'), side = $('#side');
  let bd = $('.backdrop');
  if (side && !bd) { bd = document.createElement('div'); bd.className = 'backdrop'; side.after(bd); }
  const nav = open => { body.classList.toggle('nav', open); mn && mn.setAttribute('aria-expanded', open); };
  mn && mn.addEventListener('click', () => nav(!body.classList.contains('nav')));
  bd && bd.addEventListener('click', () => nav(false));
  $$('#side a').forEach(a => a.addEventListener('click', () => nav(false)));
  const cur = $('#side [aria-current]'); cur && side && side.scrollTo({ top: Math.max(0, cur.offsetTop - 120) });


  /* ---- روابط ناقصة في القائمة الجانبية (صفحات لم تُحدَّث) ---- */
  if (side) {
    if (!$('a[href="s-itm.html"]', side)) { const a = $('a[href="s-img.html"]', side); a && a.insertAdjacentHTML('afterend', '<a class="sl subj" style="--sc:var(--c-itm)" href="s-itm.html">🧭 إدارة تقنيات المعلومات</a>'); }
    if (!$('a[href="notebook.html"]', side)) { const a = $('a[href="tools.html"]', side); a && a.insertAdjacentHTML('beforebegin', '<a class="sl" href="notebook.html">استوديو المذاكرة</a>'); }
    side.insertAdjacentHTML('beforeend', '<div class="side-foot"><button type="button" id="bk-open">نسخة احتياطية للتقدم</button></div>');
  }

  /* ---- نسخة احتياطية: تصدير واستيراد JSON ---- */
  const BK = /^(prog:|note:|bm:|sg:|sr:|last$|theme$)/;
  $('#bk-open') && $('#bk-open').addEventListener('click', () => {
    let dg = $('#bk-dlg');
    if (!dg) {
      dg = document.createElement('dialog'); dg.id = 'bk-dlg';
      dg.innerHTML = '<h2>نسخة احتياطية</h2><p class="meta">تُحفظ بياناتك على هذا المتصفح فقط وتضيع إذا مُسح. صدّر ملفاً واحتفظ به، واستورده على أي جهاز.</p><div class="row2"><button class="btn" id="bk-ex" type="button">تصدير JSON</button><label class="btn ghost" style="cursor:pointer">استيراد<input id="bk-im" type="file" accept="application/json" hidden></label><button class="btn ghost" id="bk-x" type="button">إغلاق</button></div><p class="meta" id="bk-m"></p>';
      body.append(dg);
      $('#bk-x').onclick = () => dg.close();
      $('#bk-ex').onclick = () => { const o = {}; for (let i = 0; i < ls.length; i++) { const k = ls.key(i); if (k && BK.test(k)) o[k] = ls.getItem(k); } const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify({ v: 1, at: new Date().toISOString(), data: o }, null, 1)], { type: 'application/json' })); a.download = 'مرجع-نسخة-' + new Date().toISOString().slice(0, 10) + '.json'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); $('#bk-m').textContent = 'صُدّر ' + Object.keys(o).length + ' عنصراً.'; };
      $('#bk-im').onchange = async e => { try { const j = JSON.parse(await e.target.files[0].text()); let n = 0; Object.entries(j.data || {}).forEach(([k, v]) => { if (BK.test(k) && typeof v === 'string') { ls.setItem(k, v); n++; } }); $('#bk-m').textContent = 'استُورد ' + n + ' عنصراً. أعد تحميل الصفحة.'; setTimeout(() => location.reload(), 900); } catch (err) { $('#bk-m').textContent = 'ملف غير صالح.'; } };
    }
    dg.showModal();
  });

  /* ---- التطبيق دون اتصال (PWA) ---- */
  if (!$('link[rel=manifest]')) document.head.insertAdjacentHTML('beforeend', '<link rel="manifest" href="manifest.webmanifest"><link rel="apple-touch-icon" href="icon-192.png">');
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));

  /* ---- اختصارات لوحة المفاتيح ---- */
  const topQ = $('.top input[type=search]');
  if (topQ && !topQ.nextElementSibling) topQ.insertAdjacentHTML('afterend', '<kbd aria-hidden="true">/</kbd>');
  addEventListener('keydown', e => {
    if (e.key === 'Escape') { nav(false); return; }
    const t = e.target, typing = t.matches && t.matches('input,textarea,select,[contenteditable]');
    if (e.key === '/' && !typing && !e.ctrlKey && !e.metaKey && !e.altKey) { e.preventDefault(); (($('#q') || topQ) || {}).focus?.(); }
  });

  /* ---- شريط تقدّم القراءة + زر الأعلى ---- */
  const topbar = $('.top');
  let bar = $('#prog');
  if (topbar && !bar) { bar = document.createElement('div'); bar.id = 'prog'; bar.setAttribute('aria-hidden', 'true'); topbar.append(bar); }
  const up = document.createElement('button');
  up.id = 'toTop'; up.className = 'ib'; up.type = 'button'; up.setAttribute('aria-label', 'العودة إلى أعلى الصفحة'); up.textContent = '↑'; body.append(up);
  up.addEventListener('click', () => scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'auto' : 'smooth' }));
  let tick = false;
  const onScroll = () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => {
      const h = root.scrollHeight - innerHeight;
      bar && (bar.style.width = (h > 0 ? scrollY / h * 100 : 0) + '%');
      up.classList.toggle('on', scrollY > 700); tick = false;
    });
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---- تصفية القوائم ---- */
  const norm = s => String(s).toLowerCase().replace(/[\u064B-\u065F\u0670\u0640]/g, '').replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه');
  const q = $('#q');
  if (q && !$('#res')) { // صفحة البحث الشامل لها معالج خاص بها
    const items = $$('.row,.term,details.ref');
    let em = $('#emptyMsg');
    const f = () => {
      const v = norm(q.value.trim()); let n = 0;
      items.forEach(e => { const ok = norm(e.textContent).includes(v); e.hidden = !ok; ok && n++; });
      if (!em) { em = document.createElement('p'); em.id = 'emptyMsg'; em.className = 'empty'; em.hidden = true; em.textContent = 'لا نتائج مطابقة. جرّب كلمة أقصر أو اكتب المصطلح بالإنجليزية.'; (items[0] ? items[0].closest('.rows') || items[0].parentNode : q.parentNode).after(em); }
      em.hidden = n > 0 || !items.length;
    };
    q.addEventListener('input', f);
  }
  const lo = $('#labsOnly');
  lo && lo.addEventListener('click', () => { const on = lo.getAttribute('aria-pressed') !== 'true'; lo.setAttribute('aria-pressed', on); $('.rows').classList.toggle('labs-only', on); });

  /* ---- تقدّم الموضوع ---- */
  const d = $('#topics');
  if (d) {
    const k = 'prog:' + d.dataset.id, s = rd(k) || [], n = $$('input', d);
    const upd = () => {
      const c = n.filter(x => x.checked).length;
      const b = $('#bar i'); b && (b.style.width = c / n.length * 100 + '%');
      const t = $('#cnt'); t && (t.textContent = c + ' من ' + n.length);
      ls.setItem(k, JSON.stringify(n.map(x => x.checked)));
    };
    n.forEach((x, i) => { x.checked = !!s[i]; x.addEventListener('change', upd); });
    upd();
    ls.setItem('last', JSON.stringify([document.title.split(' — ')[0], page]));
  }

  /* ---- شرح المحاور (content.js) ---- */
  const pid = $('#notes') && $('#notes').dataset.id;
  if (d && window.EXPL && pid && window.EXPL[pid]) {
    $$('label', d).forEach((lb, i) => {
      const t = window.EXPL[pid][i]; if (!t) return;
      const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'ex-b'; btn.textContent = 'اشرح'; btn.setAttribute('aria-expanded', 'false');
      const p = document.createElement('p'); p.className = 'ex'; p.hidden = true; p.textContent = t;
      btn.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); const o = p.hidden; p.hidden = !o; btn.setAttribute('aria-expanded', o); btn.textContent = o ? 'إخفاء' : 'اشرح'; });
      lb.append(btn); lb.after(p);
    });
    const all = document.createElement('button'); all.type = 'button'; all.className = 'chip'; all.textContent = 'اعرض كل الشروح';
    all.addEventListener('click', () => $$('.ex-b', d).forEach(b => b.getAttribute('aria-expanded') !== 'true' && b.click()));
    d.before(all);
  }
  $$('.pg[data-id]').forEach(e => {
    const a = rd('prog:' + e.dataset.id);
    if (a && a.some(Boolean)) { e.textContent = a.filter(Boolean).length + '/' + a.length; if (a.every(Boolean)) e.closest('.row')?.classList.add('done'); }
  });
  $$('.spine').forEach(e => {
    let c = 0; const total = +e.dataset.n || 0;
    for (let i = 0; i < total; i++) { const a = rd('prog:' + e.dataset.k + i); if (a && a.length && a.every(Boolean)) c++; }
    const i = $('i', e); i && (i.style.width = (total ? c / total * 100 : 0) + '%');
    const cnt = $('.cnt', e); cnt && c && (cnt.textContent += ' — أنجزت ' + c);
  });
  const ct = $('#cont'), l = rd('last');
  if (ct && Array.isArray(l)) ct.innerHTML = '<a href="' + esc(l[1]) + '">تابع من حيث توقفت: ' + esc(l[0]) + '</a>';

  /* ---- الملاحظات والإشارات المرجعية ---- */
  const nt = $('#notes');
  if (nt) { const k = 'note:' + nt.dataset.id; nt.value = ls.getItem(k) || ''; nt.addEventListener('input', () => ls.setItem(k, nt.value)); }
  const b = $('.bm');
  if (b) {
    const k = 'bm:' + b.dataset.id;
    const sh = () => { const on = !!ls.getItem(k); b.setAttribute('aria-pressed', on); b.textContent = on ? '★ محفوظ في دفتري' : '☆ احفظ في دفتري'; };
    sh();
    b.addEventListener('click', () => { if (ls.getItem(k)) { ls.removeItem(k); toast('أُزيل من دفتري'); } else { ls.setItem(k, JSON.stringify([b.dataset.t, page])); toast('حُفظ في دفتري'); } sh(); });
  }
  const m = $('#mylist');
  if (m) {
    const render = () => {
      const h = keys('bm:').map(k => { const v = rd(k); if (!Array.isArray(v)) return ''; const nn = ls.getItem('note:' + k.slice(3)) || ''; return '<div class="term"><a href="' + esc(v[1]) + '"><b>' + esc(v[0]) + '</b></a>' + (nn ? '<p>' + esc(nn) + '</p>' : '') + '<button class="bm" data-rm="' + esc(k) + '" type="button">إزالة</button></div>'; }).join('');
      m.innerHTML = h || '<p class="empty">لم تحفظ أي موضوع بعد. افتح موضوعاً واضغط «احفظ في دفتري».</p>';
    };
    m.addEventListener('click', e => { const r = e.target.closest('[data-rm]'); if (r) { ls.removeItem(r.dataset.rm); render(); toast('أُزيل من دفتري'); } });
    render();
  }
  const ex = $('#exp');
  ex && ex.addEventListener('click', () => {
    let md = '# دفتر الباحث\n\n';
    keys('bm:').forEach(k => { const v = rd(k); if (Array.isArray(v)) md += '## ' + v[0] + '\n(' + v[1] + ')\n\n' + (ls.getItem('note:' + k.slice(3)) || '') + '\n\n'; });
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([md], { type: 'text/markdown' })); a.download = 'research-notes.md'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });

  /* ---- نسخ النص: <button data-copy="#selector"> ---- */
  document.addEventListener('click', async e => {
    const c = e.target.closest('[data-copy]'); if (!c) return;
    const el = $(c.dataset.copy); if (!el) return;
    try { await navigator.clipboard.writeText(el.innerText.trim()); toast('تم النسخ'); } catch (err) { const r = document.createRange(); r.selectNodeContents(el); const s = getSelection(); s.removeAllRanges(); s.addRange(r); toast('حدّد النص وانسخه يدوياً'); }
  });
})();
