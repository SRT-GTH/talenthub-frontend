import { chromium } from 'playwright';
import fs from 'fs';
const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM_PATH });
const page = await browser.newPage();
const dir = 'C:/Users/gsito/.claude/projects/c--Users-gsito-OneDrive-Desktop-MY-CODES-SilverRockTech-talenthub-frontend/0d863bce-5422-4bbc-b2f9-7d1c316f55a2/tool-results/';
const b64 = fs.readFileSync(dir + 'mcp-figma-blob-1792324516154-lrkbcl.png').toString('base64');
const r = await page.evaluate(async (b64) => {
  const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
  const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
  const x = c.getContext('2d'); x.drawImage(img, 0, 0);
  const px = (X, Y) => Array.from(x.getImageData(X, Y, 1, 1).data).slice(0, 3).join(',');
  return { size: [img.width, img.height], cardBg: px(95,300), stage: px(45,300), modal: px(500,60), swForestBody: px(455,160), swSun: px(525,150), swMid: px(600,150), swKente: px(670,150), segActive: px(455,276), segInactive: px(560,262), checkBox: px(450,350), btnPrep: px(660,680), btnShare: px(780,690), btnShareBorder: px(773,677), safety: px(450,610), textareaBorder: px(443,500), progressFill: px(145,432), progressTrack: px(260,432), overlayBg: px(150,320), caption: px(470,500), sticker: px(120,160), chipBg: px(130,470), qrcard: px(110,600) };
}, b64);
console.log(JSON.stringify(r, null, 1));
await browser.close();
