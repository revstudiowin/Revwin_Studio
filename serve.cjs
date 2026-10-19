const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, 'dist');
const mime = {'.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg'};
http.createServer((req, res) => {
  let file;
  try { file = path.resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname)); }
  catch { res.writeHead(400).end(); return; }
  if (!file.startsWith(root + path.sep) && file !== root) { res.writeHead(403).end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  const exists = fs.existsSync(file);
  res.writeHead(exists ? 200 : 404, {'Content-Type': mime[path.extname(file)] || 'application/octet-stream'});
  fs.createReadStream(exists ? file : path.join(root, '404.html')).pipe(res);
}).listen(8080, '127.0.0.1', () => console.log('Revwin Studio: http://localhost:8080'));
