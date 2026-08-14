/* Manifest-driven navigation, shared by every page of the site.
   Each page fetches manifest.json at load and rebuilds its own Latest link
   and Archive dropdown from it, so publishing a new brief updates every
   existing page without editing any of them. */
(function(){
  var header = document.querySelector('.site-header');
  if(!header) return;
  var root = header.getAttribute('data-root') || '';
  var menu = document.getElementById('archiveMenu');
  var toggle = document.getElementById('archiveToggle');
  var latest = document.getElementById('navLatest');
  var current = document.body.getAttribute('data-brief') || '';
  var latestCard = document.getElementById('latestCard');
  var archiveList = document.getElementById('archiveList');

  function formatDate(iso){
    var months = ['January','February','March','April','May','June','July',
                  'August','September','October','November','December'];
    var p = iso.split('-');
    if(p.length !== 3) return iso;
    return parseInt(p[2],10) + ' ' + months[parseInt(p[1],10)-1] + ' ' + p[0];
  }
  function esc(s){
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;')
                    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
  function renderHeader(briefs){
    if(latest) latest.href = root + briefs[0].url;
    var html = briefs.slice(0,8).map(function(b){
      var cls = 'dropdown-item' + (b.date === current ? ' current' : '');
      return '<a class="'+cls+'" href="'+esc(root+b.url)+'">'+formatDate(b.date)+'</a>';
    }).join('');
    html += '<div class="dropdown-sep"></div><a class="dropdown-item dropdown-all" href="'
          + esc(root+'index.html') + '">View all briefs</a>';
    if(menu) menu.innerHTML = html;
  }
  function renderIndex(briefs){
    if(!latestCard || !archiveList) return;
    var top = briefs[0];
    latestCard.href = root + top.url;
    latestCard.innerHTML =
      '<span class="latest-label">Latest &middot; ' + formatDate(top.date) + '</span>' +
      '<p class="latest-teaser">' + esc(top.teaser) + '</p>' +
      '<span class="latest-cta">Read the brief &rarr;</span>';
    var rest = briefs.slice(1);
    if(!rest.length){
      archiveList.innerHTML = '<p class="archive-empty">No earlier briefs yet.</p>';
      return;
    }
    archiveList.innerHTML = rest.map(function(b){
      return '<a class="archive-item" href="'+esc(root+b.url)+'">'
           + '<span class="archive-date">'+formatDate(b.date)+'</span>'
           + '<span class="archive-teaser">'+esc(b.teaser)+'</span></a>';
    }).join('');
  }
  if(window.fetch){
    fetch(root + 'manifest.json', {cache:'no-cache'})
      .then(function(r){ return r.ok ? r.json() : null; })
      .then(function(d){
        if(d && d.briefs && d.briefs.length){ renderHeader(d.briefs); renderIndex(d.briefs); }
      })
      .catch(function(){ /* keep the baked-in fallback */ });
  }
  function closeMenu(){
    if(!menu) return;
    menu.classList.remove('open');
    if(toggle) toggle.setAttribute('aria-expanded','false');
  }
  if(toggle && menu){
    toggle.addEventListener('click', function(e){
      e.stopPropagation();
      var open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', function(e){
      if(!menu.contains(e.target) && e.target !== toggle) closeMenu();
    });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape') closeMenu();
    });
  }
})();
