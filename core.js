// AEUN Core — shared profile, launcher recents, cross-tool handoff (same-origin only)
(function(){
  'use strict';
  var CORE_KEY = 'aeun.core.v1', RECENTS_KEY = 'aeun.launcher.recents.v1', HANDOFF_KEY = 'aeun.handoff.memo.v1';
  function read(k, fb){ try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch(e){ return fb; } }
  function write(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch(e){ return false; } }
  window.AEUNCore = {
    getProfile: function(){ return read(CORE_KEY, {}); },
    setProfile: function(patch){
      var p = read(CORE_KEY, {});
      for (var k in patch){ if (patch[k]) p[k] = patch[k]; }
      write(CORE_KEY, p); return p;
    },
    setHandoff: function(data){ data.ts = Date.now(); return write(HANDOFF_KEY, data); },
    takeHandoff: function(){
      var d = read(HANDOFF_KEY, null);
      try { localStorage.removeItem(HANDOFF_KEY); } catch(e){}
      if (!d || !d.ts || (Date.now() - d.ts) > 2*60*60*1000) return null;
      return d;
    }
  };
  // record this tool visit for the launcher's recents row
  try {
    var slug = location.pathname.split('/').pop().replace('.html','');
    if (slug && slug !== 'index' && slug.indexOf('aeun-') === 0){
      var r = read(RECENTS_KEY, []);
      r = r.filter(function(s){ return s !== slug; });
      r.unshift(slug);
      write(RECENTS_KEY, r.slice(0,4));
    }
  } catch(e){}
})();
