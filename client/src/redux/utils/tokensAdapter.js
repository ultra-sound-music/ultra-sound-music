import { createEntityAdapter } from '@reduxjs/toolkit';

export function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function getMockTraits() {
  return {
    texture: generateRandomNumber(1, 5),
    warmth: generateRandomNumber(1, 5),
    dissonance: generateRandomNumber(1, 5),
    aggression: generateRandomNumber(1, 5),
    space: generateRandomNumber(1, 5)
  };
}

export const mapTokenProps = (tokens) => {
  if (!tokens?.length) {
    return [];
  }

  tokens.forEach((token) => {
    token.id = token._id;
    if (token.tokenType === 'artist') {
      token.image =
        'https://ipfs.io/ipfs/bafybeignkeymrpl6ocnoxfnhzowcxru3tu6ro5pmksr45csjclszgrw3ni';
      token.traits = getMockTraits();
    }
  });
  return tokens;
};

export const tokensAdapter = createEntityAdapter();
