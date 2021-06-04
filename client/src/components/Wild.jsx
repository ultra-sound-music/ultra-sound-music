import React  from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Search from './Search';
import Entities from './Entities';

export class Wild extends React.Component {
  render() {
    return (
      <div className="Wild">
        <Search />
        <Navbar bg="light" expand="lg">
          <Nav.Link>Artists</Nav.Link>
          <Nav.Link>Bands</Nav.Link>
          <Nav.Link>Tracks</Nav.Link>
        </Navbar>
        <Entities />
      </div>
    );    
  }
}

export default Wild;