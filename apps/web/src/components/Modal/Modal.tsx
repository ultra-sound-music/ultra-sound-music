import { useRecoilValue } from 'recoil';

import { Modal as ModalComponent } from '@usm/ui';
import { modal, useModal } from '@usm/app-state';

import './Modal.scss';

/* eslint-disable-next-line */
export interface ModalProps {}

export function Modal(props: ModalProps) {
  const { hideModal } = useModal();
  const modalState = useRecoilValue(modal);
  const isOpen = modalState.isVisible;

  return (
    <ModalComponent
      {...modalState}
      isOpen={!!isOpen}
      ctaButton={modalState.cta}
      onHide={hideModal}
    >
      {modalState.body}
    </ModalComponent>
  );
}

export default Modal;
