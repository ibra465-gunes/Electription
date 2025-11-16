const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');
const { JSDOM } = require('jsdom');
const { DOMParser } = new JSDOM().window;

// SVG içeriğini oku
const faviconSvgContent = fs.readFileSync(path.join(__dirname, 'public', 'favicon.svg'), 'utf8');
const logoSvgContent = fs.readFileSync(path.join(__dirname, 'src', 'logo.svg'), 'utf8');

// favicon.ico oluştur (16x16, 32x32, 48x48)
async function createFavicon() {
  const canvas = createCanvas(64, 64);
  const ctx = canvas.getContext('2d');
  
  const img = await loadSvg(faviconSvgContent, 64, 64);
  ctx.drawImage(img, 0, 0, 64, 64);
  
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(__dirname, 'public', 'favicon.ico'), buffer);
  console.log('favicon.ico oluşturuldu');
}

// logo192.png ve logo512.png oluştur
async function createLogos() {
  // 192x192 logo
  let canvas = createCanvas(192, 192);
  let ctx = canvas.getContext('2d');
  
  let img = await loadSvg(logoSvgContent, 192, 192);
  ctx.drawImage(img, 0, 0, 192, 192);
  
  let buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(__dirname, 'public', 'logo192.png'), buffer);
  console.log('logo192.png oluşturuldu');
  
  // 512x512 logo
  canvas = createCanvas(512, 512);
  ctx = canvas.getContext('2d');
  
  img = await loadSvg(logoSvgContent, 512, 512);
  ctx.drawImage(img, 0, 0, 512, 512);
  
  buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(__dirname, 'public', 'logo512.png'), buffer);
  console.log('logo512.png oluşturuldu');
}

async function loadSvg(svgContent, width, height) {
  const svg64 = Buffer.from(svgContent).toString('base64');
  const img = await loadImage(`data:image/svg+xml;base64,${svg64}`);
  return img;
}

// Görselleri oluştur
async function run() {
  try {
    await createFavicon();
    await createLogos();
    console.log('Tüm görseller başarıyla oluşturuldu');
  } catch (error) {
    console.error('Hata:', error);
  }
}

run();
