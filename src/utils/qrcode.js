/**
 * QR Code SVG Generator — lightweight, zero-dependency
 * Generates a visual QR-style SVG for UPI payment display
 *
 * Note: This generates a realistic-looking QR pattern for UI purposes.
 * In production, you'd use a real QR library (e.g., qrcode.react).
 */

/**
 * Simple hash function for deterministic pattern generation
 */
const simpleHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
};

/**
 * Generate a QR code SVG string
 * @param {string} data - The data to encode (e.g., UPI URL)
 * @param {number} size - SVG size in pixels
 * @returns {string} SVG markup string
 */
export const generateQRCodeSVG = (data, size = 200) => {
  const modules = 25; // QR grid size
  const moduleSize = size / modules;
  const hash = simpleHash(data);

  // Generate deterministic pattern from data
  const grid = [];
  for (let row = 0; row < modules; row++) {
    grid[row] = [];
    for (let col = 0; col < modules; col++) {
      grid[row][col] = false;
    }
  }

  // Add finder patterns (the three big squares in corners)
  const addFinderPattern = (startRow, startCol) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (r === 0 || r === 6 || c === 0 || c === 6) {
          grid[startRow + r][startCol + c] = true;
        } else if (r >= 2 && r <= 4 && c >= 2 && c <= 4) {
          grid[startRow + r][startCol + c] = true;
        }
      }
    }
  };

  // Three finder patterns
  addFinderPattern(0, 0);                          // Top-left
  addFinderPattern(0, modules - 7);                // Top-right
  addFinderPattern(modules - 7, 0);                // Bottom-left

  // Timing patterns (alternating dots between finders)
  for (let i = 8; i < modules - 8; i++) {
    grid[6][i] = i % 2 === 0;
    grid[i][6] = i % 2 === 0;
  }

  // Alignment pattern (small square)
  const alignPos = modules - 9;
  for (let r = -2; r <= 2; r++) {
    for (let c = -2; c <= 2; c++) {
      const ar = alignPos + r;
      const ac = alignPos + c;
      if (ar >= 0 && ar < modules && ac >= 0 && ac < modules) {
        if (Math.abs(r) === 2 || Math.abs(c) === 2 || (r === 0 && c === 0)) {
          grid[ar][ac] = true;
        }
      }
    }
  }

  // Fill data area with deterministic pattern based on input
  for (let row = 0; row < modules; row++) {
    for (let col = 0; col < modules; col++) {
      // Skip finder pattern areas
      if ((row < 8 && col < 8) || (row < 8 && col >= modules - 8) || (row >= modules - 8 && col < 8)) {
        continue;
      }
      // Skip timing patterns
      if (row === 6 || col === 6) continue;
      // Skip alignment pattern area
      if (Math.abs(row - alignPos) <= 2 && Math.abs(col - alignPos) <= 2) continue;

      // Deterministic fill based on hash
      const seed = (hash + row * 31 + col * 17 + row * col * 7) & 0xFFFF;
      grid[row][col] = seed % 3 !== 0; // ~66% fill for realistic density
    }
  }

  // Build SVG
  let rects = '';
  for (let row = 0; row < modules; row++) {
    for (let col = 0; col < modules; col++) {
      if (grid[row][col]) {
        const x = col * moduleSize;
        const y = row * moduleSize;
        rects += `<rect x="${x}" y="${y}" width="${moduleSize}" height="${moduleSize}" rx="1"/>`;
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
    <rect width="${size}" height="${size}" fill="white" rx="8"/>
    <g fill="currentColor">${rects}</g>
  </svg>`;
};

/**
 * Generate a UPI payment string
 * @param {number} amount - Amount in INR
 * @returns {string} UPI deep link string
 */
export const generateUPIString = (amount) => {
  return `upi://pay?pa=cinepass@upi&pn=CinePass&am=${amount}&cu=INR&tn=Movie Ticket Booking`;
};
