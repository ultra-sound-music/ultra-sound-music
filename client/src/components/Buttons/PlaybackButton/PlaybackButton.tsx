import React from 'react';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';

import { IRootState } from '@store/types';
import { Button } from '@uiComponents';
import playback from '@store/playback';

export type TPlaybackButtonProps = IPlaybackButtonOwnProps &
  IPlaybackButtonProps &
  IPlaybackButtonActions;

export interface IPlaybackButtonProps {
  isEntityPlaying: boolean;
  entityId: string;
}

export interface IPlaybackButtonOwnProps {
  entityId: string;
}

export interface IPlaybackButtonActions {
  play: (a: Record<'entityId', unknown>) => void;
  stop: () => void;
}

export class PlaybackButton extends React.Component<TPlaybackButtonProps> {
  onClick = (): void => {
    if (this.props.isEntityPlaying) {
      this.props.stop();
    } else {
      this.props.play({ entityId: this.props.entityId });
    }
  };

  renderButtonText(): string {
    return this.props.isEntityPlaying ? 'stop' : 'play';
  }

  render(): JSX.Element {
    return (
      <Button onClick={debounce(this.onClick, 300)}>
        {this.renderButtonText()}
      </Button>
    );
  }
}

export function mapStateToProps(
  state: IRootState,
  { entityId }: IPlaybackButtonOwnProps
): IPlaybackButtonProps {
  return {
    entityId,
    isEntityPlaying:
      entityId && playback.selectors.selectActiveSource(state) === entityId
  };
}

export const mapDispatchToProps: IPlaybackButtonActions = {
  play: playback.actions.play,
  stop: playback.actions.stop
};

export default connect(mapStateToProps, mapDispatchToProps)(PlaybackButton);
