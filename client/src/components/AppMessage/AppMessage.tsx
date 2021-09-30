import React from 'react';
import { connect } from 'react-redux';

import { Message } from '@uiComponents';
import { IRootState } from '@store/types';
import ui from '@store/ui';

export type TAppMessageProps = IAppMessageState & IAppMessageAction;

export interface IAppMessageState {
  isOpen: boolean;
  title: React.ReactNode;
  message: React.ReactNode;
  timeout: number;
}

export interface IAppMessageAction {
  hide: () => void;
}

export const AppMessage = ({
  isOpen,
  title,
  message,
  timeout,
  hide
}: TAppMessageProps): JSX.Element => {
  return (
    <Message
      isOpen={isOpen}
      title={title}
      message={message}
      onHide={hide}
      timeout={timeout}
    />
  );
};

export function mapState(state: IRootState): IAppMessageState {
  return {
    isOpen: ui.selectors.isAppMessageOpen(state),
    title: ui.selectors.getAppMessageTitle(state),
    message: ui.selectors.getAppMessageMessage(state),
    timeout: ui.selectors.getAppMessageTimeout(state)
  };
}

export const mapActions: IAppMessageAction = {
  hide: ui.actions.hideAppMessage
};

export default connect(mapState, mapActions)(AppMessage);
