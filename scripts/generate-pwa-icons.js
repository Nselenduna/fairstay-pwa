const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Create icons directory if it doesn't exist
const iconsDir = path.join(process.cwd(), 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Base color for generating a simple icon
const baseColor = '#3b82f6'; // Blue color from Tailwind

// Generate a simple SVG icon
const generateSvg = (size) => {
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="${baseColor}" rx="${size * 0.2}" />
      <text x="50%" y="50%" font-family="Arial" font-size="${size * 0.4}" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">FS</text>
    </svg>
  `;
};

// Sizes to generate
const sizes = [192, 384, 512];

// Generate icons
async function generateIcons() {
  for (const size of sizes) {
    const svgBuffer = Buffer.from(generateSvg(size));
    const outputPath = path.join(iconsDir, `icon-${size}x${size}.png`);
    
    await sharp(svgBuffer)
      .png()
      .toFile(outputPath);
    
    console.log(`Generated: ${outputPath}`);
  }
}

generateIcons().catch(console.error); 