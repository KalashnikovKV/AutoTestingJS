export function findMax(arr) {
  if (!Array.isArray(arr)) {
    throw new Error('Input must be an array');
  }
  if (arr.length === 0) {
    throw new Error('Array cannot be empty');
  }
  return Math.max(...arr);
}

export function findMin(arr) {
  if (!Array.isArray(arr)) {
    throw new Error('Input must be an array');
  }
  if (arr.length === 0) {
    throw new Error('Array cannot be empty');
  }
  return Math.min(...arr);
}

export function removeDuplicates(arr) {
  if (!Array.isArray(arr)) {
    throw new Error('Input must be an array');
  }
  return [...new Set(arr)];
}
