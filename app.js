const stage = document.querySelector('#stage');
const result = document.querySelector('#demo-result');
const replay = document.querySelector('#replay-action');
const windowExample = document.querySelector('.browser-window');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let action = null;
let pending = null;
let resetTimer = null;
let revision = 0;
const captions = {
 closeTabs:'Se cierra YouTube. El correo y el documento siguen abiertos.',
 minimize:'La ventana queda minimizada con todas sus pestañas. El video puede seguir sonando.',
 closeWindows:'Se cierra la ventana completa, incluidas las pestañas de correo y documento.'
};
function transitionDuration() {
 if(reducedMotion.matches || action==='closeTabs') return 0;
 const style=getComputedStyle(windowExample);
 const toMs=value=>parseFloat(value)*(value.trim().endsWith('ms')?1:1000);
 const durations=style.transitionDuration.split(',').map(toMs);
 const delays=style.transitionDelay.split(',').map(toMs);
 return Math.max(0,...durations.map((duration,index)=>duration+delays[index%delays.length]));
}
function play(nextAction) {
 action=nextAction;
 const current=++revision;
 clearTimeout(pending);
 clearTimeout(resetTimer);
 delete stage.dataset.done;
 delete stage.dataset.restored;
 document.querySelectorAll('[data-action]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.action===action)));
 replay.disabled=false;
 result.textContent='Ejemplo en curso…';
 pending=setTimeout(()=>{
  if(current!==revision)return;
  stage.dataset.done=action;
  result.textContent=captions[action];
  // Keep the finished result visible for two seconds, then restore only this illustration.
  resetTimer=setTimeout(()=>{
   if(current!==revision)return;
   stage.dataset.restored='true';
   delete stage.dataset.done;
   document.querySelectorAll('[data-action]').forEach(button=>button.setAttribute('aria-pressed','false'));
   result.textContent=captions[action]+' El ejemplo se ha reiniciado.';
  },transitionDuration()+2000);
 },reducedMotion.matches?0:650);
}
document.querySelectorAll('[data-action]').forEach(button=>button.addEventListener('click',()=>play(button.dataset.action)));
replay.addEventListener('click',()=>{if(action)play(action);});
window.addEventListener('pagehide',()=>{clearTimeout(pending);clearTimeout(resetTimer);});