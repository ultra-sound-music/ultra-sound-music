import phantomLogo from '@usm/assets/img/phantom_purple.svg';

import Modal from '../../Modal/Modal';
import Button from '../../Button/Button';
import Image from '../../Image/Image';
import Link from '../../Link/Link';

import styles from './ConnectModal.scss';

export interface IConnectModalProps {
  isOpen: boolean;
  onConnect?(): void;
  onHide?(): void;
}

export function ConnectModal({ isOpen, onConnect, onHide }: IConnectModalProps) {
  return (
    <Modal isOpen={isOpen} onHide={onHide} withCloseButton={false} withCloseX={false}>
      <Button
        type='primary'
        isSmall={false}
        isFullWidth={true}
        shape='tile'
        image={<Image src={phantomLogo} />}
        subtext='Connect with a browser extension'
        onClick={onConnect}
      >
        Phantom
      </Button>
      <Link to='https://phantom.app/download' className={styles.walletLink}>
        Get Phantom
      </Link>
    </Modal>
  );
}

export default ConnectModal;
