import React from 'react';
import './UserLoginPage.css';
import { Button, Card, Container, Form, Tooltip } from 'react-bootstrap'
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


export default class UserLoginPage extends React.Component{
  render() {
     return (
    <Container>
      <Card className="text-white bg-info">
        <Card.Header>
        <Card.Title>
            <FontAwesomeIcon icon={faSignInAlt}/> Korisnička prijava
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <Card.Text>
            <Form className="needs-validation">
              <Form.Group>
                <Form.Control type='email' className='input form-control' id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="E-mail" required/>
              </Form.Group>
              <Form.Group className='input-group'>
                <Form.Control className='input form-control' type="password" id="exampleInputPassword1" placeholder="Lozinka" required/>

              </Form.Group>
              <Button className='btn btn-secondary' type="submit">Prijavi se</Button>
            </Form>
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  ); 
  }
}
