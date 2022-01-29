import { faListAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Card, Container } from 'react-bootstrap';
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
}

export default class CategoryPage extends React.Component<CategoryPageProperties> {
    state : CategoryPageState;
    constructor(props: Readonly<CategoryPageProperties>){
        super(props);
        this.state = {

        }
    }

    render() {
        return (
    <Container>
        <Card className="text-white bg-dark">
            <Card.Header>
                <Card.Title>
                    <FontAwesomeIcon icon={faListAlt}/> {this.state.category?.name}
                </Card.Title>
            </Card.Header>
        <Card.Body>
            <Card.Text>
                spisak artikala
            </Card.Text>
        </Card.Body>
        </Card>
    </Container>
        )
    }
    componentWillMount(){
        this.getCategoryData();
    }
    componentWillReceiveProps(newProperties: CategoryPageProperties){
        if(newProperties.match.params.cId === this.props.match.params.cId){
            return;
        }
        this.getCategoryData();
    }
    private getCategoryData() {
        setTimeout(() =>{
            const data: CategoryType = {
                name: 'Category ' + this.props.match.params.cId,
                categoryId: this.props.match.params.cId,
                items: []
            }
            this.setState({
                category: data,
            })
        }, 750)
    }
}