import { ITraitsDefinition } from '@uiTypes';

export function generateRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function createArray(size: number): number[] {
  return Array.from(Array(size), (e, i) => i + 1);
}

export function getMockTraits(): ITraitsDefinition {
  return {
    texture: generateRandomNumber(1, 5),
    warmth: generateRandomNumber(1, 5),
    dissonance: generateRandomNumber(1, 5),
    aggression: generateRandomNumber(1, 5),
    space: generateRandomNumber(1, 5)
  };
}
