const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const routes=['/','/services/','/work/','/about/','/process/','/contact/','/work/evergreen/','/work/relay/','/privacy/','/terms/'];
const pages=new Map();
for(const route of routes){
 const app={innerHTML:''},control={addEventListener(){},getAttribute(){return 'false'},classList:{contains(){return false}}};
 const context={location:{pathname:route,search:''},document:{getElementById(id){return id==='app'?app:null},querySelector(selector){return selector==='.menu'||selector==='nav'?control:null},querySelectorAll(){return []},addEventListener(){}},matchMedia(){return {matches:true,addEventListener(){}}},window:{},URLSearchParams,Date};
 vm.runInNewContext(fs.readFileSync('dist/app.js','utf8'),context);
 assert.equal((app.innerHTML.match(/<h1[ >]/g)||[]).length,1,route+' must have one primary heading');
 pages.set(route,app.innerHTML);
}
let count=0;
for(const [route,html]of pages){
 for(const [,src]of html.matchAll(/<img[^>]+src="([^"]+)"/g)){
  if(src.startsWith('/'))assert.ok(fs.existsSync('dist'+src),route+' has missing image '+src);
 }
 for(const [,href]of html.matchAll(/href="([^"]+)"/g)){
  if(!href.startsWith('/')&&!href.startsWith('#'))continue;
  const url=new URL(href,'https://local.test'+route),target=pages.get(url.pathname);
  assert.ok(target,route+' has unknown route '+href);
  if(url.hash)assert.ok(target.includes('id="'+url.hash.slice(1)+'"'),route+' has missing anchor '+href);
  count++;
 }
}
const math=fs.readFileSync('dist/services-scroll.js','utf8').split('(()=>')[0]+'\nthis.math=ServiceScrollMath;';
const context={};vm.runInNewContext(math,context);
for(let i=0;i<=1000;i++){
 const state=context.math.state(i/1000);
 assert.ok(state.active>=0&&state.active<=4);
 for(let card=0;card<5;card++){
  const pose=context.math.pose(card,state,500);
  assert.ok(Number.isFinite(pose.y)&&pose.y>=0&&pose.y<=532);
 }
}
assert.equal(context.math.state(0).active,0);assert.equal(context.math.state(1).active,4);
console.log(`Verified ${pages.size} rendered routes, ${count} internal links/anchors, and 1,001 service motion positions.`);
