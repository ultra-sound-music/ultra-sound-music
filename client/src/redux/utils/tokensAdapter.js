import { createEntityAdapter } from '@reduxjs/toolkit';

export const mapTokenProps = (tokens) => {
  if (!tokens?.length) {
    return [];
  }

  tokens.forEach((token) => (token.id = token._id));
  return tokens;
};

export const tokensAdapter = createEntityAdapter();
