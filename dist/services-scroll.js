/* One native scroll listener coordinates the whole service presentation. */
const ServiceScrollMath={
 clamp:(v,min=0,max=1)=>Math.min(max,Math.max(min,v)),
 state(progress){const u=this.clamp(progress)*5,base=Math.min(4,Math.floor(u));const t=base===4?0:this.clamp((u-base-.68)/.32),eased=t*t*(3-2*t);return{base,t:eased,active:Math.min(4,base+(eased>=.5?1:0))}},
 pose(index,state,height=570){const {base,t}=state;if(index<=base)return{opacity:1,y:0,scale:1,rotate:0,reveal:1};if(index===base+1)return{opacity:1,y:(height+32)*(1-t),scale:1,rotate:0,reveal:1};return{opacity:0,y:height+32,scale:1,rotate:0,reveal:0}}
};
(()=>{
 const root=document.querySelector('.services-story');if(!root)return;
 const track=root.querySelector('.story-track'),pin=root.querySelector('.story-pin'),deck=root.querySelector('.story-deck'),sidebar=root.querySelector('.story-sidebar');
 const cards=[...root.querySelectorAll('.story-card')],links=cards.map(c=>c.querySelector('a'));
 const buttons=[...root.querySelectorAll('[data-story-go]')],bar=root.querySelector('.story-progress'),count=root.querySelector('#story-count');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let pinned=false,raf=0,active=-1,start=0,distance=1,disposed=false;
 function setActive(index,progress){if(active!==index){active=index;count.textContent=String(index+1).padStart(2,'0');buttons.forEach((b,i)=>{if(i===index)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current')})}bar.setAttribute('aria-valuenow',String(Math.round(progress*100)));bar.setAttribute('aria-valuetext',`${index+1} of 5 services`);bar.firstElementChild.style.transform=`scaleX(${progress})`}
 function update(){raf=0;if(disposed)return;if(pinned){const progress=ServiceScrollMath.clamp((window.scrollY-start)/distance),state=ServiceScrollMath.state(progress);setActive(state.active,progress);cards.forEach((card,i)=>{const pose=ServiceScrollMath.pose(i,state,deck.offsetHeight);card.style.opacity=String(pose.opacity);card.style.transform=`translateY(${pose.y.toFixed(2)}px) scale(${pose.scale.toFixed(4)}) rotateX(${pose.rotate.toFixed(2)}deg)`;card.style.zIndex=String(i+1);card.style.pointerEvents=i===state.active?'auto':'none';card.style.setProperty('--visual-progress',pose.reveal.toFixed(3));links[i].tabIndex=i===state.active?0:-1})}else{let selected=0;const line=window.innerHeight*.46;cards.forEach((c,i)=>{if(c.getBoundingClientRect().top<=line)selected=i});setActive(selected,selected/4)}}
 function request(){if(!raf&&!document.hidden)raf=requestAnimationFrame(update)}
 function measure(){
  // Keep the desktop composition pinned; measure content to size its card stage.
  root.classList.remove('story-enhanced');cards.forEach(c=>{c.style.opacity='';c.style.transform='';c.style.zIndex='';c.style.pointerEvents='';c.style.removeProperty('--visual-progress')});links.forEach(a=>a.tabIndex=0);
  const wide=window.innerWidth>=1024&&window.innerHeight>=640,tablet=window.innerWidth>=640&&window.innerWidth<1024&&window.innerHeight>=820;
  pinned=!reduced.matches&&(wide||tablet);
  if(pinned){root.classList.add('story-enhanced');let height=Math.max(...cards.map(c=>Math.ceil(c.querySelector('.story-card-copy').getBoundingClientRect().height+c.querySelector('.story-visual').getBoundingClientRect().height+2)));root.style.setProperty('--story-card-height',height+'px');const stageSpace=window.innerHeight-(wide?124:112);const needed=wide?Math.max(height,sidebar.getBoundingClientRect().height)+30:height+sidebar.getBoundingClientRect().height+50;if(needed>stageSpace){pinned=false;root.classList.remove('story-enhanced')}}
  if(pinned){const stickyTop=parseFloat(getComputedStyle(pin).top)||108;start=track.getBoundingClientRect().top+window.scrollY-stickyTop;distance=Math.max(1,track.offsetHeight-pin.offsetHeight)}
  update();
 }
 function jump(index){if(pinned){const progress=(index+.28)/5;window.scrollTo({top:start+distance*progress,behavior:reduced.matches?'instant':'smooth'})}else cards[index].scrollIntoView({block:'start',behavior:reduced.matches?'instant':'smooth'})}
 buttons.forEach((b,i)=>b.addEventListener('click',()=>jump(i)));
 // Focus must never land on a transparent card when tabbing through the stage.
 deck.addEventListener('focusin',e=>{const card=e.target.closest('.story-card');if(card&&pinned){const i=cards.indexOf(card);if(i!==active)jump(i)}});
 window.addEventListener('scroll',request,{passive:true});let resizeFrame=0;const resize=()=>{cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(measure)};window.addEventListener('resize',resize,{passive:true});reduced.addEventListener('change',measure);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)request()});
 if(document.fonts?.ready)document.fonts.ready.then(()=>{if(!disposed)measure()});
 window.addEventListener('pagehide',()=>{disposed=true;cancelAnimationFrame(raf);cancelAnimationFrame(resizeFrame);window.removeEventListener('scroll',request);window.removeEventListener('resize',resize);reduced.removeEventListener('change',measure)},{once:true});
 measure();
})();
