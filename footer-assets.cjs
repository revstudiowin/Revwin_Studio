const fs=require('node:fs');
const svg=(content,bg)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 820"><rect width="640" height="820" fill="${bg}"/>${content}</svg>`;
let terrain='';
for(let n=-50;n<180;n++){
 let d='';for(let x=-20;x<=680;x+=5){let y=n*7+90*Math.sin(x*.009+n*.035)+35*Math.sin(x*.024-n*.06)+22*Math.cos(x*.041+n*.04);d+=`${x===-20?'M':'L'}${x},${y.toFixed(2)} `;}
 terrain+=`<path d="${d}" fill="none" stroke="#46453e" stroke-opacity="${n%3===0?.38:.19}" stroke-width=".65"/>`;
}
fs.writeFileSync('dist/assets/footer-terrain.svg',svg(terrain,'#eeeadd'));
let particles='';let seed=42;const random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
for(let n=0;n<9000;n++){let x=random()*740-50,z=random(),y=550+100*Math.sin(x*.012+z*4)+110*Math.cos(x*.006-z*5)+z*180;particles+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(random()*1.3+.2).toFixed(1)}" fill="${n%157===0?'#f97316':'#c9cbca'}" opacity="${(random()*.4).toFixed(2)}"/>`;}
fs.writeFileSync('dist/assets/footer-field.svg',svg(particles,'#050505'));
let lens='<defs><radialGradient id="g"><stop stop-color="#060606"/><stop offset=".38" stop-color="#434343"/><stop offset=".43" stop-color="#000"/><stop offset=".67" stop-color="#777"/><stop offset=".7" stop-color="#111"/><stop offset="1" stop-color="#000"/></radialGradient></defs><circle cx="320" cy="360" r="260" fill="url(#g)"/>';
for(let n=0;n<80;n++){const r=70+n*2.6;lens+=`<ellipse cx="320" cy="360" rx="${r}" ry="${r*1.03}" fill="none" stroke="${n%3===0?'#eee':'#777'}" stroke-opacity="${.15+random()*.55}" stroke-width="${random()*1.4}" transform="rotate(${n*3} 320 360)"/>`;}
lens+='<path d="M446 170Q508 190 493 289L466 265Q473 215 439 200Z" fill="white" opacity=".9"/>';
fs.writeFileSync('dist/assets/footer-lens.svg',svg(lens,'#000'));
