import { useState } from 'react';
import isNil from 'lodash/isNil';

import { Col, Grid, Link, SiteFooter, SiteHeader } from '@usm/ui';
import logo from '@usm/assets/img/logo.png';
import { SolanaButton, Modal, Notification } from '@usm/components';
import configs from '@usm/config';
import { useAppInit, arweave, solana } from '@usm/app-state';

import Store from '../Store/Store';
import Tokens from '../Tokens/Tokens';
import CreateAuctionForm from '../Forms/CreateAuctionForm/CreateAuctionForm';
import MintNFTForm from '../Forms/MintNFTForm/MintNFTForm';

import styles from './App.scss';
import UploadAssetsForm from '../Forms/UploadAssetsForm/UploadAssetsForm';
import { RiAddCircleLine, RiFileCopyLine } from 'react-icons/ri';
import { getAccountUrl, LAMPORTS_PER_SOL, PublicKey } from '@usm/sol-client';
import Serializer from '../Serializer/Serializer';
import CreateProposalForm from '../Forms/CreateProposalForm/CreateProposalForm';
import { useAuctionsProgress, AuctionItemProgress } from '../../state/tokens';

export function App() {
  useAppInit({ logo });

  async function addAR() {
    const newBalance = arweave.airdropAR(arweaveAccount, 1);
    setArweaveBalance(newBalance + '');
  }

  async function addSol() {
    const connection = solana.getConnection();
    const newAmount = 1 * LAMPORTS_PER_SOL;
    const signature = await connection.requestAirdrop(new PublicKey(solanaAccount), newAmount);
    await connection.confirmTransaction(signature, 'finalized');
    setSolanaBalance(newAmount);
  }

  const [metadataUrl, setMetadataUrl] = useState<string>();
  const [solanaAccount] = solana.useAccountAddress();
  const [solanaBalance, setSolanaBalance] = solana.useAccountBalance();
  const arweaveBalance = arweave.useAccountBalance();
  const setArweaveBalance = arweave.useSetAccountBalance();
  const [arweaveAddress] = arweave.useAccountAddress();
  const [arweaveNetworkStatus] = arweave.useNetworkStatus();
  const auctionsProgress = useAuctionsProgress();
  const arweaveIsConnected = arweaveNetworkStatus === 'CONNECTED';
  const arweaveAccount = arweaveIsConnected ? arweaveAddress : undefined;

  const isSolanaDevnet = configs.solanaCluster.includes('devnet');
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
                    </div>
                    {solanaAccount && <RiFileCopyLine />}
                  </div>
                  <div className={styles.accountBalance}>
                    Balance: {solBalance}{' '}
                    {solanaBalance && isSolanaDevnet && (
                      <RiAddCircleLine onClick={addSol} className={styles.addFunds} />
                    )}
                  </div>
                </div>
                <div className={styles.accountInfo}>
                  <div className={styles.accountAddress}>
                    <div>Arweave: {arweaveAccount}</div> {arweaveAccount && <RiFileCopyLine />}
                  </div>
                  <div className={styles.accountBalance}>
                    Balance: {arBalance}{' '}
                    {arBalance && isUsingLocalArweave && (
                      <RiAddCircleLine onClick={addAR} className={styles.addFunds} />
                    )}
                  </div>
                </div>
              </div>
              <h2>Primary</h2>
              <UploadAssetsForm setMetadataUrl={setMetadataUrl} />
            </Col>
            <Col start={15} end={24}>
              <MintNFTForm metadataUrl={metadataUrl} />
            </Col>
          </Grid>
        </div>
        <div className={styles.section}>
          <Grid>
            <Col start={2} end={13}>
              <h3>Create the auction</h3>
              <CreateAuctionForm />
            </Col>
            <Col start={15} end={24}>
              <h3>Create DAO Proposal</h3>
              <CreateProposalForm />
            </Col>
          </Grid>
        </div>
        <div className={styles.section}>
          <Grid>
            <Col start={2} end={-2}>
              <Tokens auctionsProgress={auctionsProgress as AuctionItemProgress[]} />
            </Col>
          </Grid>
        </div>
        <div className={styles.section}>
          <Grid>
            <Col start={2} end={-2}>
              <Store />
            </Col>
          </Grid>
        </div>
        <div className={styles.section}>
          <Grid>
            <Col start={2} end={-2}>
              <Serializer />
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
