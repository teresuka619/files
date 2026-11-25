/* Gonzalo Duarte Rivillas – script.js (vanilla, sin dependencias) */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  document.documentElement.classList.add('js');

  /* ---------- Menú móvil ---------- */
  var burger = $('.burger'), menu = $('#menu');
  burger.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });
  menu.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { menu.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { menu.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
  });

  /* ---------- Aparición suave al hacer scroll ---------- */
  var items = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    items.forEach(function (el) { io.observe(el); });
  } else { items.forEach(function (el) { el.classList.add('in'); }); }

  $('#year').textContent = new Date().getFullYear();

  /* ---------- Validación y envío del formulario ---------- */
  var form = $('#form'), estado = $('#estado');
  var RE_TEL = /^(?:\+34|0034)?[\s.-]?[6789](?:[\s.-]?\d){8}$/;
  var RE_MAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function setErr(id, msg) {
    var f = $('#' + id), e = $('#e-' + id);
    e.textContent = msg || '';
    if (msg) f.setAttribute('aria-invalid', 'true'); else f.removeAttribute('aria-invalid');
    return !msg;
  }
  function validate() {
    var nombre = $('#nombre').value.trim(), tel = $('#telefono').value.trim(), mail = $('#email').value.trim();
    var ok = [];
    ok.push(setErr('nombre', nombre.length < 2 ? 'Escribe tu nombre.' : ''));
    ok.push(setErr('telefono', tel && !RE_TEL.test(tel) ? 'Teléfono no válido. Ejemplo: 612 345 678.' : (!tel && !mail ? 'Indica un teléfono o un email.' : '')));
    ok.push(setErr('email', mail && !RE_MAIL.test(mail) ? 'Email no válido. Ejemplo: nombre@correo.es.' : (!tel && !mail ? 'Indica un teléfono o un email.' : '')));
    ok.push(setErr('rgpd', $('#rgpd').checked ? '' : 'Debes aceptar la política de privacidad para enviar el formulario.'));
    var bad = ok.indexOf(false);
    if (bad > -1) { var inv = form.querySelector('[aria-invalid="true"]'); if (inv) inv.focus(); }
    return bad === -1;
  }

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    estado.className = 'estado'; estado.textContent = '';
    if (!validate()) return;
    if (form.action.indexOf('TU_ID_FORMSPREE') > -1) {
      estado.className = 'estado ko';
      estado.textContent = 'Formulario sin configurar: sustituye TU_ID_FORMSPREE en index.html.';
      return;
    }
    var btn = form.querySelector('button[type=submit]'); btn.disabled = true;
    fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
      .then(function (r) {
        if (!r.ok) throw new Error();
        form.reset(); estado.className = 'estado ok';
        estado.textContent = 'Gracias. He recibido tu solicitud y te contactaré lo antes posible.';
      })
      .catch(function () {
        estado.className = 'estado ko';
        estado.textContent = 'No se ha podido enviar. Escríbeme por WhatsApp o llama al 675 93 47 45.';
      })
      .finally(function () { btn.disabled = false; });
  });
  ['nombre', 'telefono', 'email'].forEach(function (id) {
    $('#' + id).addEventListener('input', function () { if (this.getAttribute('aria-invalid')) validate(); });
  });

  /* ---------- Banner de cookies ---------- */
  var banner = $('#cookies-banner'), KEY = 'cookie-consent';
  function loadOptionalScripts() {
    /* PERSONALIZAR: si algún día añades analítica, cárgala SOLO aquí (tras aceptar). Ejemplo:
       var s = document.createElement('script'); s.src = 'https://...'; s.async = true; document.head.appendChild(s); */
  }
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  if (saved === 'si') loadOptionalScripts(); else if (!saved) banner.hidden = false;
  banner.addEventListener('click', function (e) {
    var v = e.target.getAttribute('data-c');
    if (!v) return;
    try { localStorage.setItem(KEY, v); } catch (err) {}
    banner.hidden = true;
    if (v === 'si') loadOptionalScripts();
  });
})();
