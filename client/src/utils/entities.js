import { ethers } from 'ethers'
import usmAbi from '../lib/usmAbi';
import * as metaMask from '../utils/metaMask';
import * as constants from '../constants';

export async function joinBand(artistId, bandId) {
  const provider = metaMask.getProvider();
  const writeContract = new ethers.Contract(constants.web3.CONTRACT_ADDRESS, usmAbi, provider.getSigner());
  return writeContract.joinBand(artistId, bandId);
}