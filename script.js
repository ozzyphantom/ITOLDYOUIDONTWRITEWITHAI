/* ITOLDYOUIDONTWRITEWITHAI — all the behavior. No dependencies. */
(function () {
  'use strict';

  var DISAPPOINTING = 'https://www.merriam-webster.com/dictionary/disappointing';
  var PROMO = 'ENTERMYHOMEATANUNSPECIFIEDTIMEIGIVEYOUFULLPERMISSIONANDWILLNOTCONTACTMYLAWYEROROTHERLEGALAUTHORITIESBECAUSEIDEFINITELYWANTPEOPLETOKNOWTHATIDONTWRITEWITHAI';
  var SEEN_KEY = 'idwwa-toast-seen';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(id) { return document.getElementById(id); }

  /* animation waits collapse to zero under reduced motion; reading time does not */
  function anim(ms) { return reduceMotion ? 0 : ms; }

  /* the substack iframes carry data-src so nothing loads until it is shown */
  function loadFrame(frame) {
    if (frame && !frame.getAttribute('src')) frame.src = frame.getAttribute('data-src');
  }

  function openModal(dialog) {
    if (!dialog || dialog.open) return;
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  }

  /* ---------- the fake permission toast (first visit only) ---------- */

  var toast = $('toast');
  var card = $('toast-card');
  var secret = $('toast-secret');
  var frown = $('toast-frown');

  var seen = false;
  try { seen = localStorage.getItem(SEEN_KEY) === '1'; } catch (e) { /* storage blocked: show it */ }

  if (toast && !seen) {
    try { localStorage.setItem(SEEN_KEY, '1'); } catch (e) { /* fine */ }

    setTimeout(function () {
      toast.hidden = false;
      void toast.offsetWidth; /* force a layout so the slide-in transitions */
      toast.classList.add('is-in');
    }, anim(700));

    $('toast-allow').addEventListener('click', function () {
      secret.hidden = false;            /* sits behind the card */
      card.classList.add('is-popped');  /* the card pops away */
      setTimeout(function () {
        card.hidden = true;
        setTimeout(function () {
          secret.classList.add('is-fading');
          setTimeout(function () { toast.remove(); }, anim(1000));
        }, 2500);
      }, anim(200));
    });

    $('toast-deny').addEventListener('click', function () {
      frown.hidden = false;             /* sits behind the card, stays for good */
      card.classList.add('is-fading');  /* the card fades slowly */
      setTimeout(function () { card.hidden = true; }, anim(2500));
    });
  }

  /* ---------- the form ---------- */

  var form = $('cta');
  var promo = $('promo');
  var confirmBox = $('confirm');
  var embed = $('embed');
  var promoScreen = $('promo-screen');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var code = (promo.value || '').replace(/\s+/g, '').toUpperCase();
      if (code === PROMO) {
        loadFrame($('promo-frame'));
        openModal(promoScreen);
        return;
      }
      openModal(confirmBox);
    });

    $('confirm-yes').addEventListener('click', function () {
      confirmBox.close();
      loadFrame($('embed-frame'));
      form.hidden = true;
      embed.hidden = false;
      embed.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
    });

    $('confirm-no').addEventListener('click', function () {
      confirmBox.close();
      window.open(DISAPPOINTING, '_blank', 'noopener');
    });

    $('promo-close').addEventListener('click', function () {
      promoScreen.close();
    });
  }
})();
