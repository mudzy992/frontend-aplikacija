import React from "react";
import { Container, Nav } from "react-bootstrap";

export class MainMenuItem {
    text: string = "";
    link: string = "#";

    constructor(text: string, link: string){
        this.text = text;
        this.link = link;
    }
}

interface MainMenuProperties {
    items: MainMenuItem[];
}

export class MainMenu extends React.Component<MainMenuProperties> {
    render() {
        return ( 
            <Container>
            <Nav variant="tabs">
                {this.props.items.map(this.makeNavLink)}
               {/*  { this.props.items.map(item => {
                    return(
                        <Nav.Link href={item.link}>{item.text}</Nav.Link>
                    )
                })} */}
            </Nav>
            </Container>
        )
    }
    /* a može i ova varijanta */
    private makeNavLink(item: MainMenuItem){
        return(
            <Nav.Link href={item.link}>{item.text}</Nav.Link>
        )
    }
}

/* Standardna jedna metoda kreiranja komponente */
/* Importi, export klase s nazivom, proširena sa React.Componentom, obavezni render i bubaš kod */