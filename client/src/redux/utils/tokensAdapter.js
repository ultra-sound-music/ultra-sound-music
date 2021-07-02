import { createEntityAdapter } from '@reduxjs/toolkit'

export default createEntityAdapter({
  selectId: (token) => token.tokenId
})