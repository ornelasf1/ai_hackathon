
import React from 'react';

import Collapse from 'react-bootstrap/Collapse';
import Card from 'react-bootstrap/Card';
import { Button} from 'react-bootstrap';
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

    componentDidMount = () => {
        this.getTypeStatistics();
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
            .then(data => {
                data.map(quote => {
                    quote['Standard Deviation of Metric'] = parseFloat(quote['Standard Deviation of Metric']).toFixed(3);
                })
                return data;
            })
            .then(data => {this.setState({typeStatistics: [...data]})},
            onrejected => console.log(onrejected));
    }

    getPredictedQuotes = input => {
        let deleted_status_quotes = input.map(quote => Object.assign({}, quote));
        deleted_status_quotes.forEach(quote => {
            delete quote.Status;
            quote['Inverse ROI of Project'] = 1;
            quote['Metric'] = 1;
        });
        console.log(deleted_status_quotes);
        
        const proxy = 'https://cors-anywhere.herokuapp.com/';
        const url = 'https://ussouthcentral.services.azureml.net/workspaces/882b498ba2484c78a9268c55682faf6b/services/009a999d5edb41c08081e2e99f4c0cb0/execute?api-version=2.0&format=swagger';
        const api_key = '5SYTc0qQO21061zLANMre2o4LZVw8MLJ80CUS8Xexvv1wikCdEbHMFQn+MELUP24+kUzoLKfOp5QAHnHOdzpYw==';
        const data = JSON.stringify({
            Inputs: {
                input1: [...deleted_status_quotes]
            },
            GlobalParameters: {}
        });
        this.generateResultQuotes(true);
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
        .then(data => {
            data.Results.output1.map(quote => {
                quote['Scored Labels'] = parseFloat(quote['Scored Labels']).toFixed(3);
            })
            return data;
        })
        .then(data => {
            try {
                this.setState({
                    predictedQuotes: data.Results.output1,
                });
            } catch(e) {
                console.log('Data failed to be recognized: ', e);
                this.setState({errorEvaluating: true});
            }
        }, onrejected => console.log(onrejected));

        // return fetch('http://localhost:4200/mock-predictions')
        //     .then(res => res.json())
        //     .then(data => {
        //         data.Results.output1.map(quote => {
        //             quote['Scored Labels'] = parseFloat(quote['Scored Labels']).toFixed(3);
        //         })
        //         return data;
        //     })
        //     .then(data => {
        //         this.setState({
        //             predictedQuotes: data.Results.output1,
        //         });
        //     }, onrejected => console.log(onrejected));
    }

    calculateMetrics = (quotes) => {
        const { typeStatistics } = this.state;

        const newQuotes = quotes.map(quote => Object.assign({}, quote));
        newQuotes.forEach(quote => {
            const itemStat = typeStatistics.filter(stat => stat['Item'] === quote['Item Type'])[0];
            quote['Metric'] = parseFloat(((0.5 * (parseFloat(quote['Total Cost']) / parseFloat(itemStat['Average Total Cost']))) + (0.5 * (parseFloat(quote['Lead Time (DAYS)']) / parseFloat(itemStat['Average Lead Time']))))).toFixed(3);
        });
        this.setState({quotes: newQuotes});
        return newQuotes;
    }

    doQuotesMatch = (quote, predictedQuote) => {
        let features = Object.keys(predictedQuote).filter(feature => feature !== 'Scored Labels' && feature !== 'Metric');
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
        this.setState({quotes: [newQuote, ...this.state.quotes]}, () => this.generateResultQuotes());

    }

    handlePredictGoodness = () => {
        this.setState({isPredicting: true});
        this.getPredictedQuotes(this.state.quotes)
            .then(() => this.generateResultQuotes());

    };

    handleGetQuotesFromVendors = () => {
        this.getQuotes()
            .then(() => this.generateResultQuotes());
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

    isMetricWithinRange = (prediction_score, itemStats) => {
        console.log(`${prediction_score} < ${itemStats['Mean of Metric']} + ${parseFloat(itemStats['Standard Deviation of Metric'])}\n${prediction_score < itemStats['Mean of Metric'] + itemStats['Standard Deviation of Metric']}`);
        return parseFloat(prediction_score) < parseFloat(itemStats['Mean of Metric']) + parseFloat(itemStats['Standard Deviation of Metric']);
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
                itemStats, 
                quote['Metric'])
                ) {
                row[0] = (<div key={0}><ApprovedIcon id='approved-icon'/></div>);
                acceptOrReject = 'accept';
            } else {
                row[0] = (<div key={0}><ProblemIcon id='problem-icon'/></div>);    
                acceptOrReject = 'reject';
            }
        } else if (isFetchingPred) {
            row[0] = (<div key={0}><Spinner animation="border" /></div>);
        }

        let bgColorRow = ' oddRow';
        if (rowkey % 2 === 0) {
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
                            <div className='cardEvaluation'>
                                <div id="status">
                                    {acceptOrReject === 'accept' && <h2 id='accept'>Accept</h2>}
                                    {acceptOrReject === 'reject' && <h2 id='reject'>Reject</h2>}
                                </div>
                                <div id="statistics">
                                    <StatCard title="Prediction Score" body={prediction['Scored Labels']}/>
                                    <StatCard 
                                        title="Standard Dev + Mean" 
                                        body={(parseFloat(itemStats['Standard Deviation of Metric']) + parseFloat(itemStats['Mean of Metric'])).toFixed(3)}/>
                                </div>
                            </div>
                        </Card>
                    </Collapse>
                </ListGroup.Item>}
            </React.Fragment>
        );
    };
};

const StatCard = props => {
    return (
        <div className='stat'>
            <div id='title'>{props.title}</div>
            <div id='value'>{props.body}</div>
        </div>
    );
}