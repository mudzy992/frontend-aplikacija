import { faListAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@mui/material';
import Alert from '@mui/material/Alert';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import React from 'react';
import { Card, Col, Container, ListGroup, ListGroupItem, Row } from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';
import api, { ApiResponse } from '../../API/api';
import { ApiConfig } from '../../config/api.config';
import ArticleType from '../../types/ArticleType';
import CategoryType from '../../types/CategoryType';

interface CategoryPageProperties {
    match: {
        params: {
            /* kako se parametar zove u ruti, tako ga treba i ovdje definisati i njegov tip */
            cId: number;
        }
    }
}

interface CategoryPageState {
    category?: CategoryType;
    subcategories?: CategoryType[];
    articles?: ArticleType[];
    isUserLoggedIn: boolean;
    message: string;
}

interface CategoryDto {
    categoryId: number;
    name: string;
}

interface ArticleDto {
    articleId: number;
    name: string;
    excerpt?: string;
    description?: string;
    articlePrices?: {
        price: number;
        createdAt: string;  
    }[],
    photos?: {
        imagePath: string;
    }[],
}

export default class CategoryPage extends React.Component<CategoryPageProperties> {
    state : CategoryPageState;
    constructor(props: Readonly<CategoryPageProperties>){
        super(props);
        this.state = {
            isUserLoggedIn: true,
            message: "",
        }
    }

    private setUserLoggedState(isUserLogged: boolean) {
        this.setState(Object.assign(this.state, {
            isUserLoggedIn: isUserLogged,
        }));
    }

    private setErrorMessage(message: string) {
        this.setState(Object.assign(this.state, {
            message: message,
        }));
    }

    private setCategoryData(category: CategoryType) {
        this.setState(Object.assign(this.state, {
            category: category,
        }));
    }

    private setSubcategories(subcategories: CategoryType[]) {
        this.setState(Object.assign(this.state, {
            subcategories: subcategories,
        }));
    }

    private setArticles(articles: ArticleType[]) {
        this.setState(Object.assign(this.state, {
            articles: articles,
        }));
    }

    render() {
        if (this.state.isUserLoggedIn === false) {
            return (
                <Redirect to="/user/login/" />
            );
          }
        return (
            <>
            <Container>
                <Card className="text-white bg-dark">
                    <Card.Header>
                        <Card.Title>
                            <FontAwesomeIcon icon={faListAlt}/> {this.state.category?.name}
                        </Card.Title>
                    </Card.Header>
                <Card.Body>
                    <Card.Text>
                        { this.printErrorMessage () }
                        { this.showSubcategories() }
                        { this.showArticles() }

                    </Card.Text>
                </Card.Body>
                
                </Card>
            </Container>
            </>
        )
    }
    private printErrorMessage() {
        if(this.state.message === "") {
            return;
        }
        return (
            <Alert severity="error"
                    style={{marginTop:15}}
                    className={ this.state.message ? '' : 'd-none' }>
                    {/* <i className="bi bi-exclamation-circle-fill"></i>  */}{ this.state.message }
            </Alert>
        )
    } 

    private showSubcategories() {
        if (this.state.subcategories?.length === 0) {
            return;
        }
        return (
            <Row>
                { this.state.subcategories?.map(this.singleCategory) }
            </Row>
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
                        className='btn btn-primary btn-block btn-sm'>Prikaži kategoriju</Link></small> 
                    </Card.Footer>
                </Card>
            </Col>
        )
    }

    private showArticles() {
        if (this.state.articles?.length === 0) {
            return (
                <div>There are now articles in this category.</div>
            )
        }
        return (
            <Row>
                { this.state.articles?.map(this.singleArticle) }
            </Row>
        );
    }

    private singleArticle(article: ArticleType){
        return(
            /* Ono kako želimo da prikažemo kategoriju (dizajn) */
            <Col lg="4" md="6" sm="6" xs="12">
                <Card className="text-dark bg-light mb-3">
                    <Card.Img variant="top" src={ApiConfig.PHOTO_PATH + 'small/' + article.imageUrl} className="w-100"/>
                        <Card.Body>
                            <Card.Title>
                                {article.name}
                            </Card.Title>
                            <ListGroup className="list-group-flush">
                                <ListGroupItem> <strong>Excerpt:</strong> {article.excerpt}</ListGroupItem>
                                <ListGroupItem> <strong>Price:</strong> {Number(article.price).toFixed(2)} EUR</ListGroupItem>
                            </ListGroup>
                        </Card.Body>
                    <Card.Footer>
                        <Button href={`/article/${article.articleId}`} variant="outlined" startIcon={<ReadMoreIcon />}> Više detalja</Button>
                    </Card.Footer>  
                </Card>
            </Col>
        )
    }

    componentDidMount(){
        this.getCategoryData();
    }

    componentDidUpdate(oldProperties: CategoryPageProperties){
        if(oldProperties.match.params.cId === this.props.match.params.cId){
            return;
        }
        this.getCategoryData();
    }

    private getCategoryData() {
        api('api/category/' + this.props.match.params.cId, 'get', {})
        .then((res: ApiResponse) => {
            if (res.status === "login") {
                this.setUserLoggedState(false);
                return;
            }

            if (res.status === "error"){
                return this.setErrorMessage("Request error. Please try to refresh page later.")
            }

            const categoryData: CategoryType = {
                categoryId: res.data.categoryId,
                name: res.data.name,
            }

            this.setCategoryData(categoryData)

            const subcategories: CategoryType[] =
            res.data.categories.map((category: CategoryDto) => {
                return {
                    categoryId: category.categoryId,
                    name: category.name,
                }
            });

            this.setSubcategories(subcategories);
        })

        api('api/article/search/', 'post', {
            categoryId : Number(this.props.match.params.cId),
            keywords: "",
            priceMin: 0.01,
            priceMax: Number.MAX_SAFE_INTEGER,
            features: [],
            orderBy: "price",
            orderDirection: "ASC",
        })
        .then((res: ApiResponse) => {
            if (res.status === "login") {
                this.setUserLoggedState(false);
                return;
            }

            if (res.status === "error"){
                return this.setErrorMessage("Request error. Please try to refresh page later.")
            }

            if (res.data.statusCode === 0 ){
                this.setErrorMessage("")
                this.setArticles([])
                return
            }

            const articles: ArticleType[] = 
            res.data.map((article: ArticleDto) => {
                const object: ArticleType = {
                    articleId: article.articleId,
                    name: article.name,
                    excerpt: article.excerpt,
                    description: article.description,
                    imageUrl: '',
                    price: 0,
                }

                if (article.photos !== undefined && article.photos?.length > 0){
                    object.imageUrl = article.photos[article.photos?.length-1].imagePath
                }

                if (article.articlePrices !== undefined && article.articlePrices?.length > 0){
                    object.price = article.articlePrices[article.articlePrices?.length-1].price
                }
                return object;
            })
            this.setArticles(articles)
        });
    }
    
}