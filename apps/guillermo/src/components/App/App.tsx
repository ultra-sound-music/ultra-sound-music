import { SiteFooter, SiteHeader } from '@usm/ui';

import { SolanaButton, Modal } from '@usm/components';

import Tokens from '../Tokens/Tokens';
import CreateAuctionForm from '../CreateAuctionForm/CreateAuctionForm';
import MintNFTForm from '../MintNFTForm/MintNFTForm';

import styles from './App.scss';

export function App() {
  return (
    <div className={styles.App}>
      <div className={styles.header}>
        <SiteHeader ctaButton={<SolanaButton />} />
      </div>
      <div className={styles.body}>
        <div className={styles.section}>
          <h3>Create your NFT</h3>
          <MintNFTForm />
        </div>
        <div className={styles.section}>
        <h3>Create the auction</h3>
          <CreateAuctionForm />
        </div>
        <div className={styles.section}>
          <Tokens tokens={[]} />
        </div>
      </div>
      <div className={styles.footer}>
        <SiteFooter />
      </div>
      <Modal />
    </div>
  );
}

export default App;
