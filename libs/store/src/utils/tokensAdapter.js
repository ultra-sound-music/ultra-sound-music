import { createEntityAdapter } from '@reduxjs/toolkit';

export const mapTokenProps = (tokens) => {
  if (!tokens?.length) {
    return [];
  }

  // Yes, createEntityAdapter() can handle mapping the _id prop to id,
  // however that means the app has to have references to _id which could be confusing,
  // So, we map it manually and create a .id prop on the token object
  tokens.forEach((token) => (token.id = token._id));
  return tokens;
};

export const tokensAdapter = createEntityAdapter();
