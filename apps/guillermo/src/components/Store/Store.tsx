import isEmpty from 'lodash/isEmpty';
import { PublicKey } from '@solana/web3.js';
import { useEffect, useState } from 'react';
import { Store } from '@metaplex-foundation/mpl-metaplex';

import configs from '@usm/config';
import { solana, useShowModal } from '@usm/app-state';
import { InputFieldSet } from '@usm/ui';
import { initStore } from '@usm/sol-client';

import { Auction } from '@metaplex-foundation/mpl-auction';
import { Vault } from '@metaplex-foundation/mpl-token-vault';

import styles from './Store.scss';
import { Button } from '@usm/ui';

const { getConnection, getWallet } = solana;

// @TODO - might need to create another account for the DAO - the one that manages all auctions
// should it be different from the treasury? - LEANING TOWARDS YES
// should it be different from the nft creator?  - YES, because the NFT creator may be different for each NFT and we want one store for all of our auctions
const auctionOwnerIsDao = configs.auctionOwner === configs.daoTreasury;

export type TokensMappedByManager = {
  [storeAddress: string]: string[];
};

export function Tokens() {
  const showModal = useShowModal();
  const [storeAccount, setStoreAccount] = useState<string>();
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [tokens, setTokens] = useState<TokensMappedByManager>();

  // @TODO - check the auctionOwner account, if it's a DAO, then link to realms
  useEffect(() => {
    if (configs.auctionOwner) {
      Store.getPDA(new PublicKey(configs.auctionOwner)).then(async (storePk) => {
        setStoreAccount(storePk.toBase58());
        const wallet = await getWallet().catch(console.error);
        if (!wallet) {
          return;
        }

        const connection = getConnection();
        let store: Store;
        try {
          store = await Store.load(connection, storePk);
        } catch (error) {
          console.error(error);
          const label = auctionOwnerIsDao ? 'Governance account' : 'Your account';
          showModal({
            withCloseX: false,
            body: (
              <div>
                <div>
                  The auction owner does not have a store associated with their account. Would you
                  like to create one and try again?
                </div>
                <br />
                <InputFieldSet
                  name='tofu'
                  label={label}
                  value={configs.daoTreasury}
                  disabled={true}
                />
                <br />
                <Button
                  isFullWidth={true}
                  onClick={() => {
                    initStore({
                      connection,
                      wallet,
                      settingsUri: null,
                      isPublic: false
                    });
                  }}
                >
                  Yes
                </Button>
              </div>
            )
          });
          return null;
        }

        const auctionManagers = await store.getAuctionManagers(connection);

        auctionManagers
          .reduce(async (obj, manager) => {
            const vault = await Vault.load(connection, manager.data.vault);
            const boxes = await vault.getSafetyDepositBoxes(connection);
            const tokens = boxes
              .sort((a, b) => a.data.order - b.data.order)
              .map((box) => box.data.tokenMint);

            const actual = await obj;
            actual[manager.data.auction] = tokens;
            return obj;
          }, {} as Promise<TokensMappedByManager>)
          .then(setTokens);

        const auctionRequests = auctionManagers.map((auctionManager) => {
          return auctionManager.getAuction(connection);
        });

        const auctions = await Promise.all(auctionRequests);
        setAuctions(auctions);
        return;
      });
    }
  }, []);

  return (
    <div>
      <h3>Store Account: {storeAccount}</h3>
      {isEmpty(auctions) ? (
        <h4>There aren't any auctions to display</h4>
      ) : (
        auctions
          .filter((a) => a)
          .map((auction) => {
            const auctionAddress = auction.pubkey.toBase58();

            return (
              <div className={styles.auctionRowItem}>
                <div className={styles.addresses}>
                  <div>{auctionAddress}</div>
                  <div className={styles.auctionTokens}>
                    {!!tokens && tokens[auctionAddress].map((t) => <div>{t}</div>)}
                  </div>
                </div>
                <div>
                  <div>state: {auction.data.state}</div>
                  <div>last bid: {auction.data.lastBid?.toNumber()}</div>
                </div>
              </div>
            );
          })
      )}
    </div>
  );
}

export default Tokens;
