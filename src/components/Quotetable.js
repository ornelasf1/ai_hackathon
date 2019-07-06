
import React from 'react';

import Collapse from 'react-bootstrap/Collapse';
import Card from 'react-bootstrap/Card';
import { Button, CardGroup } from 'react-bootstrap';
import ListGroup from 'react-bootstrap/ListGroup';
import Spinner from 'react-bootstrap/Spinner';

import './Quotetable.css';
import {ReactComponent as ProblemIcon} from '../images/problem.svg';
import {ReactComponent as ApprovedIcon} from '../images/verified.svg';

export class Quotetable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            fieldRow: this.props.fields.map((field, i) => <div key={i}>{field}</div>),
            quoteRows: [],
            quotes: [],
            predictedQuotes: [],
            typeStatistics: [],
            isPredicting: false,
        }
    }

    componentWillReceiveProps = nextProps => {
        this.updateQuotes(nextProps.newQuote);
    }

    getQuotes = () => {
        return fetch('http://localhost:4200/mock')
        .then(res => res.json())
        .then(data => {
                this.setState({
                    quotes: [...this.state.quotes, ...data.map(quote => ({Status: '', ...quote}))]
                });
            }, onrejected => console.log(onrejected));
    }

    getTypeStatistics = () => {
        fetch('http://localhost:4200/mock-predictions-stats')
            .then(res => res.json())
            .then(data => this.setState({typeStatistics: [...data]}),
            onrejected => console.log(onrejected));
    }

    getPredictedQuotes = input => {
        // let deleted_status_quotes = input.map(quote => Object.assign({}, quote));
        // deleted_status_quotes.forEach(quote => delete quote.Status);
        // console.log(deleted_status_quotes);
        
        // const proxy = 'https://cors-anywhere.herokuapp.com/';
        // const url = 'https://ussouthcentral.services.azureml.net/workspaces/4288e7c76c3a48ee8202a1b963906f68/services/4ec835e46fcd46a5bfe4d389e3d918ee/execute?api-version=2.0&format=swagger';
        // const api_key = 'TaJrYL+dmIyheDoSNkHE0hozyI6spM/Jn+t7dOf0Hb1j9J28JLj/0+QBfD/AeMD5X8UACXVj2qEnk7LqEiixPw==';
        // const data = JSON.stringify({
        //     Inputs: {
        //         input1: [...deleted_status_quotes]
        //     },
        //     GlobalParameters: {}
        // });
        // this.generateResultQuotes(true);
        // return fetch(proxy + url, {
        //     method: 'POST',
        //     body: data,
        //     headers: {
        //         'Authorization': 'Bearer ' + api_key,
        //         'Content-Length': data.length,
        //         'Content-Type': 'application/json',
        //     }
        // })
        // .then(res => res.json())
        // .then(data => {
        //     try {
        //         this.setState({
        //             predictedQuotes: data.Results.output1,
        //         });
        //     } catch(e) {
        //         console.log('Data failed to be recognized: ', e);
        //         this.setState({errorEvaluating: true});
        //     }
        // }, onrejected => console.log(onrejected));

        return fetch('http://localhost:4200/mock-predictions')
            .then(res => res.json())
            .then(data => {
                this.setState({
                    predictedQuotes: data.Results.output1,
                });
            }, onrejected => console.log(onrejected));
    }

    doQuotesMatch = (quote, predictedQuote) => {
        let features = Object.keys(predictedQuote).filter(feature => feature !== 'Scored Labels');
        for (let feature of features) {
            if (`${quote[feature]}` !== `${predictedQuote[feature]}`) {
                return false;
            }
        }
        return Object.keys(predictedQuote).length !== 0;
    }

    generateResultQuotes = (isFetchingPred = false) => {
        const { quotes, predictedQuotes, typeStatistics } = this.state;
        let newQuotes = [];

        if (quotes.length !== 0) {
            newQuotes = quotes.map((quote, i) => {
                let predQuote = {};
                let itemStats = {};
                if (predictedQuotes.length !== 0) {
                    for (let newPredQuote of predictedQuotes) {
                        if (this.doQuotesMatch(quote, newPredQuote)) {
                            predQuote = newPredQuote;
                            break;
                        }
                    }
                }
                if (typeStatistics.length !== 0) {
                    for (let stat of typeStatistics) {
                        if (quote["Item Type"] === stat["Item"]) {
                            itemStats = stat;
                            break;
                        }
                    }
                }
                console.log('Returning prediction: ', predQuote);
                console.log('Returning type stats: ', itemStats);
                return <QuoteRow key={i} rowkey={i} quote={quote} prediction={predQuote} itemStats={itemStats} isFetchingPred={isFetchingPred}/>
            });
        }

        this.setState({quoteRows: newQuotes});
    }

    updateQuotes = newQuote => {
        this.setState({quotes: [newQuote, ...this.state.quotes]}, () => {
            this.generateResultQuotes();
        });

    }

    handlePredictGoodness = () => {
        this.setState({isPredicting: true});
        this.getPredictedQuotes(this.state.quotes)
            .then(() => this.generateResultQuotes());

    };

    handleGetQuotesFromVendors = () => {
        this.getQuotes().then(() => {
            this.generateResultQuotes();
        }).then(() => this.getTypeStatistics());
    }

    render = () => {
        const {fieldRow, quoteRows, quotes} = this.state;
        
        const isQuotesEmpty = quotes.length === 0;

        return (
            <div className='table-container'>
                <div className='button-header'>
                    <Button id='eval-quotes' onClick={this.handlePredictGoodness}>Evaluate Quotes</Button>
                    <Button id='get-quotes' onClick={this.handleGetQuotesFromVendors}>Get Quotes from Vendors</Button>
                </div>
                <ListGroup variant='flush' fluid='true'>
                    <ListGroup.Item bsPrefix='row rowheader'>{fieldRow}</ListGroup.Item>
                    {!isQuotesEmpty && quoteRows}
                    {isQuotesEmpty && 
                    <ListGroup.Item>
                        <h1 style={{textAlign: "center"}}>No quotes found!</h1>
                    </ListGroup.Item>}
                </ListGroup>
            </div>
        );
    };
}

