(function(){
"use strict";
var D=window.DATA,$=function(i){return document.getElementById(i);};
var REPORTE="https://github.com/TU_USUARIO/TU_REPO/issues/new"; // <- cambia por tu repositorio
var vista="temas",abierto=-1;
function n(t){return String(t||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");}
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
function url(u){return /^https?:\/\//i.test(u||"")?u:"";}
function guardar(k,v){try{localStorage.setItem(k,v);}catch(e){}}
function leer(k){try{return localStorage.getItem(k);}catch(e){return null;}}
function expandir(q){
  var r=n(q);
  D.sinonimos.forEach(function(p){if(r.indexOf(p[0])!==-1){r=r.split(p[0]).join(" "+p[1]+" ");}});
  return r;
}
function coincide(base,t){return base.indexOf(t)!==-1||(t.length>=6&&base.indexOf(t.slice(0,5))!==-1);}
function puntuar(base,nombre,toks){
  var s=0,ok=0;
  toks.forEach(function(t){
    if(n(nombre).indexOf(t)!==-1){s+=3;ok++;}
    else if(coincide(base,t)){s+=1;ok++;}
  });
  return ok>0?s*10+ok*5+(ok===toks.length?20:0):0;
}
var PARO=" que con por para una uno los las del mis sus muy mas pero como cuando donde quiero quiere puedo puede hacer tengo tiene sobre esta este esto desde hasta sin ser son hay fue era ellos ellas ante entre sacar dijo dice pasa paso ayuda ";
function tokens(q){return expandir(q).split(/\s+/).filter(function(t){return t.length>=3&&PARO.indexOf(" "+t+" ")===-1;});}
function filtrar(lista,q,campo){
  var toks=tokens(q);
  if(!toks.length){return lista.map(function(x,i){return {x:x,i:i};});}
  return lista.map(function(x,i){return {x:x,i:i,s:puntuar(n(x.nombre+" "+(x.palabras||"")+" "+(x[campo]||"")),x.nombre,toks)};})
    .filter(function(r){return r.s>0;}).sort(function(a,b){return b.s-a.s;});
}
function enlaces(x){
  var h="",w=url(x.web),p=url(x.pdf);
  if(w){h+='<a class="b" href="'+esc(w)+'" target="_blank" rel="noopener noreferrer">Ver en sitio oficial</a>';}
  if(p){h+='<a class="b" href="'+esc(p)+'" target="_blank" rel="noopener noreferrer">PDF</a>';}
  return h;
}
function badge(t){
  return t.revisado?'<span class="badge ok">✔ Verificado: '+esc(t.revisado)+'</span>':'<span class="badge pend">Por verificar</span>';
}
function tema(t,i,abre){
  var h='<article class="card"><button class="t" data-t="'+i+'" aria-expanded="'+abre+'">'+esc(t.nombre)+'</button>'+badge(t);
  if(!abre){return h+"</article>";}
  h+='<h3>Qué es</h3><p>'+esc(t.queEs)+'</p><h3>Qué conlleva</h3><p>'+esc(t.queConlleva)+'</p>';
  if(t.pasos&&t.pasos.length){h+='<h3>Qué hacer primero</h3><ol>'+t.pasos.map(function(p){return "<li>"+esc(p)+"</li>";}).join("")+"</ol>";}
  if(t.plazo){h+='<p class="nota"><b>Plazo:</b> '+esc(t.plazo)+'</p>';}
  if(t.telefonos){h+='<p class="nota"><b>Teléfonos:</b> '+esc(t.telefonos)+'</p>';}
  h+='<h3>Dónde lo dice la ley</h3><p>'+esc(t.ley)+'</p><p class="nota"><b>Importante:</b> '+esc(t.importante)+'</p>';
  h+='<div class="acc">'+enlaces(t)+'<button data-leer="'+i+'">🔊 Escuchar</button><button data-copiar="'+i+'">📋 Copiar</button></div>';
  return h+"</article>";
}
function directorio(q){
  var toks=tokens(q),h="",hay=false;
  D.directorio.forEach(function(g){
    var items=g.items.filter(function(it){return !toks.length||puntuar(n(it.n+" "+(it.q||"")+" "+g.grupo),it.n,toks)>0;});
    if(!items.length){return;}
    hay=true;h+="<h2>"+esc(g.grupo)+"</h2>";
    items.forEach(function(it){
      h+='<article class="card"><h2>'+esc(it.n)+'</h2><p>'+esc(it.q||"")+'</p>';
      if(it.t&&it.t.length){h+='<div class="acc">'+it.t.map(function(t){return '<a class="b" href="tel:'+esc(String(t[1]).replace(/[^0-9+]/g,""))+'">📞 '+esc(t[0])+'</a>';}).join("")+'</div>';}
      if(url(it.w)){h+='<div class="acc"><a class="b" href="'+esc(it.w)+'" target="_blank" rel="noopener noreferrer">Sitio oficial</a></div>';}
      h+="</article>";
    });
  });
  return hay?h:"<p>No encontré teléfonos para eso.</p>";
}
function dibujar(){
  var q=$("q").value,h="";
  $("aviso").textContent=vista==="temas"?"Toca un tema para ver los pasos.":"";
  if(vista==="temas"){
    var r=filtrar(D.temas,q,"queEs");
    h=r.length?r.map(function(o){return tema(o.x,o.i,o.i===abierto);}).join(""):"<p>No encontré ese caso. Prueba con otras palabras, por ejemplo: despido, robo, renta, multa.</p>";
  }else if(vista==="leyes"){
    var l=filtrar(D.leyes,q,"resumen");
    h=l.length?l.map(function(o){return '<article class="card"><h2>'+esc(o.x.nombre)+'</h2><p>'+esc(o.x.resumen)+'</p><div class="acc">'+enlaces(o.x)+'</div></article>';}).join(""):"<p>No encontré esa ley.</p>";
  }else{h=directorio(q);}
  $("lista").innerHTML=h;
}
function texto(t){return t.nombre+". Qué es: "+t.queEs+" Qué conlleva: "+t.queConlleva+(t.pasos?" Qué hacer: "+t.pasos.join(" "):"")+(t.plazo?" Plazo: "+t.plazo:"");}
$("lista").addEventListener("click",function(e){
  var b=e.target.closest("button");if(!b){return;}
  if(b.dataset.t!==undefined){var i=+b.dataset.t;abierto=abierto===i?-1:i;dibujar();var el=document.querySelector('[data-t="'+i+'"]');if(el&&abierto===i){el.scrollIntoView({block:"start"});}}
  else if(b.dataset.leer!==undefined&&window.speechSynthesis){speechSynthesis.cancel();var u=new SpeechSynthesisUtterance(texto(D.temas[+b.dataset.leer]));u.lang="es-MX";speechSynthesis.speak(u);}
  else if(b.dataset.copiar!==undefined){var tx=texto(D.temas[+b.dataset.copiar]);if(navigator.clipboard){navigator.clipboard.writeText(tx);b.textContent="✔ Copiado";}}
});
document.querySelectorAll("nav button").forEach(function(b){b.addEventListener("click",function(){
  vista=b.dataset.v;abierto=-1;document.querySelectorAll("nav button").forEach(function(x){x.classList.toggle("on",x===b);});dibujar();});});
$("q").addEventListener("input",function(){abierto=-1;dibujar();});
var fs=+(leer("fs")||18);
function tam(d){fs=Math.max(14,Math.min(28,fs+d));document.documentElement.style.setProperty("--fs",fs+"px");guardar("fs",fs);}
$("mas").addEventListener("click",function(){tam(2);});$("menos").addEventListener("click",function(){tam(-2);});tam(0);
$("reporte").href=REPORTE;
if("serviceWorker" in navigator){window.addEventListener("load",function(){navigator.serviceWorker.register("sw.js").catch(function(){});});}
dibujar();
})();
