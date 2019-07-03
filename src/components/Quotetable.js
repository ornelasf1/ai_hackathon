
import React from 'react';

import Table from 'react-bootstrap/Table';

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
            values = this.state.quotes.map(quote => <tr>{Object.values(quote).map(value => <td>{value}</td>)}</tr>);
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