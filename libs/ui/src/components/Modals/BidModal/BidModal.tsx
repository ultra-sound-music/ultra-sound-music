import { ReactNode } from 'react';

import Avatar from '../../Avatar/Avatar';
import Modal, { IModalProps } from '../../Modal/Modal';

import styles from './BidModal.scss';

export interface IBidModalProps {
  isOpen: boolean;
  title?: React.ReactNode;
  body?: ReactNode;
  fieldImage?: string;
  fieldValue?: ReactNode;
  fieldContext?: ReactNode;
  onHide?(): void;
}

export function BidModal({
  isOpen,
  title,
  body,
  fieldImage,
  fieldValue,
  fieldContext,
  onHide
}: IBidModalProps) {
  return (
    <Modal isOpen={isOpen} onHide={onHide} withCloseX={false}>
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
