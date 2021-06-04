import React  from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

export class Artists extends React.Component {
  renderArtists = () => {
    const artists = Array.from(Array(20));
    return artists.map((item, index) => {
      return (
        <Card key={index} style={{ width: '18rem' }}>
          <Card.Img variant="top" src="holder.js/100px180" />
          <Card.Body>
            <Card.Title>Card Title</Card.Title>
            <Card.Text>Some quick example text to build on the card title and make up the bulk of the card&apos;s content.</Card.Text>
            <Button variant="primary">Go somewhere</Button>
          </Card.Body>
        </Card>        
      )
    });
  }

  render() {
    return (
      <div>
        {this.renderArtists()}
      </div>
    );    
  }
}

export default Artists;