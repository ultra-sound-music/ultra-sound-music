import { createEntityAdapter } from '@reduxjs/toolkit';
import mixcoatl from '@images/mock/mixcoatl.png';

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
    // if (token.s3Sound) {
    //   token.audio = token.s3Sound;
    // }

    if (token.tokenType === 'artist') {
      token.image = mixcoatl;
      token.audio =
        'https://storageapi.fleek.co/ultrasoundmusic-team-bucket/trim_abcdeabcdeabcdeabcdeabcdeabcdeabcdeabcde_zyxwvzyxwvzyxwvzyxwvzyxwvzyxwvzyxwvzyxwvzyxwvzyxwvzyxwvzyxwvzyxw_1633123514640.wav';
      token.traits = getMockTraits();
    }
  });
  return tokens;
};

export const tokensAdapter = createEntityAdapter();
