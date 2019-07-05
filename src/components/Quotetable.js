
import React from 'react';

import Table from 'react-bootstrap/Table';
import Collapse from 'react-bootstrap/Collapse';
import Card from 'react-bootstrap/Card';
import { Button } from 'react-bootstrap';
import ListGroup from 'react-bootstrap/ListGroup';
import Spinner from 'react-bootstrap/Spinner';

import './Quotetable.css';
import {ReactComponent as ProblemIcon} from '../images/problem.svg';
import {ReactComponent as ApprovedIcon} from '../images/verified.svg';

export class Quotetable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            fields: this.props.fields.map((field, i) => <div key={i}>{field}</div>),
            values: [],
            quotes: [],
            predictedQuotes: [],
            isPredicting: false,
        }
    }

    componentDidMount = () => {
        this.getQuotes().then(() => {
            this.generateResultQuotes(this.state.quotes, this.state.predictedQuotes);
        });
    }

    getQuotes = () => {
        return fetch('http://localhost:4200/mock')
            .then(res => res.json())
            .then(data => {
                this.setState({
                    quotes: data.map(quote => ({Status: '', ...quote}))
                });
            }, onrejected => console.log(onrejected));
    }

    getPredictedQuotes = input => {
        const proxy = 'https://cors-anywhere.herokuapp.com/';
        const url = 'https://ussouthcentral.services.azureml.net/workspaces/4288e7c76c3a48ee8202a1b963906f68/services/4ec835e46fcd46a5bfe4d389e3d918ee/execute?api-version=2.0&format=swagger';
        const api_key = 'TaJrYL+dmIyheDoSNkHE0hozyI6spM/Jn+t7dOf0Hb1j9J28JLj/0+QBfD/AeMD5X8UACXVj2qEnk7LqEiixPw==';
        const data = JSON.stringify({
            Inputs: {
                input1: [...input]
            },
            GlobalParameters: {}
        });
        this.generateResultQuotes(this.state.quotes, this.state.predictedQuotes, true);
        return fetch(proxy + url, {
            method: 'POST',
            body: data,
            headers: {
                'Authorization': 'Bearer ' + api_key,
                'Content-Length': data.length,
                'Content-Type': 'application/json',
            }
        })
        .then(res => res.json())
        .then(data => console.log(data), onrejected => console.log(onrejected));
        // this.setState({predictedQuotes: data})
        // return fetch('http://localhost:4200/mock-predictions')
        //     .then(res => res.json())
        //     .then(data => {
        //         this.setState({
        //             predictedQuotes: data.Results.output1,
        //         });
        //     }, onrejected => console.log(onrejected));
    }

    doQuotesMatch = (quote, predictedQuote) => {
        let features = Object.keys(predictedQuote).filter(feature => feature !== 'Scored Labels');
        for (let feature of features) {
            if (`${quote[feature]}` !== `${predictedQuote[feature]}`) {
                return false;
            }
        }
        return true;
    }

    generateResultQuotes = (quotes, predictedQuotes, isFetchingPred = false) => {

        let newQuotes = [];

        if (quotes.length !== 0) {
            newQuotes = quotes.map((quote, i) => {
                let predQuote = {};
                if (predictedQuotes.length !== 0) {
                    predQuote = predictedQuotes.find(predQuote => {
                        if (this.doQuotesMatch(quote, predQuote)) {
                            return predQuote;
                        }
                    });
                }
                console.log('Returning prediction: ', predQuote);
                return <QuoteRow key={i} rowkey={i} quote={quote} prediction={predQuote} isFetchingPred={isFetchingPred}/>
            });
        }

        this.setState({values: newQuotes});
    }

    handlePredictGoodness = () => {
        this.setState({isPredicting: true});
        this.getPredictedQuotes(this.state.quotes)
            .then(() => this.generateResultQuotes(this.state.quotes, this.state.predictedQuotes));

    };

    render = () => {
        
        const isQuotesEmpty = this.state.quotes.length === 0;

        return (
            <div className='table-container'>
                <Button className='header-button' onClick={this.handlePredictGoodness}>Predict Goodness</Button>
                <ListGroup variant='flush' fluid>
                    <ListGroup.Item bsPrefix='row row-header'>{this.state.fields}</ListGroup.Item>
                    {!isQuotesEmpty && this.state.values}
                    {isQuotesEmpty && <ListGroup.Item>
                        <h1>No quotes found!</h1>
                    </ListGroup.Item>}
                </ListGroup>
                {/* <Table striped hover size="sm">
                    <thead>
                        <tr>{this.state.fields}</tr>
                    </thead>
                    <tbody>
                        {!isQuotesEmpty && this.state.values}
                        {isQuotesEmpty && 
                            <h1>No quotes found!</h1>
                        }
                    </tbody>
                </Table> */}
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

        const isRowPredicted = Object.keys(this.props.prediction).length !== 0;

        let acceptOrReject = '';
        let row = Object.values(this.props.quote).map((value, i) => <div key={i}>{value}</div>);
        
        if (parseFloat(this.props.prediction['Scored Labels']) < this.props.quote['Metric']) {
            row[0] = (<div key={0}><ProblemIcon id='problem-icon'/></div>);
            acceptOrReject = 'reject';
        } else if (parseFloat(this.props.prediction['Scored Labels']) >= this.props.quote['Metric']){
            row[0] = (<div key={0}><ApprovedIcon id='approved-icon'/></div>);
            acceptOrReject = 'accept';
        } else if (this.props.isFetchingPred) {
            row[0] = (<div key={0}><Spinner animation="border" /></div>);
        }

        let bgColorRow = ' oddRow';
        if (this.props.rowkey % 2 === 0) {
            bgColorRow = ' evenRow';
        }

        return (
            <React.Fragment>
                <ListGroup.Item bsPrefix={'row' + bgColorRow} onClick={() => this.setState({collapse: !this.state.collapse && isRowPredicted})}>
                    {row}
                </ListGroup.Item>
                {isRowPredicted && 
                <ListGroup.Item bsPrefix='row'>
                    <Collapse in={this.state.collapse}>
                        <Card body>
                            {acceptOrReject === 'accept' && <h2 id='accept'>Accept</h2>}
                            {acceptOrReject === 'reject' && <h2 id='reject'>Reject</h2>}
                        </Card>
                    </Collapse>
                </ListGroup.Item>}
            </React.Fragment>
        );
    };
};