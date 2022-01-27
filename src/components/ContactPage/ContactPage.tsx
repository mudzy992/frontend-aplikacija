import React from 'react';
import './ContactPage.css';
import { Card, Container } from 'react-bootstrap'
import { faPhone } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class ContactPage extends React.Component{
  render() {
     return (
    <Container className='container'>
      <Card className="text-white bg-success">
        <Card.Header>
          <Card.Title>
            <FontAwesomeIcon icon={faPhone}/> Contact details
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <Card.Text>
            Kontakt podaci
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  ); 
  }
}
