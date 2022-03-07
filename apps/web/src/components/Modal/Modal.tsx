import { useRecoilValue } from 'recoil';

import { Modal as ModalUi } from '@usm/ui';
import { modalState, useModal } from '@usm/app-state';

export function Modal() {
  const { hideModal } = useModal();
  const { body, isOpen, ...modalProps } = useRecoilValue(modalState);

  return (
    <ModalUi {...modalProps} isOpen={!!isOpen} onHide={hideModal}>
      {body}
    </ModalUi>
  );
}

export default Modal;
