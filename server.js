const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3456;
const ROOT = path.join(__dirname, 'out');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
  let url = decodeURIComponent(req.url);
  let filePath = path.join(ROOT, url === '/' ? 'index.html' : url);

  if (!path.extname(filePath)) {
    filePath = path.join(filePath, 'index.html');
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found: ' + req.url);
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log('============================================');
  console.log('  IP 智鉴 本地看板已启动');
  console.log('  访问地址: http://localhost:' + PORT);
  console.log('  按 Ctrl+C 关闭服务器');
  console.log('============================================');
});
