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
interface MainMenuState {
    items: MainMenuItem[];
}
export class MainMenu extends React.Component<MainMenuProperties> {
    state: MainMenuState;
    constructor(props: MainMenuProperties | Readonly<MainMenuProperties>){
        super(props)
        this.state = {
            items: props.items,
        }

        /* setInterval(()=> {
            const novaLista = [... this.state.items];
            novaLista.push(new MainMenuItem("naslov", "/link"));
            this.setItems(novaLista);
        }, 2000); */
    }
/* Kada god dođe do poziva setItems  */
    setItems(items: MainMenuItem[]){
        /* i kada god se setuje novi state tj. novi items */
        /* tog trenutka gdje god se goristi state.items doći do promjene */
        this.setState({
            items: items
        })
    }
    
    render() {
        return ( 
            <Container>
            <Nav variant="tabs">
                {this.state.items.map(this.makeNavLink)}

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