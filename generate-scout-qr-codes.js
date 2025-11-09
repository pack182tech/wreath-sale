import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const scouts = [
  { slug: 'tommy-anderson', name: 'Tommy Anderson' },
  { slug: 'sarah-martinez', name: 'Sarah Martinez' },
  { slug: 'michael-chen', name: 'Michael Chen' },
  { slug: 'emma-johnson', name: 'Emma Johnson' },
  { slug: 'alex-rivera', name: 'Alex Rivera' }
];

const outputDir = path.join(__dirname, 'public', 'images', 'qr-codes');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const baseUrl = 'https://pack182tech.github.io/wreath-sale/#/?scout=';

async function generateQRCodes() {
  console.log('Generating QR codes for scouts...\n');

  for (const scout of scouts) {
    const url = `${baseUrl}${scout.slug}`;
    const outputPath = path.join(outputDir, `${scout.slug}.png`);

    try {
      await QRCode.toFile(outputPath, url, {
        width: 400,
        margin: 2,
        color: {
          dark: '#1a472a',  // Pack 182 green
          light: '#FFFFFF'
        }
      });
      console.log(`✓ Generated QR code for ${scout.name}: ${scout.slug}.png`);
      console.log(`  URL: ${url}`);
    } catch (err) {
      console.error(`✗ Error generating QR code for ${scout.name}:`, err);
    }
  }

  console.log('\n✅ All QR codes generated successfully!');
  console.log(`📁 QR codes saved to: ${outputDir}`);
}

generateQRCodes();
