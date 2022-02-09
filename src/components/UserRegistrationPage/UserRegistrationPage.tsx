import React from 'react';
import { Container, Col, Card, Form, Button, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faCheck, faLaughBeam, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import api, { ApiResponse } from '../../API/api';
import Alert from '@mui/material/Alert';
import { AlertTitle } from '@mui/material';

interface UserRegistrationPageState {
    formData:{
        email: string;
        password: string;
        forename: string;
        surname: string;
        phone: string;
        address: string;
    };
    message?: string;
    isRegistrationComplete: boolean;
}
 
export class UserRegistrationPage extends React.Component {
    state: UserRegistrationPageState;

    constructor(props: Readonly<{}>) {
        super(props);

        this.state = {
            isRegistrationComplete: false,
            formData: {
                email: '',
                password: '',
                forename: '',
                surname: '',
                phone: '',
                address: '',
            },
        };
    }

    private formInputChanged(event: React.ChangeEvent<HTMLInputElement>) {
        const newFormData = Object.assign(this.state.formData, {
            [ event.target.id ]: event.target.value,
        });

        const newState = Object.assign(this.state, {
            formData: newFormData,
        });

        this.setState(newState);
    }

  render() {
      return (
          <Container>
              <Col md={ {span: 8, offset: 2}}>
                  <Card.Body>
                      <Card.Title>
                          <FontAwesomeIcon icon= { faUserPlus } /> User registration
                      </Card.Title>
                      {
                          (this.state.isRegistrationComplete === false) ? 
                          this.renderForm():
                          this.renderRegistrationCompleteMessage()
                      }
                  </Card.Body>
              </Col>
          </Container>
      )
    }

    private renderForm() {
        return (
            <>
                <Form>
                    <Row>
                        <Col md="6">
                            <Form.Group>
                                <Form.Label htmlFor="email">E-mail:</Form.Label>
                                <Form.Control type="email" id="email"
                                            value={ this.state.formData.email }
                                            onChange={ event => this.formInputChanged(event as any) } />
                            </Form.Group>
                        </Col>

                        <Col md="6">
                            <Form.Group>
                                <Form.Label htmlFor="password">Password:</Form.Label>
                                <Form.Control type="password" id="password"
                                                value={ this.state.formData.password }
                                                onChange={ event => this.formInputChanged(event as any) } />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md="6">
                            <Form.Group>
                                <Form.Label htmlFor="forename">Forename:</Form.Label>
                                <Form.Control type="text" id="forename"
                                            value={ this.state.formData.forename }
                                            onChange={ event => this.formInputChanged(event as any) } />
                            </Form.Group>
                        </Col>

                        <Col md="6">
                            <Form.Group>
                                <Form.Label htmlFor="surname">Surname:</Form.Label>
                                <Form.Control type="text" id="surname"
                                            value={ this.state.formData.surname }
                                            onChange={ event => this.formInputChanged(event as any) } />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group>
                        <Form.Label htmlFor="phone">Phone number:</Form.Label>
                        <Form.Control type="phone" id="phone"
                                      value={ this.state.formData.phone }
                                      onChange={ event => this.formInputChanged(event as any) } />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label htmlFor="address">Address:</Form.Label>
                        <Form.Control id="address"
                                      as="textarea" rows={ 4 }
                                      value={ this.state.formData.address }
                                      onChange={ event => this.formInputChanged(event as any) } />
                    </Form.Group>

                    <Form.Group>
                        <Button variant="primary"
                                style={{marginTop:15}}
                                onClick={ () => this.doRegister() }>
                                    <i className="bi bi-plus-circle" style={{marginRight:4}}></i> 
                            Register
                        </Button>
                    </Form.Group>
                </Form>
            <Alert severity="error"
                    style={{marginTop:15}}
                    className={ this.state.message? '' : 'd-none' }>
                {/* <i className="bi bi-exclamation-circle-fill"></i> */}  { this.state.message }
            </Alert>
            
            </>
        );
    }
    
    private renderRegistrationCompleteMessage(){
        return (
            <>
            <Alert severity="success"> 
            <AlertTitle> <FontAwesomeIcon icon={ faLaughBeam } /> Bravo</AlertTitle>
                <p>
                    <FontAwesomeIcon icon={ faCheck } /> The account has been registered. <br />
                    <FontAwesomeIcon icon={ faAngleRight } /> <Link to='/user/login' className='alert-link'>Click here </Link> to go to the login page.
                </p>
            </Alert>
            </>
        )
    }

    private doRegister() {
        const data = {
            email: this.state.formData?.email,
            password: this.state.formData?.password,
            forename: this.state.formData?.forename,
            surename: this.state.formData?.surname,
            phoneNumber: this.state.formData?.phone,
            postalAddress: this.state.formData?.address,
        };

        api('auth/user/register/', 'post', data)
        .then((res: ApiResponse) => {
            console.log(res);

            if (res.status === 'error') {
                this.setErrorMessage('System error... Try again!');
                return;
            }

            if ( res.data.statusCode !== undefined ) {
                this.handleErrors(res.data);
                return;
            }

            this.registrationComplete();
        })
    }

    private setErrorMessage(message: string) {
    const newState = Object.assign(this.state, {
        message: message,
    });

    this.setState(newState);
    } 

    private handleErrors(data: any) {
    let message = '';

    switch (data.statusCode) {
        case -6001: message = 'This account already exists!'; break;
    }

    this.setErrorMessage(message);
    }

    private registrationComplete() {
        const newState = Object.assign(this.state, {
            isRegistrationComplete: true,
        });

        this.setState(newState);
    }
}