class QuoteRow extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            quoteEvaluated: Object.keys(this.props.prediction).length !== 0,
            collapse: false,
        }
    }

    isMetricWithinRange = (prediction_score, itemStats_std, quote_metric) => {
        console.log(prediction_score, itemStats_std, quote_metric);
        const min = parseFloat(prediction_score) - parseFloat(itemStats_std);
        const max = parseFloat(prediction_score) + parseFloat(itemStats_std);
        console.log(`Max: ${max}   Min: ${min}`);
        return min <= quote_metric && quote_metric <= max;
    }

    render = () => {
        const {rowkey, itemStats, prediction, quote, isFetchingPred} = this.props;
        const isRowPredicted = Object.keys(prediction).length !== 0;
        const allValuesPresent = Object.keys(prediction).length !== 0 && Object.keys(itemStats).length !== 0;

        let acceptOrReject = '';
        let row = Object.values(quote).map((value, i) => <div key={i}>{value}</div>);
        
        if (allValuesPresent) {
            if (this.isMetricWithinRange(
                prediction['Scored Labels'], 
                itemStats['Standard Deviation of Metric'], 
                quote['Metric'])
                ) {
                row[0] = (<div key={0}><ApprovedIcon id='approved-icon'/></div>);
                acceptOrReject = 'accept';
            } else {
                row[0] = (<div key={0}><ProblemIcon id='problem-icon'/></div>);    
                acceptOrReject = 'reject';
            }
        // }
        // if (parseFloat(prediction['Scored Labels']) < quote['Metric']) {
        //     row[0] = (<div key={0}><ProblemIcon id='problem-icon'/></div>);
        //     acceptOrReject = 'reject';
        // } else if (parseFloat(prediction['Scored Labels']) >= quote['Metric']){
        //     row[0] = (<div key={0}><ApprovedIcon id='approved-icon'/></div>);
        //     acceptOrReject = 'accept';
        } else if (isFetchingPred) {
            row[0] = (<div key={0}><Spinner animation="border" /></div>);
        }

        let bgColorRow = ' oddRow';
        if (rowkey % 2 === 0) {
            bgColorRow = ' evenRow';
        }

        let cardBgColor = '';
        if (acceptOrReject === 'accept') {
            cardBgColor = 'success';
        } else if (acceptOrReject === 'reject') {
            cardBgColor = 'reject';
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
                            <div className='cardEvaluation'>
                                <div id="status">
                                    {acceptOrReject === 'accept' && <h2 id='accept'>Accept</h2>}
                                    {acceptOrReject === 'reject' && <h2 id='reject'>Reject</h2>}
                                </div>
                                <div id="statistics">
                                    <CardGroup>
                                        <Card>
                                            <Card.Title>Prediction Score</Card.Title>
                                            <Card.Body>{prediction['Scored Labels']}</Card.Body>
                                        </Card>
                                        <Card>
                                            <Card.Title>Prediction Standard Deviation</Card.Title>
                                            <Card.Body>{itemStats['Standard Deviation of Metric']}</Card.Body>
                                        </Card>
                                        <Card>
                                            <Card.Title>Quote Metric</Card.Title>
                                            <Card.Body>{quote['Metric']}</Card.Body>
                                        </Card>
                                    </CardGroup>
                                </div>
                            </div>
                        </Card>
                    </Collapse>
                </ListGroup.Item>}
            </React.Fragment>
        );
    };
};