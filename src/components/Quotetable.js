
import React from 'react';

import Table from 'react-bootstrap/Table';
import Collapse from 'react-bootstrap/Collapse';
import Card from 'react-bootstrap/Card';
import { Button } from 'react-bootstrap';

import './Quotetable.css';

export class Quotetable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            fields: this.props.fields.map(field => <th>{field}</th>),
            quotes: [],
        }
    }

    componentDidMount = () => {
        this.getQuotes();
    }

    getQuotes = () => {
        fetch('http://localhost:4200')
            .then(res => res.json())
            .then(data => {
                this.setState({
                    quotes: data.map(quote => ({Status: 'None', ...quote}))
                });
            });
    }

    render = () => {
        
        const isQuotesEmpty = this.state.quotes.length === 0;

        let values = [];
        if (!isQuotesEmpty) {
            values = this.state.quotes.map(quote => <QuoteRow values={quote} />);
        } 

        return (
            <div className='container'>
                <Table striped border hover size="sm">
                    <thead>
                        <tr>{this.state.fields}</tr>
                    </thead>
                    <tbody>
                        {!isQuotesEmpty && values}
                        {isQuotesEmpty && 
                            <div className='no-quotes'>No quotes found!</div>
                        }
                    </tbody>
                </Table>
                <Button className='footer-button'>Predict Goodness</Button>
            </div>
        );
    };
}

class QuoteRow extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            collapse: false,
        }
    }

    render = () => {

        const row = Object.values(this.props.values).map(value => <td>{value}</td>);

        return (
            <React.Fragment>
                <tr onClick={() => this.setState({collapse: !this.state.collapse})}>
                    {row}
                </tr>
                <Collapse in={this.state.collapse}>
                    <Card>
                        <div>Info</div>
                    </Card>
                </Collapse>
            </React.Fragment>
        );
    };
};