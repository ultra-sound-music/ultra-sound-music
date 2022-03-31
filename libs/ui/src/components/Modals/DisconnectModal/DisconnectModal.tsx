import Modal from '../../Modal/Modal';
import Button from '../../Button/Button';

export interface IDisconnectModalProps {
  isOpen: boolean;
  onDisconnect?(): void;
  onHide?(): void;
}

export function DisconnectModal({ isOpen, onDisconnect, onHide }: IDisconnectModalProps) {
  return (
    <Modal isOpen={isOpen} onHide={onHide} withCloseButton={false} withCloseX={false}>
      <Button type='primary' onClick={onDisconnect} isFullWidth={true}>
        Disconnect
      </Button>
    </Modal>
  );
}

export default DisconnectModal;
