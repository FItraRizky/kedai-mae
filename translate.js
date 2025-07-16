window.TRANSLATIONS = window.TRANSLATIONS || {};

// Fallback translation function
function t(key, lang = 'id') {
  if (window.TRANSLATIONS && window.TRANSLATIONS[lang] && window.TRANSLATIONS[lang][key]) {
    return window.TRANSLATIONS[lang][key];
  }
  // Fallback ke Indonesia jika key tidak ada di bahasa lain
  if (window.TRANSLATIONS && window.TRANSLATIONS['id'] && window.TRANSLATIONS['id'][key]) {
    return window.TRANSLATIONS['id'][key];
  }
  // Fallback ke key itu sendiri jika tidak ditemukan
  return key;
}

// Fungsi applyTranslation yang lebih aman
function applyTranslation(lang) {
  document.querySelectorAll('[data-translate]').forEach(function(el) {
    var key = el.getAttribute('data-translate');
    el.textContent = t(key, lang);
  });
  document.querySelectorAll('[data-translate-placeholder]').forEach(function(el) {
    var key = el.getAttribute('data-translate-placeholder');
    el.setAttribute('placeholder', t(key, lang));
  });
}

// Event listener untuk selector bahasa
document.addEventListener('DOMContentLoaded', function() {
  const langSwitcher = document.getElementById('lang-switcher');
  let lang = localStorage.getItem('lang') || 'id';
  langSwitcher.value = lang;
  applyTranslation(lang);
  langSwitcher.addEventListener('change', function() {
    lang = this.value;
    localStorage.setItem('lang', lang);
    applyTranslation(lang);
  });
});
