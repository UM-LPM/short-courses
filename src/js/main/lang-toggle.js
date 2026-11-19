function setLangCookie(lang) {
  var expires = new Date(Date.now() + 31536e6).toUTCString();
  document.cookie = 'pll_language=' + lang + '; expires=' + expires + '; path=/; SameSite=Lax';
}

var LANG_ATTRS = ['placeholder', 'aria-label', 'alt'];

function updatePlaceholders(lang) {
  LANG_ATTRS.forEach(function (attr) {
    document.querySelectorAll('[data-' + attr + '-sl]').forEach(function (el) {
      var value = 'en' === lang
        ? el.getAttribute('data-' + attr + '-en') || el.getAttribute('data-' + attr + '-sl')
        : el.getAttribute('data-' + attr + '-sl');
      el.setAttribute(attr, value);
    });
  });
  var titleEl = document.querySelector('title[data-title-sl]');
  if (titleEl) {
    document.title = 'en' === lang
      ? titleEl.getAttribute('data-title-en') || titleEl.getAttribute('data-title-sl')
      : titleEl.getAttribute('data-title-sl');
  }
  document.documentElement.setAttribute('lang', lang);
}

function updateLangLinks(lang) {
  document.querySelectorAll('a[data-pass-lang]').forEach(function (link) {
    try {
      var url = new URL(link.href);
      // Always explicit, so the registration app follows the language chosen here
      // instead of a different one it remembers from an earlier visit.
      url.searchParams.set('lang', lang);
      link.href = url.toString();
    } catch (e) {}
  });
}

function toggleLang() {
  var root = document.documentElement;
  var lang = root.classList.contains('lang-en') ? 'sl' : 'en';
  root.classList.remove('lang-sl', 'lang-en');
  root.classList.add('lang-' + lang);
  try { localStorage.setItem('lang', lang); } catch (e) {}
  setLangCookie(lang);
  updatePlaceholders(lang);
  updateLangLinks(lang);
}

// head.html already picked the language (?lang, else the saved one) and set the html class.
var _initLang = document.documentElement.classList.contains('lang-en') ? 'en' : 'sl';
setLangCookie(_initLang);
updatePlaceholders(_initLang);
updateLangLinks(_initLang);
