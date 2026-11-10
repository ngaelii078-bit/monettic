import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from '@playwright/test';

// Export web-sized copies of the Monettic icon from its SVG source.
// Pass --icons-only to leave the social sharing card untouched.
const browser = await chromium.launch({ channel: 'chrome' });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  if (!process.argv.includes('--icons-only')) {
    const regular = (await readFile(resolve('public/fonts/cormorant-garamond-latin.woff2'))).toString('base64');
    const italic = (await readFile(resolve('public/fonts/cormorant-garamond-latin-italic.woff2'))).toString('base64');
    const artwork = (await readFile(resolve('public/social-card.svg'), 'utf8')).replaceAll('Georgia,serif', 'MonetticEditorial,Georgia,serif');
    await page.setContent(`<style>@font-face{font-family:MonetticEditorial;src:url(data:font/woff2;base64,${regular}) format('woff2');font-weight:400}@font-face{font-family:MonetticEditorial;src:url(data:font/woff2;base64,${italic}) format('woff2');font-weight:400;font-style:italic}html,body{margin:0;padding:0}svg{display:block}</style>${artwork}`);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: 'public/social-card.png' });
  }
  const mark = (await readFile(resolve('public/favicon.svg'))).toString('base64');
  async function exportIcon(size, file) {
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(`<style>html,body{margin:0;padding:0}img{display:block;width:100vw;height:100vh}</style><img src="data:image/svg+xml;base64,${mark}" alt="">`);
    await page.locator('img').evaluate(image => image.decode());
    return page.screenshot(file ? { path: `public/${file}` } : {});
  }
  for (const [size, file] of [[96, 'favicon.png'], [512, 'logo.png'], [180, 'apple-touch-icon.png']]) {
    await exportIcon(size, file);
  }
  // ICO directory entries point to standard PNG frames; no extra encoder needed.
  const sizes = [16, 32, 48, 256];
  const frames = [];
  for (const size of sizes) frames.push(await exportIcon(size));
  const header = Buffer.alloc(6 + 16 * frames.length);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(frames.length, 4);
  let offset = header.length;
  frames.forEach((frame, index) => {
    const entry = 6 + index * 16;
    header[entry] = sizes[index] % 256;
    header[entry + 1] = sizes[index] % 256;
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(frame.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += frame.length;
  });
  await writeFile(resolve('public/favicon.ico'), Buffer.concat([header, ...frames]));
  console.log('Generated Monettic favicon.png (96×96), favicon.ico (16/32/48/256), logo.png (512×512), apple-touch-icon.png (180×180).');
} finally { await browser.close(); }
