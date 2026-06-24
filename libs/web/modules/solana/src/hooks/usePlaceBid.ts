import { useEffect } from 'react';
import { useRecoilCallback, useResetRecoilState, useSetRecoilState } from 'recoil';

import logger from '@usm/logger';
import { TransactionInterface } from 'libs/shared/sol-client/src';

import { useModal, useShowNotification } from '../../../../../modules/ui/src';

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
