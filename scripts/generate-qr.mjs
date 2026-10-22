import { promises as fs } from 'node:fs';
import path from 'node:path';
import QRCode from 'qrcode';

const text =
  process.env.SPONSOR_QR_TEXT ||
  'mailto:hello@codelab.dev?subject=' + encodeURIComponent('我想赞助我敲，拟码');
const out = path.resolve('apps/web/public/assets/sponsor-qr.svg');
await fs.mkdir(path.dirname(out), { recursive: true });
const svg = await QRCode.toString(text, {
  type: 'svg',
  margin: 2,
  width: 360,
  errorCorrectionLevel: 'M',
  color: { dark: '#14181f', light: '#ffffff' },
});
await fs.writeFile(out, svg, 'utf8');
console.log(`sponsor QR written to ${out}`);
