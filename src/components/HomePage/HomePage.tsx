import React from 'react';
import './HomePage.css';
import { Card, Col, Container, Row } from 'react-bootstrap'
import { faListAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CategoryType from '../../types/CategoryType';
import { Link, Redirect } from 'react-router-dom';
import api, { ApiResponse } from '../../API/api'
import { ApiConfig } from '../../config/api.config';


/* Pravimo state onoga što zahtjevamo od našeg backend-a */
interface HomePageState {
  isUserLoggedIn: boolean;
  categories: CategoryType[];
}

/* Podaci sa kojima radimo, ono što ćemo dobiti*/
interface ApiCategoryDto {
  categoryId: number;
  name: string;
  imagePath: string;
}

class HomePage extends React.Component {

  /* Nakon što smo napravili state iznad, definišemo da je naša komponenta zahtjevana tim našim state-om */
  state: HomePageState;
  /* Kada smo rekli da je definisano tim našim state-om, moramo napravi konstruktor, u kojem ćemo prvo
  uzeti sve properties (props), te ih proslijediti super konstruktoru te naše React komponente */
  constructor(props: Readonly<{}>){
    super(props);

    this.state = {
      /* i inicijalizirati taj naš state */
      isUserLoggedIn: true,
      categories: []  
    }
  }
  /* Pozivanje funkcije getCategories ne treba pozivati u trenutku kada se formira konstruktor
  već je pozivamo onda kada znamo da je vrijeme da ona bude prikazana, tj. da li nakon što korisnik
  refrešuje stranicu, ili kada znamo da će sasvim sigurno biti ugrađena negdje */
  componentDidMount(){
    this.getCategories();
  }
  /* ili kada je refrešovana stranica ovo je zakomentarisano, stvara dosta zahtjeva*/
/*   componentDidUpdate(){
    this.getCategories();
  } */
  /* Nakon što sam definisao izgled dopremanja podataka, pravim metod za 
  preuzimanje iz baze/backend, i ta funkcija treba da bude pozvana u state */
  private getCategories(){
    /* ova funkcija koristi našu funkciju api koju smo već ranije definisali što ona treba da sadrži
    tj. ona zahtjeva path, metod, tijelo */
    api('api/category/', 'get', {})
    /* Nakon toga možemo da hvatamo error-e */
    .then((res: ApiResponse) => {
      if(res.status === "error" || res.status === "login"){
        this.setUserLoggedState(false)
        return;
      }
      /* Nakon što smo uhvatili error treba da uzmemo sve podatke koji su smješteni u res.data 
      i da ih transformišemo u oblik s kojim radi naša aplikacija, smjestiti ih u neki metod*/
      this.putCategoriesInState(res.data)
    })
  }
  /* Metod uz pomoć kojeg transformišemo res.data u objekat s kojim radi naša aplikacija */
  private putCategoriesInState(data: ApiCategoryDto[]){
    /* Pravimo novu listu categories. Tu listu dobijamo tako što uzimamo naš data
    (koji smo već definisali da je niz neki objekata, koje smo definisali iznad (podaci s kojima radimo))
    i njega mapiramo, tako što uzimamo jednu po jednu kategoriji, i za svaku od tih kategorija što 
    smo dobili vraćamo nazad jedan rezultat
     */
    const categories: CategoryType[] = data.map(category => {
       return {
         categoryId: category.categoryId,
         name: category.name,
         image: category.imagePath,
         items: [],
       }
    })
    /* Nakon što smo napravili listu kategorija, treba da je setujem u state.
    A to ćemo uraditi tako što ćemo napraviti konstatu pod nazivom nekim, te pravimo objekat
    kojem assign-ujemo nad trenutni state vrijednost pod categories upisujemo vrijednoti te naše liste*/
    const newState = Object.assign(this.state, {
      categories: categories
    })
    this.setState(newState)
  }
  /* Metod uz pomoć kojeg hvatamo grešku da li je korisnik logovan ili ne */
  private setUserLoggedState(isUserLogged: boolean) {
    const newState = Object.assign(this.state, {
      isUserLoggedIn: isUserLogged,
    });

    this.setState(newState);
  }
  render (){
    /* Ako korisnik nije ulogovan, tj. ako je isUserLoggedIn state false, preusmjeriti ga na login */
    if (this.state.isUserLoggedIn === false) {
      return (
          <Redirect to="/user/login/" />
      );
    }
    return (
        <Container>
            <Card className="text-white bg-dark">
            <Card.Body>
                <Card.Header>
                    <Card.Title>
                        <FontAwesomeIcon icon={faListAlt}/> Top level categories
                    </Card.Title>
                </Card.Header>
                  <Row>
                        {/* Ako je korisnik ulogovan, prikazati spisak kategorija 
                        to smo uradili tako što smo mapirali jednu funkciju ispod*/}
                        {this.state.categories.map(this.singleCategory)}
                  </Row>
                </Card.Body>
            </Card>
        </Container>
    );
  }
  private singleCategory(category: CategoryType){
    return(
      /* Ono kako želimo da prikažemo kategoriju (dizajn) */
      <Col lg="3" md="4" sm="6" xs="12">
        <Card className="text-dark bg-light mb-3">
          <Card.Header>
            <Card.Title>
              {category.name}
            </Card.Title>
          </Card.Header>
            <Card.Body>
              Ovjde će ići slika zvao se ja mudzy ili ne
            {/* <Card.Img variant="top" src={ApiConfig.PHOTO_PATH + `${category.image}`} /> */}
            </Card.Body>
            <Card.Footer>
             <small><Link to={`/category/${category.categoryId}`}
              /* className='btn btn-primary btn-block btn-sm' */>Prikaži kategoriju</Link></small> 
          </Card.Footer>
        </Card>
      </Col>
    )
  }
}

export default HomePage;
