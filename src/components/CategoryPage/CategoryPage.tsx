import { faListAlt, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Alert from '@mui/material/Alert';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import React from 'react';
import { Button, Card, Col, Container, Form, ListGroup, ListGroupItem, Row } from 'react-bootstrap';
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
    filters: {
        keywords: string;
        priceMinimum: number;
        priceMaximum: number;
        order: 'name asc' | 'name desc' | 'price asc' | 'price desc';
    }
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
            filters: {
                keywords: '',
                priceMinimum: 0.01,
                priceMaximum: 100000,
                order: "price asc"
            }
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
                        
                        <Row>
                            <Col xs="12" md="4" lg="3">
                                {this.printFilters()}
                            </Col>
                            <Col xs="12" md="8" lg="9">
                                { this.printErrorMessage () }
                                { this.showSubcategories() }
                                { this.showArticles() }
                            </Col>
                        </Row>
                    </Card.Text>
                </Card.Body>
                
                </Card>
            </Container>
            </>
        )
    }

    private setNewFilter(newFilter:any) {
        this.setState(Object.assign(this.state, {
            filter: newFilter,
        }))
    }

    private filterKeywordsChanged(event: React.ChangeEvent<HTMLInputElement>) {
        this.setNewFilter(Object.assign(this.state.filters, {
            keywords: event.target.value,
        }))
    }

    private filterPriceMinChanged(event: React.ChangeEvent<HTMLInputElement>) {
        this.setNewFilter(Object.assign(this.state.filters, {
            priceMinimum: Number(event.target.value),
        }))
    }

    private filterPriceMaxChanged(event: React.ChangeEvent<HTMLInputElement>) {
        this.setNewFilter(Object.assign(this.state.filters, {
            priceMaximum: Number(event.target.value),
        }))
    }

    private filterOrderChanged(event: React.ChangeEvent<HTMLSelectElement>) {
        this.setNewFilter(Object.assign(this.state.filters, {
            order: event.target.value,
        }))
    }

    private applyFilters() {
        this.getCategoryData()
    }

    private printFilters(){
        return(
            <>
                <Form.Group>
                    <Form.Label htmlFor="keywords">Search keywords:</Form.Label>
                    <Form.Control 
                    type="text" 
                    id="keywords" 
                    value={this.state.filters.keywords}
                    onChange={(e) => this.filterKeywordsChanged(e as any)}
                    />
                </Form.Group>
                <Form.Group>
                    <Row>
                        <Col xs="12" sm="6">
                        <Form.Label htmlFor='priceMin'>Price min.:</Form.Label>
                            <Form.Control 
                            type='number'
                            id="priceMin"
                            step="0.01" min = "0.01" max="99999.99"
                            value={this.state.filters.priceMinimum}
                            onChange={(e) => this.filterPriceMinChanged(e as any)}
                            />
                        </Col>
                        <Col xs="12" sm="6">
                        <Form.Label htmlFor="priceMax">Price max.:</Form.Label>
                            <Form.Control 
                            type="number"
                            id="priceMax"
                            step="0.01" min = "0.02" max="100000"
                            value={this.state.filters.priceMaximum}
                            onChange={(e) => this.filterPriceMaxChanged(e as any)}
                            />
                        </Col>
                    </Row>
                </Form.Group>
                <Form.Group style={{marginTop:5}}>
                    <Form.Control 
                    as='select' 
                    id="sordOrder" 
                    value={this.state.filters.order}
                    onChange={(e) => this.filterOrderChanged(e as any)}>
                        <option value="name asc">Sort by name - ascending</option>
                        <option value="name desc">Sort by name - descending</option>
                        <option value="price asc">Sort by price - ascending</option>
                        <option value="price desc">Sort by price - descending</option>
                    </Form.Control>
                </Form.Group>

                <Form.Group className="d-grid gap-2" style={{marginTop:5}}>
                    <Button className="btn btn-primary" onClick={() => this.applyFilters()}>
                        <FontAwesomeIcon icon={faSearch} /> Search
                    </Button>
                </Form.Group>
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
                <Card className="text-dark bg-light mb-3 d-grid gap-2">
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
                    <Card.Footer className="d-grid gap-2">
                        <Button className="btn btn-primary" href={`/article/${article.articleId}`}> Više detalja</Button>
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

        const orderParts = this.state.filters.order.split(' ')
        const orderBy = orderParts[0];
        const orderdDirection = orderParts[1].toUpperCase();
        api('api/article/search/', 'post', {
            categoryId : Number(this.props.match.params.cId),
            keywords: this.state.filters.keywords,
            priceMin: this.state.filters.priceMinimum,
            priceMax: this.state.filters.priceMaximum,
            features: [],
            orderBy: orderBy,
            orderDirection: orderdDirection,
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