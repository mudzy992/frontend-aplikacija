import React from 'react';
import './UserLoginPage.css';
import { Card, Container } from 'react-bootstrap'
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class UserLoginPage extends React.Component{
  render() {
     return (
    <Container>
      <Card>
        <Card.Body>
          <Card.Title>
            <FontAwesomeIcon icon={faSignInAlt}/> User Login
          </Card.Title>
          <Card.Text>
            Formilari za login
          </Card.Text>
        </Card.Body>
      </Card>
      
    </Container>
  ); 
  }
}
