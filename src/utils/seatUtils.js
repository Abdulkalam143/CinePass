/**
 * Seat utility functions
 * Generates theater seat layouts and calculates pricing
 */

// Pricing tiers by row
const PRICING = {
  premium: { rows: ['A', 'B'], price: 350, label: 'Premium' },
  standard: { rows: ['C', 'D', 'E', 'F'], price: 250, label: 'Standard' },
  budget: { rows: ['G', 'H'], price: 150, label: 'Budget' },
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
 * @param {number} rows - Number of rows (default 8)
 * @param {number} cols - Number of seats per row (default 12)
 * @param {number} bookedPercent - Percentage of seats to mark as booked (0-1)
 */
export const generateSeatLayout = (rows = 8, cols = 12, bookedPercent = 0.2) => {
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
      // Add an aisle gap after seat 3 and before seat 9 (seats 4-8 are middle section)
      const isAisle = c === 3 || c === 8;

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
    const row = seatId.charAt(0);
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
