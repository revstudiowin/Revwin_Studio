// Portable metadata build using the existing route definitions in build.py.
const fs = require('node:fs');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
process.chdir(__dirname);
const source = fs.readFileSync('build.py', 'utf8');
const origin = source.match(/origin='([^']+)'/)[1];
const definitions = source.split('\n').find(line => line.startsWith('pages='));
const pages = [...definitions.matchAll(/'([^']*)':\('([^']*)','([^']*)'\)/g)];
if (pages.length !== 10) throw new Error('Expected ten route definitions in build.py');
const escape = text => text.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const template = fs.readFileSync('dist/index.html', 'utf8');
for (const [,route,title,description] of pages) {
 const url = origin + '/' + (route ? route + '/' : '');
 let html = template.replace(/<title>.*?<\/title>/, `<title>${escape(title)} | Revwin Studio</title>`)
  .replace(/(<meta name="description" content=")[^"]*/, '$1' + escape(description))
  .replace(/(<link rel="canonical" href=")[^"]*/, '$1' + url)
  .replace(/(<meta property="og:title" content=")[^"]*/, '$1' + escape(title) + ' | Revwin Studio')
  .replace(/(<meta property="og:description" content=")[^"]*/, '$1' + escape(description))
  .replace(/(<meta property="og:url" content=")[^"]*/, '$1' + url)
  .replace(/(<noscript>.*?<h1>).*?(<\/h1><p>).*?(<\/p>)/s, '$1' + escape(title) + '$2' + escape(description) + '$3');
 const directory = path.join('dist',route);
 fs.mkdirSync(directory,{recursive:true});
 fs.writeFileSync(path.join(directory,'index.html'),html);
}
fs.writeFileSync('dist/404.html',template.replace(/<title>.*?<\/title>/,'<title>Page not found | Revwin Studio</title>'));
fs.writeFileSync('dist/sitemap.xml','<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+pages.map(([,route])=>'<url><loc>'+origin+'/'+(route?route+'/':'')+'</loc></url>').join('')+'</urlset>');
for (const script of ['dist/app.js','dist/services-scroll.js']) execFileSync(process.execPath,['--check',script]);
for (const asset of ['style.css','refinements.css','studio-theme.css','app.js','services-scroll.js','assets/revwin-logo.png','assets/revwin-logo-transparent.png']) {
 if (!fs.statSync(path.join('dist',asset)).size) throw new Error('Missing asset: '+asset);
}
console.log('Build passed: ten routes, metadata, sitemap, required assets and JavaScript syntax.');
