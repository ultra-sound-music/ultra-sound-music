export const MIN_BAND_MEMBERS = 2;
export const MAX_BAND_MEMBERS = 6;

export const tokenType = Object.freeze({
  ARTIST: 'artist',
  BAND: 'band',
  TRACK: 'track'
});

export const transactionStatus = Object.freeze({
  SUBMITTED: 'SUBMITTED',
  AUTHORIZED: 'AUTHORIZED',
  MINED: 'MINED',
  FAILED: 'FAILED'
});

export const transactionErrorCodes = Object.freeze({});

export const traitNames = ['texture', 'warmth', 'dissonance', 'aggression', 'space'];
