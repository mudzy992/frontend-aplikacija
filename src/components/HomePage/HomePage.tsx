import React from 'react';
import './HomePage.css';
import { Card, Container } from 'react-bootstrap'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function HomePage() {
  return (
    <Container>
    <Card className="text-white bg-dark">
      <Card.Header>
        <Card.Title>
        <FontAwesomeIcon icon={faHome}/> Home
        </Card.Title>
      </Card.Header>
      <Card.Body>
        <Card.Text>
          Naslovna stranica
        </Card.Text>
      </Card.Body>
    </Card>
    </Container>
  );
}

export default HomePage;
