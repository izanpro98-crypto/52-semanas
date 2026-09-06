/* Genera los iconos PNG de la app sin dependencias externas.
   Ejecutar:  node _iconos.js
   Puedes borrar este fichero despues de generarlos; solo hace falta si
   algun dia quieres cambiar el diseno del icono. */
const zlib = require("zlib");
const fs = require("fs");

/* ---------- codificador PNG minimo ---------- */
const TABLA = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = TABLA[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(tipo, datos) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(datos.length);
  const cuerpo = Buffer.concat([Buffer.from(tipo, "ascii"), datos]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(cuerpo));
  return Buffer.concat([len, cuerpo, crc]);
}
function png(w, h, rgba) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;   // bits por canal
  ihdr[9] = 6;   // RGBA
  const filas = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) {
    filas[y * (w * 4 + 1)] = 0; // filtro none
    rgba.copy(filas, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4);
  }
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", zlib.deflateSync(filas, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

/* ---------- dibujo ---------- */
const FONDO = [0x16, 0x12, 0x10];
const BRASA = [0xf2, 0x60, 0x3c];
const BRILLO = [0x3a, 0x22, 0x1a];

/* mancuerna en coordenadas 0..1, centrada; se encoge al 0.88 para que
   quepa en la zona segura de los iconos "maskable" de Android */
const K = 0.88;
function c(v) { return 0.5 + (v - 0.5) * K; }
const PIEZAS = [
  [c(0.32), c(0.455), c(0.68), c(0.545)], // barra
  [c(0.22), c(0.34), c(0.32), c(0.66)],   // disco interior izq
  [c(0.68), c(0.34), c(0.78), c(0.66)],   // disco interior der
  [c(0.14), c(0.42), c(0.22), c(0.58)],   // disco exterior izq
  [c(0.78), c(0.42), c(0.86), c(0.58)],   // disco exterior der
];

function dentro(x, y) {
  for (const [x0, y0, x1, y1] of PIEZAS)
    if (x >= x0 && x <= x1 && y >= y0 && y <= y1) return true;
  return false;
}

function icono(tam) {
  const SS = 4; // supermuestreo para que los bordes no salgan dentados
  const px = Buffer.alloc(tam * tam * 4);
  for (let y = 0; y < tam; y++) {
    for (let x = 0; x < tam; x++) {
      let hits = 0;
      for (let sy = 0; sy < SS; sy++)
        for (let sx = 0; sx < SS; sx++)
          if (dentro((x + (sx + 0.5) / SS) / tam, (y + (sy + 0.5) / SS) / tam)) hits++;
      const a = hits / (SS * SS);

      // fondo con un resplandor calido hacia la esquina superior derecha
      const dx = (x / tam) - 0.92, dy = (y / tam) - 0.08;
      const d = Math.min(1, Math.sqrt(dx * dx + dy * dy) / 0.95);
      const g = Math.pow(1 - d, 2.2);

      const i = (y * tam + x) * 4;
      for (let ch = 0; ch < 3; ch++) {
        const fondo = FONDO[ch] + (BRILLO[ch] - FONDO[ch]) * g;
        px[i + ch] = Math.round(fondo + (BRASA[ch] - fondo) * a);
      }
      px[i + 3] = 255;
    }
  }
  return png(tam, tam, px);
}

for (const [nombre, tam] of [["icon-192.png", 192], ["icon-512.png", 512], ["apple-touch-icon.png", 180]]) {
  fs.writeFileSync(__dirname + "/" + nombre, icono(tam));
  console.log("  " + nombre + "  " + tam + "x" + tam);
}
console.log("Iconos generados.");
