import { useEffect } from 'react';
import { useRecoilCallback, useResetRecoilState, useSetRecoilState } from 'recoil';

import logger from '@usm/util-logger';
import { TransactionInterface } from '@usm/sol-client';

import { useModal, useShowNotification } from '../../../ui';

import { AccountAddress } from '../types';
import {
  useActiveAuction,
  auctionDataByAddressState,
  auctionLoadingByAddressState
} from '../models/auctions';
import {
  networkStatusState,
  accountAddressState,
  useAccountBalance,
  useNetworkStatus,
  useAccountAddress
} from '../models/wallet';
import {
  getAuction,
  placeBid,
  connectWallet,
  disconnectWallet,
  getWalletBalance,
  redeemBid,
  redeemParticipationBid,
  cancelBid
} from '../api/api';
