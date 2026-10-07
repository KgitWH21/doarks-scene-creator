(() => {
 const button=document.getElementById('installApp');
 const status=document.getElementById('offlineState');
 let installPrompt;
 window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;button.hidden=false});
 button.addEventListener('click',async()=>{if(!installPrompt)return;await installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;button.hidden=true});
 window.addEventListener('appinstalled',()=>{button.hidden=true;installPrompt=null});
 if(!('serviceWorker' in navigator)||!['https:','http:'].includes(location.protocol)){
  status.textContent='Offline installation needs HTTPS or localhost. See README.md.';return;
 }
 navigator.serviceWorker.register('./sw.js').then(async()=>{
  await navigator.serviceWorker.ready;
  status.textContent='Ready offline';
 }).catch(()=>{status.textContent='Offline setup failed. Reconnect and reload to try again.'});
})();
