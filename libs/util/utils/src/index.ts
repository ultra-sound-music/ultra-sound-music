export function createArray(size: number) {
  return Array.from(Array(size), (item, index) => index + 1);
}
