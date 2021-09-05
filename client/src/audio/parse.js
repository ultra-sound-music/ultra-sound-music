/*
An ethereum address has 40 characters that can be a hex value (0-9 + abcdef)

We want to generate a looping bar of "music"

That's 5 groups of 8 characters
Then the 5 groups can set the parameters for the kick, snare, hihat, keys, bass

So the kick group has parameters set by 8 hex characters

*/

const segmentDrumChars = (char) => {
  switch (char) {
    case '0':
    case '1':
    case '2':
    case '3':
      return ['-', '-'];
    case '4':
    case '5':
    case '6':
    case '7':
      return ['*', '-'];
    case '8':
    case '9':
    case 'a':
    case 'b':
      return ['-', '*'];
    case 'c':
    case 'd':
    case 'e':
    case 'f':
      return ['*', '*'];
    default:
      return -1;
  }
};

const segmentKeyChars = (char) => {
  switch (char) {
    case '0':
    case '1':
      return ['', ''];
    case '2':
      return ['C3', ''];
    case '3':
      return ['D3', ''];
    case '4':
      return ['E3', ''];
    case '5':
      return ['F3', ''];
    case '6':
      return ['G3', ''];
    case '7':
      return ['A3', ''];
    case '8':
      return ['', 'C3'];
    case '9':
      return ['', 'D3'];
    case 'a':
      return ['', 'E3'];
    case 'b':
      return ['', 'F3'];
    case 'c':
      return ['G3', 'C3'];
    case 'd':
      return ['A3', 'D3'];
    case 'e':
      return ['B3', 'E3'];
    case 'f':
      return ['C4', 'F3'];
    default:
      return -1;
  }
};

const segmentBassChars = (char) => {
  switch (char) {
    case '0':
    case '1':
      return ['', ''];
    case '2':
      return ['C1', ''];
    case '3':
      return ['D1', ''];
    case '4':
      return ['E1', ''];
    case '5':
      return ['F1', ''];
    case '6':
      return ['G1', ''];
    case '7':
      return ['A1', ''];
    case '8':
      return ['', 'C1'];
    case '9':
      return ['', 'D1'];
    case 'a':
      return ['', 'E1'];
    case 'b':
      return ['', 'F1'];
    case 'c':
      return ['G1', 'C1'];
    case 'd':
      return ['A1', 'D1'];
    case 'e':
      return ['B1', 'E1'];
    case 'f':
      return ['C1', 'F1'];
    default:
      return -1;
  }
};

export const charsToDrumInput = (charStr) => {
  const output = [];
  let counter = 0;
  for (const idx in charStr) {
    const char = charStr[idx];
    const pair = segmentDrumChars(char);
    if (idx % 2 === 0) {
      output.push([]);
    }
    output[counter].push(...pair);
    if (idx % 2 === 1) {
      counter++;
    }
  }

  return output;
};

export const charsToKeysInput = (charStr) => {
  const output = [];
  let counter = 0;
  for (const idx in charStr) {
    const char = charStr[idx];
    const pair = segmentKeyChars(char);
    if (idx % 2 === 0) {
      output.push([]);
    }
    output[counter].push(...pair);
    if (idx % 2 === 1) {
      counter++;
    }
  }

  return output;
};

export const charsToBassInput = (charStr) => {
  const output = [];
  let counter = 0;
  for (const idx in charStr) {
    const char = charStr[idx];
    const pair = segmentBassChars(char);
    if (idx % 2 === 0) {
      output.push([]);
    }
    output[counter].push(...pair);
    if (idx % 2 === 1) {
      counter++;
    }
  }

  return output;
};
