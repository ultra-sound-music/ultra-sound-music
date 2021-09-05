import React from 'react';
import PropTypes from 'prop-types';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import debounce from 'lodash/debounce';

import './Search.scss';

export class Search extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    onClear: PropTypes.func
  };

  state = {
    searchStr: ''
  };

  onChange = ({ target }) => {
    this.setState({
      searchStr: target.value
    });

    this.props.onChange(target.value);
  };

  onClear = () => {
    this.setState({
      searchStr: ''
    });

    this.props.onClear();
  };

  render() {
    return (
      <InputGroup className='mb-3'>
        <FormControl
          value={this.state.searchStr}
          onChange={this.onChange}
          placeholder='Artist, Band, Track'
          aria-label='Artist, Band, Track'
          aria-describedby='basic-addon2'
        />
        <InputGroup.Append>
          <InputGroup.Text onClick={this.onClear}>Clear</InputGroup.Text>
        </InputGroup.Append>
      </InputGroup>
    );
  }
}

export default Search;
