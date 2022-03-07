import { ReactNode } from 'react';

import Avatar from '../../Avatar/Avatar';
import Modal, { IModalProps } from '../../Modal/Modal';

import styles from './BidModal.scss';

export interface IBidModalProps {
  isOpen: boolean;
  title: string;
  body: ReactNode;
  fieldImage: string;
  fieldValue: ReactNode;
  fieldContext: ReactNode;
}

export function BidModal({
  isOpen,
  title,
  body,
  fieldImage,
  fieldValue,
  fieldContext
}: IBidModalProps) {
  return (
    <Modal isOpen={isOpen} withCloseX={false}>
      <div className={styles.title}>{title}</div>
      <div className={styles.body}>{body}</div>
      <div className={styles.field}>
        <Avatar src={fieldImage} size='small' withPadding={true} />
        <div className={styles.value}>{fieldValue}</div>
        <div className={styles.context}>{fieldContext}</div>
      </div>
    </Modal>
  );
}

export default BidModal;
