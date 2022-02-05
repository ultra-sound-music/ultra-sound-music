export function createNumberArray(size: number) {
  return Array.from(Array(size), (item, index) => index + 1);
}

export function createArray(size: number) {
  return Array.from(Array(size));
}
