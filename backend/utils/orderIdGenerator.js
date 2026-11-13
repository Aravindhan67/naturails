/**
 * Generates a unique, elegant order ID
 * Format: NAT-YYYYMMDD-XXXX (e.g. NAT-20261113-4829)
 */
const generateOrderId = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000); // 4 digit random
  return `NAT-${year}${month}${day}-${random}`;
};

module.exports = { generateOrderId };
