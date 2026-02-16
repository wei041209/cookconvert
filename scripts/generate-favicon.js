/**
 * Generate a simple favicon.ico file
 * This creates a minimal 16x16 ICO file with a green background and "CC" text
 */

const fs = require('fs');
const path = require('path');

// Minimal ICO file structure for a 16x16 icon
// This is a very basic ICO file with a simple green square
function createMinimalICO() {
  // ICO file structure:
  // - Header: 6 bytes
  // - Directory: 16 bytes
  // - BITMAPINFOHEADER: 40 bytes
  // - Bitmap data: 16x16x32bpp = 1024 bytes
  // - AND mask: 16x16x1bpp = 32 bytes (aligned)
  // Total: 6 + 16 + 40 + 1024 + 32 = 1118 bytes
  const ico = Buffer.alloc(1118);
  
  // ICO file header (6 bytes)
  ico.writeUInt16LE(0, 0);      // Reserved, must be 0
  ico.writeUInt16LE(1, 2);      // Type: 1 = ICO
  ico.writeUInt16LE(1, 4);      // Number of images
  
  // Image directory entry (16 bytes)
  ico.writeUInt8(16, 6);        // Width
  ico.writeUInt8(16, 7);        // Height
  ico.writeUInt8(0, 8);         // Color palette (0 = no palette)
  ico.writeUInt8(0, 9);         // Reserved
  ico.writeUInt16LE(1, 10);     // Color planes
  ico.writeUInt16LE(32, 12);    // Bits per pixel
  ico.writeUInt32LE(1096, 14);  // Size of image data (40 + 1024 + 32)
  ico.writeUInt32LE(22, 18);    // Offset to image data
  
  // BITMAPINFOHEADER (40 bytes)
  let offset = 22;
  ico.writeUInt32LE(40, offset);        // Size of header
  ico.writeInt32LE(16, offset + 4);     // Width
  ico.writeInt32LE(32, offset + 8);     // Height (16*2 for XOR and AND masks)
  ico.writeUInt16LE(1, offset + 12);    // Planes
  ico.writeUInt16LE(32, offset + 14);  // Bits per pixel
  ico.writeUInt32LE(0, offset + 16);    // Compression
  ico.writeUInt32LE(0, offset + 20);    // Image size (0 = uncompressed)
  ico.writeInt32LE(0, offset + 24);     // X pixels per meter
  ico.writeInt32LE(0, offset + 28);     // Y pixels per meter
  ico.writeUInt32LE(0, offset + 32);    // Colors used
  ico.writeUInt32LE(0, offset + 36);    // Important colors
  
  // Bitmap data: 16x16x32bpp = 1024 bytes
  // Fill with green background (#10B981 = RGB 16, 185, 129)
  offset = 62;
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      const pos = offset + (y * 16 + x) * 4;
      // Simple pattern: green background with "CC" in center
      if ((x >= 4 && x <= 11 && y >= 5 && y <= 10)) {
        // White pixels for "CC" text area
        ico.writeUInt8(255, pos);     // B
        ico.writeUInt8(255, pos + 1); // G
        ico.writeUInt8(255, pos + 2); // R
        ico.writeUInt8(0, pos + 3);   // A
      } else {
        // Green background
        ico.writeUInt8(129, pos);     // B
        ico.writeUInt8(185, pos + 1); // G
        ico.writeUInt8(16, pos + 2);   // R
        ico.writeUInt8(0, pos + 3);   // A
      }
    }
  }
  
  // AND mask: 16x16x1bpp = 32 bytes (all zeros for no transparency)
  offset = 1086;
  ico.fill(0, offset, offset + 32);
  
  return ico;
}

// Generate and save favicon.ico
const icoData = createMinimalICO();
const outputPath = path.join(__dirname, '..', 'app', 'favicon.ico');
fs.writeFileSync(outputPath, icoData);
console.log('✓ Generated favicon.ico at', outputPath);

