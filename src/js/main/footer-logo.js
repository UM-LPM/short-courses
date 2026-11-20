(function () {
  var img = document.querySelector('.site-footer__corner .site-footer__logos');
  if (!img) return;

  var WIDE_RATIO = 3;

  function isEmpty(data, i) {
    var a = data[i + 3];
    if (a < 16) return true;
    return data[i] > 245 && data[i + 1] > 245 && data[i + 2] > 245;
  }

  function placeWide() {
    var sponsors = document.querySelector('.site-footer__sponsors');
    var corner = img.parentNode;
    if (!sponsors) return;
    sponsors.appendChild(img);
    sponsors.hidden = false;
    corner.parentNode.removeChild(corner);
  }

  function trim() {
    var probe = new Image();
    probe.crossOrigin = 'anonymous';
    probe.onload = function () {
      var w = probe.naturalWidth, h = probe.naturalHeight;
      if (!w || !h) return;
      var canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      var ctx = canvas.getContext('2d');
      ctx.drawImage(probe, 0, 0);
      var data;
      try {
        data = ctx.getImageData(0, 0, w, h).data;
      } catch (e) {
        return;
      }

      var top = h, left = w, right = -1, bottom = -1;
      for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
          if (!isEmpty(data, (y * w + x) * 4)) {
            if (x < left) left = x;
            if (x > right) right = x;
            if (y < top) top = y;
            if (y > bottom) bottom = y;
          }
        }
      }
      if (right < 0) return;

      var cw = right - left + 1, ch = bottom - top + 1;
      if (cw < w || ch < h) {
        var out = document.createElement('canvas');
        out.width = cw;
        out.height = ch;
        out.getContext('2d').drawImage(canvas, left, top, cw, ch, 0, 0, cw, ch);
        img.src = out.toDataURL('image/png');
      }
      if (cw / ch > WIDE_RATIO) placeWide();
    };
    probe.src = img.currentSrc || img.src;
  }

  if (img.complete) trim();
  else img.addEventListener('load', trim, { once: true });
})();
