/**
 * Seat utility functions
 * Generates theater seat layouts and calculates pricing
 *
 * Layout matches real Indian cinemas (PVR, INOX, Cinépolis):
 *   Front rows (near screen) → Basic    (₹150)
 *   Middle rows              → Standard (₹250)
 *   Back rows (best view)    → Premium  (₹400)
 */

// Pricing tiers — ordered front-to-back (nearest screen → farthest)
const PRICING = {
  basic:    { rows: ['A', 'B', 'C'],                         price: 150, label: 'Basic' },
  standard: { rows: ['D', 'E', 'F', 'G'],                    price: 250, label: 'Standard' },
  premium:  { rows: ['H', 'I', 'J', 'K', 'L', 'M', 'N'],    price: 400, label: 'Premium' },
};

// For stadium (cricket), use separate pricing
export const STADIUM_PRICING = {
  basic:    { rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],                     price: 500,  label: 'Basic' },
  standard: { rows: ['I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'],                     price: 1000, label: 'Standard' },
  premium:  { rows: ['Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],           price: 2000, label: 'Premium' },
};

/**
 * Get price for a specific row
 */
export const getSeatPrice = (row) => {
  for (const tier of Object.values(PRICING)) {
    if (tier.rows.includes(row)) return tier.price;
  }
  return 250; // default
};

/**
 * Get tier label for a row
 */
export const getSeatTier = (row) => {
  for (const tier of Object.values(PRICING)) {
    if (tier.rows.includes(row)) return tier.label;
  }
  return 'Standard';
};

/**
 * Get all pricing tiers info
 */
export const getPricingTiers = () => PRICING;

/**
 * Generate a theater seat layout
 * Returns a 2D array of seat objects
 *
 * For cinema: 10 rows × 14 seats
 *   Rows A-C = Basic (₹150)   — 3 rows near screen
 *   Rows D-G = Standard (₹250) — 4 rows middle
 *   Rows H-J = Premium (₹400)  — 3 rows back (best view)
 *
 * @param {number} rows - Number of rows (default 10)
 * @param {number} cols - Number of seats per row (default 14)
 * @param {number} bookedPercent - Percentage of seats pre-booked (0-1)
 */
export const generateSeatLayout = (rows = 10, cols = 14, bookedPercent = 0.2) => {
  const rowLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').slice(0, rows);
  const layout = [];

  // Determine which seats are booked (random, seeded per session)
  const totalSeats = rows * cols;
  const bookedCount = Math.floor(totalSeats * bookedPercent);
  const bookedIndices = new Set();

  while (bookedIndices.size < bookedCount) {
    bookedIndices.add(Math.floor(Math.random() * totalSeats));
  }

  let seatIndex = 0;

  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      // Aisle gaps: after seat 4 and after seat 10 (creates left, center, right sections)
      const isAisle = c === 3 || c === 10;

      row.push({
        id: `${rowLabels[r]}${c + 1}`,
        row: rowLabels[r],
        col: c + 1,
        status: bookedIndices.has(seatIndex) ? 'booked' : 'available',
        price: getSeatPrice(rowLabels[r]),
        tier: getSeatTier(rowLabels[r]),
        isAisleRight: isAisle,
      });
      seatIndex++;
    }
    layout.push(row);
  }

  return layout;
};

/**
 * Calculate total price for selected seats
 */
export const calculateTotal = (selectedSeats, seatLayout) => {
  if (!selectedSeats.length || !seatLayout.length) return 0;

  return selectedSeats.reduce((total, seatId) => {
    // Handle prefixed IDs like "N-A1" -> "A1"
    const actualId = seatId.includes('-') ? seatId.split('-')[1] : seatId;
    const row = actualId.charAt(0);
    return total + getSeatPrice(row);
  }, 0);
};

/**
 * Format currency in INR
 */
export const formatPrice = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
