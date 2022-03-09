import { useRecoilValue } from 'recoil';

import { Modal as ModalBase, BidModal } from '@usm/ui';
import { modalState, useHideModal } from '@usm/app-state';

const modalMap = {
  base: ModalBase,
  bidModal: BidModal
};

export function Modal() {
  const hideModal = useHideModal();
  const { type, isOpen, ...modalProps } = useRecoilValue(modalState);
  const ModalComponent = type ? modalMap[type] || ModalBase : ModalBase;

  return (
    <ModalComponent {...modalProps} isOpen={!!isOpen} onHide={hideModal} />
  );
}

export default Modal;
