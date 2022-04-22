import isNil from 'lodash/isNil';

import { Col, Grid, Link, SiteFooter, SiteHeader } from '@usm/ui';
import logo from '@usm/assets/img/logo.png';
import { SolanaButton, Modal, Notification } from '@usm/components';
import configs from '@usm/config';
import { useAppInit, arweave, solana } from '@usm/app-state';

import Tokens from '../Tokens/Tokens';
import CreateAuctionForm from '../Forms/CreateAuctionForm/CreateAuctionForm';
import MintNFTForm from '../Forms/MintNFTForm/MintNFTForm';

import styles from './App.scss';
import UploadAssetsForm from '../Forms/UploadAssetsForm/UploadAssetsForm';
import { RiAddCircleLine, RiFileCopyLine } from 'react-icons/ri';
import { getAccountUrl } from '@usm/sol-client';

export function App() {
  async function addAR() {
    const host = `${configs.arweaveProtocol}://${configs.arweaveHost}:${configs.arweavePort}`;
    const newBalanceResponse = await fetch(
      `${host}/mint/${arweaveAccount}/${arweave.WINSTONS_PER_AR * 1}`
    );
    await fetch(`${host}/mine`);
    const newBalanceInWinstons = await newBalanceResponse.text();
    setArweaveBalance(newBalanceInWinstons + '');
  }

  useAppInit({ logo });

  const [solanaAccount] = solana.useAccountAddress();
  const [solanaBalance] = solana.useAccountBalance();
  const arweaveBalance = arweave.useAccountBalance();
  const setArweaveBalance = arweave.useSetAccountBalance();
  const [arweaveAddress] = arweave.useAccountAddress();
  const [arweaveNetworkStatus] = arweave.useNetworkStatus();
  const arweaveIsConnected = arweaveNetworkStatus === 'CONNECTED';
  const arweaveAccount = arweaveIsConnected ? arweaveAddress : undefined;

  const isUsingLocalArweave = configs.arweaveHost === 'localhost';
  const solBalance = isNil(solanaBalance) ? undefined : `${solanaBalance}  SOL`;
  const arBalance =
    !isNil(arweaveBalance) && arweaveIsConnected ? `${arweaveBalance}  AR` : undefined;

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
                  <div className={styles.accountBalance}>
                    Balance: {arBalance}{' '}
                    {arBalance && isUsingLocalArweave && (
                      <RiAddCircleLine onClick={addAR} className={styles.addAR} />
                    )}
                  </div>
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
