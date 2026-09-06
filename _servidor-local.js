const http = require("http"), fs = require("fs"), path = require("path");
const RAIZ = __dirname;
const TIPOS = { ".html":"text/html; charset=utf-8", ".js":"text/javascript; charset=utf-8",
  ".json":"application/json; charset=utf-8", ".webmanifest":"application/manifest+json; charset=utf-8",
  ".png":"image/png", ".svg":"image/svg+xml" };
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (p === "/") p = "/index.html";
  const f = path.join(RAIZ, p);
  if (!f.startsWith(path.resolve(RAIZ))) { res.writeHead(403).end(); return; }
  fs.readFile(f, (err, data) => {
    if (err) { res.writeHead(404, {"Content-Type":"text/plain"}).end("404"); return; }
    res.writeHead(200, { "Content-Type": TIPOS[path.extname(f)] || "application/octet-stream",
                         "Cache-Control": "no-cache" });
    res.end(data);
  });
}).listen(8129, () => console.log("servidor en http://localhost:8129"));
