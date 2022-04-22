import isNil from 'lodash/isNil';

import { Callout, Col, Grid, Link, SiteFooter, SiteHeader } from '@usm/ui';
import logo from '@usm/assets/img/logo.png';
import { SolanaButton, Modal, Notification } from '@usm/components';
import { useAppInit, arweave, solana } from '@usm/app-state';

import Tokens from '../Tokens/Tokens';
import CreateAuctionForm from '../Forms/CreateAuctionForm/CreateAuctionForm';
import MintNFTForm from '../Forms/MintNFTForm/MintNFTForm';

import styles from './App.scss';
import UploadAssetsForm from '../Forms/UploadAssetsForm/UploadAssetsForm';
import { RiFileCopyLine } from 'react-icons/ri';
import { getAccountUrl } from '@usm/sol-client';

export function App() {
  useAppInit({ logo });

  const [solanaAccount] = solana.useAccountAddress();
  const [solanaBalance] = solana.useAccountBalance();
  const arweaveBalance = arweave.useAccountBalance();
  const [arweaveAccount] = arweave.useAccountAddress();

  const solBalance = isNil(solanaBalance) ? undefined : `${solanaBalance}  SOL`;
  const arBalance = isNil(arweaveBalance) ? undefined : `${arweaveBalance}  AR`;

  return (
    <div className={styles.App}>
      <div className={styles.header}>
        <SiteHeader ctaButton={<SolanaButton />} />
      </div>
      <div className={styles.body}>
        <Grid className={styles.assets}>
          <Col start={2} end={-2}></Col>
        </Grid>
        <div className={styles.section}>
          <Grid className={styles.assets}>
            <Col start={2} end={13}>
              <div className={styles.callout}>
                <div className={styles.accountInfo}>
                  <div className={styles.accountAddress}>
                    <div>
                      Solana: <Link to={getAccountUrl(solanaBalance + '')}>{solanaAccount}</Link>
                    </div>{' '}
                    {solanaAccount && <RiFileCopyLine />}
                  </div>
                  <div>Balance: {solBalance}</div>
                </div>
                <div className={styles.accountInfo}>
                  <div className={styles.accountAddress}>
                    <div>Arweave: {arweaveAccount}</div> {arweaveAccount && <RiFileCopyLine />}
                  </div>
                  <div>Balance: {arBalance}</div>
                </div>
              </div>
              <UploadAssetsForm />
            </Col>
            <Col start={15} end={24}>
              <MintNFTForm />
            </Col>
          </Grid>
        </div>
        <div className={styles.section}>
          <Grid>
            <Col start={2} end={-2}>
              <h3>Create the auction</h3>
              <CreateAuctionForm />
            </Col>
          </Grid>
        </div>
        <div className={styles.section}>
          <Grid>
            <Col start={2} end={-2}>
              <Tokens tokens={[]} />
            </Col>
          </Grid>
        </div>
      </div>
      <div className={styles.footer}>
        <SiteFooter />
      </div>
      <Notification />
      <Modal />
    </div>
  );
}

export default App;
