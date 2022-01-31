import React from 'react';
import { Container, Card, Form, Button, Col, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import api, { ApiResponse, saveToken, saveRefreshToken } from '../../API/api'
import { Redirect } from 'react-router-dom';
import './UserLoginPage.css';

interface UserLoginPageState {
    email: string;
    password: string;
    errorMessage: string;
    isLoggedIn: boolean;
}

export default class UserLoginPage extends React.Component {
    state: UserLoginPageState;

    constructor(props: Readonly<{}>) {
        super(props);

        this.state = {
            email: '',
            password: '',
            errorMessage: '',
            isLoggedIn: false,
        }
    }

    private formInputChanged(event: React.ChangeEvent<HTMLInputElement>) {
        const newState = Object.assign(this.state, {
            [ event.target.id ]: event.target.value,
        });

        this.setState(newState);
    }

    private setErrorMessage(message: string) {
        const newState = Object.assign(this.state, {
            errorMessage: message,
        });

        this.setState(newState);
    }

    private setLogginState(isLoggedIn: boolean) {
        const newState = Object.assign(this.state, {
            isLoggedIn: isLoggedIn,
        });

        this.setState(newState);
    }

    private doLogin() {
        api(
            'auth/user/login',
            'post',
            {
                email: this.state.email,
                password: this.state.password,
            }
        )
        .then((res: ApiResponse) => {
            if (res.status === 'error') {
                this.setErrorMessage('System error... Try again!');

                return;
            }

            if (res.status === 'ok') {
                if ( res.data.statusCode !== undefined ) {
                    let message = '';

                    switch (res.data.statusCode) {
                        case -3001: message = 'Unkwnon e-mail!'; break;
                        case -3002: message = 'Bad password!'; break;
                    }

                    this.setErrorMessage(message);

                    return;
                }

                saveToken(res.data.token);
                saveRefreshToken(res.data.refreshToken);

                this.setLogginState(true);
            }
        });
    }

  render() {
    if(this.state.isLoggedIn === true){
      return <Redirect to='/' />
    }
     return (
              <Container>
                <Col md = {{span: 6, offset: 3}}>
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
                            <Form.Control 
                            className='input form-control'
                            type='email' 
                            id="email" 
                            value={ this.state.email }
                            onChange={ event => this.formInputChanged(event as any)}

                            aria-describedby="emailHelp" 
                            placeholder="E-mail" required />
                        </Form.Group>
                        <Form.Group className='input-group'>
                            <Form.Control 
                            type="password" 
                            id="password" 
                            value={ this.state.password }
                            onChange={event => this.formInputChanged(event as any)}
                            className='input form-control' 
                            placeholder="Lozinka" required/>
                        </Form.Group>
                        <Form.Group>
                          <Button 
                            className='btn btn-secondary' 
                            onClick={() => this.doLogin()}
                            type="submit">Prijavi se
                          </Button>
                        </Form.Group>              
                      </Form>
                    </Card.Text>
                    <Alert 
                    variant='danger'
                    className={this.state.errorMessage ? '' : 'd-none'}>
                      {this.state.errorMessage}
                    </Alert>
                  </Card.Body>
                </Card>
                </Col>
              </Container>
  ); 
  }
}
