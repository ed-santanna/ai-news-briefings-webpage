/* Behaviour specific to a brief page: the two tabs, the category filter,
   and rendering each story's publication date from its data-published
   attribute. */
function showTab(name){
    document.querySelectorAll('.tab-panel').forEach(function(p){p.classList.remove('active');});
    document.querySelectorAll('.tab-btn').forEach(function(b){b.classList.remove('active');});
    document.getElementById('tab-'+name).classList.add('active');
    document.querySelector('.tab-btn[data-tab="'+name+'"]').classList.add('active');
  }
  var activeFilter = 'all';
  function setFilter(cat){
    activeFilter = cat;
    document.querySelectorAll('.filter-chip').forEach(function(c){
      c.classList.toggle('active', c.dataset.cat === cat);
    });
    applyFilters();
  }
  function filterStories(){ applyFilters(); }
  function applyFilters(){
    var q = document.getElementById('storySearch').value.trim().toLowerCase();
    var forceOpen = (q !== '') || (activeFilter !== 'all');
    var anyVisible = false;
    document.querySelectorAll('.category').forEach(function(cat){
      var catMatches = activeFilter === 'all' || cat.dataset.cat === activeFilter;
      var visible = 0;
      cat.querySelectorAll('.story').forEach(function(story){
        var show = catMatches && (q === '' || story.textContent.toLowerCase().indexOf(q) !== -1);
        story.style.display = show ? '' : 'none';
        if(show) visible++;
      });
      cat.style.display = visible ? '' : 'none';
      if(visible){ anyVisible = true; if(forceOpen) cat.open = true; }
    });
    document.getElementById('noResults').style.display = anyVisible ? 'none' : 'block';
  }
  // Show each story's publication date in its meta line. The source of truth
  // is data-published, the same attribute check_site.py validates, so there is
  // no second copy of the date to fall out of step. Stories without a valid
  // one simply show no date, which is what older briefs do.
  (function(){
    var months = ['Jan','Feb','Mar','Apr','May','Jun',
                  'Jul','Aug','Sep','Oct','Nov','Dec'];
    document.querySelectorAll('.story[data-published]').forEach(function(story){
      var parts = (story.getAttribute('data-published') || '').split('-');
      if(parts.length !== 3) return;
      var month = parseInt(parts[1], 10), day = parseInt(parts[2], 10);
      if(!(month >= 1 && month <= 12) || !(day >= 1 && day <= 31)) return;
      var source = story.querySelector('.meta .source');
      if(!source) return;
      var sep = document.createElement('span');
      sep.textContent = '\u00B7';
      var date = document.createElement('span');
      date.className = 'story-date';
      date.textContent = day + ' ' + months[month - 1];
      source.insertAdjacentElement('afterend', sep);
      sep.insertAdjacentElement('afterend', date);
    });
  })();

  function goToCategory(cat){
    showTab('briefing');
    document.getElementById('storySearch').value = '';
    setFilter(cat);
    var el = document.querySelector('.category[data-cat="'+cat+'"]');
    if(el){ el.open = true; el.scrollIntoView({behavior:'smooth', block:'start'}); }
  }
