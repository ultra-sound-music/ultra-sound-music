import React  from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as Selectors from '../redux/selectors';
import Search from './Search';
import Tokens from './Tokens/Tokens';

export class Searchable extends React.Component {
  static propTypes = {
    tokenIds: PropTypes.arrayOf(PropTypes.number)
  };

  render() {
    return (
      <div className="Searchable">
        <Search onChange={this.onChange} onClear={this.onClear} />
        <Tokens tokenIds={this.props.tokenIds} />
      </div>      
    );
  }
}

export function mapStateToProps(state) {
  return {
    tokenIds: Selectors.tokens.selectTokenIds(state)
  }
}

export default connect(mapStateToProps)(Searchable);