import phantomLogo from '@usm/assets/img/phantom_purple.svg';

import Modal from '../../Modal/Modal';
import Button from '../../Button/Button';
import Image from '../../Image/Image';
import Link from '../../Link/Link';

import styles from './ConnectModal.scss';

export interface IConnectModalProps {
  isOpen: boolean;
  hasWallet?: boolean;
  onConnect?(): void;
  onHide?(): void;
}

export function ConnectModal({ isOpen, hasWallet, onConnect, onHide }: IConnectModalProps) {
  const content = hasWallet ? (
    <Button
      type='primary'
      isSmall={false}
      isFullWidth={true}
      shape='tile'
      image={<Image src={phantomLogo} />}
      onClick={onConnect}
    >
      Phantom
    </Button>
  ) : (
    <Button
      type='primary'
      to='https://phantom.app/download'
      isExternal={true}
      isSmall={false}
      isFullWidth={true}
      shape='tile'
      image={<Image src={phantomLogo} />}
      subtext='Install Phantom'
    ></Button>
  );

  const text = hasWallet
    ? 'Connect with your Solana Phantom wallet to continue'
    : 'You will need the Solana Phantom wallet to continue';

  return (
    <Modal isOpen={isOpen} onHide={onHide} withCloseButton={false} withCloseX={false}>
      {content}
      <div className={styles.text}>{text}</div>
    </Modal>
  );
}

export default ConnectModal;
