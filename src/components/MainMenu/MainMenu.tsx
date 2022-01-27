import React from "react";
import { Container, Nav } from "react-bootstrap";

export class MainManu extends React.Component {
    render() {
        return ( 
            <Container>
            <Nav variant="tabs">
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="/contact">Contact</Nav.Link>
                <Nav.Link href="/login">Log in</Nav.Link>
            </Nav>
            </Container>
        )
    }
}

/* Standardna jedna metoda kreiranja komponente */
/* Importi, export klase s nazivom, proširena sa React.Componentom, obavezni render i bubaš kod */