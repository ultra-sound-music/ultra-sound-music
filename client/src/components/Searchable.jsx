import React  from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as Selectors from '../redux/selectors';
import TokenCards from './Tokens/TokenCards';

export class Searchable extends React.Component {
  static propTypes = {
    tokenIds: PropTypes.arrayOf(PropTypes.number)
  };

  render() {
    return (
      <div className="Searchable">
        <TokenCards tokenIds={this.props.tokenIds} />
      </div>      
    );
  }
}

export function mapStateToProps(state) {
  return {
    tokenIds: Selectors.usm.selectTokenIds(state)
  }
}

export default connect(mapStateToProps)(Searchable);