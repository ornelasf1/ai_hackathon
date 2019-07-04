
import React from 'react';

import Table from 'react-bootstrap/Table';
import Collapse from 'react-bootstrap/Collapse';
import Card from 'react-bootstrap/Card';

export class Quotetable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
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
                this.setState({quotes: data});
            });
    }

    render = () => {
        
        let fields = [];
        let values = [];
        if (this.state.quotes.length !== 0) {
            fields = Object.keys(this.state.quotes[0]).map((label, idx) => <th key={idx}>{label}</th>);
            // values = this.state.quotes.map(quote => <tr>{Object.values(quote).map(value => <td>{value}</td>)}</tr>);
            values = this.state.quotes.map(quote => <QuoteRow values={quote} />);
        } 

        return (
            <div>
                <Table striped border hover size="sm">
                    <thead>
                        <tr>{fields}</tr>
                    </thead>
                    <tbody>
                        {values}
                    </tbody>
                </Table>
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
            <div>
                <tr>
                    {row}
                </tr>
                <Collapse in={this.state.collapse}>
                    <Card>
                        <div>Info</div>
                    </Card>
                </Collapse>
            </div>
        );
    };
};