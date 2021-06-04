import React  from 'react';
import PropTypes from 'prop-types';

import Search from './Search';
import Entities from './Entities';

export class Searchable extends React.Component {
  static propTypes = {
    onlyOwned: PropTypes.bool,
    currentAccountId: PropTypes.string,
    entities: PropTypes.array,
    updateTransactionHash: PropTypes.func
  };

  state = {
    isFiltered: false,
    filteredEntities: []
  }

  setFilteredEntities(entities) {
    this.setState({
      isFiltered: !!entities,
      filteredEntities: entities || []
    })
  }

  onChange = (search) => {
    this.filterEntities(search);
  }

  onClear = () => {
    this.setFilteredEntities();
  }

  filterEntities(filter) {
    const entities = this.props.entities.filter((entity) => {
      return Object.values(entity).join(' ').includes(filter);
    })

    this.setFilteredEntities(entities);
  }

  render() {
    const entities = this.state.isFiltered ? this.state.filteredEntities : this.props.entities;

    return (
      <div className="Searchable">
        <Search onChange={this.onChange} onClear={this.onClear} />
        <Entities entities={entities} currentAccountId={this.props.currentAccountId} updateTransactionHash={this.props.updateTransactionHash}/>
      </div>      
    );
  }
}

export default Searchable;