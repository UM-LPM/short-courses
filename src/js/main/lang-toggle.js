function setLangCookie(lang) {
  var expires = new Date(Date.now() + 31536e6).toUTCString();
  document.cookie = 'pll_language=' + lang + '; expires=' + expires + '; path=/; SameSite=Lax';
}

function updatePlaceholders(lang) {
  document.querySelectorAll('[data-placeholder-sl]').forEach(function (el) {
    el.placeholder = 'en' === lang
      ? el.getAttribute('data-placeholder-en') || el.getAttribute('data-placeholder-sl')
      : el.getAttribute('data-placeholder-sl');
  });
}

function toggleLang() {
  var root = document.documentElement;
  var lang = root.classList.contains('lang-en') ? 'sl' : 'en';
  root.classList.remove('lang-sl', 'lang-en');
  root.classList.add('lang-' + lang);
  localStorage.setItem('lang', lang);
  setLangCookie(lang);
  updatePlaceholders(lang);
}

var _initLang = localStorage.getItem('lang') || 'sl';
setLangCookie(_initLang);
updatePlaceholders(_initLang);
