// Format currency to Indian Rupees (includes ₹ symbol)
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format number as INR without currency symbol (for cases where ₹ is already present)
export const formatINR = (amount) => {
  return Number(amount).toLocaleString("en-IN");
};

// Format date to readable format
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Format date for input fields
export const formatDateForInput = (date) => {
  return new Date(date).toISOString().split('T')[0];
};

// Calculate total from array of amounts
export const calculateTotal = (amounts) => {
  return amounts.reduce((sum, amount) => sum + amount, 0);
};
