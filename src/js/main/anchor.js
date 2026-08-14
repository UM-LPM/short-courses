(function () {
  var headings = document.querySelectorAll('.course-content h1[id],.course-content h2[id],.course-content h3[id],.course-content h4[id],.course-content h5[id],.course-content h6[id]');
  for (var i = 0; i < headings.length; i++) {
    var img = document.createElement('img');
    img.setAttribute('src', '/assets/img/link-symbol.svg');
    img.setAttribute('alt', '');

    var a = document.createElement('a');
    a.setAttribute('href', '#' + headings[i].getAttribute('id'));
    a.setAttribute('aria-hidden', 'true');
    a.setAttribute('tabindex', '-1');
    a.classList.add('anchor');
    a.appendChild(img);

    headings[i].insertBefore(a, headings[i].firstChild);
  }
})();
