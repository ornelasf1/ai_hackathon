
import React from 'react';
import {Form, Col, Button} from 'react-bootstrap';
import './Quote.css';

export class Quote extends React.Component {
    
    constructor(props){
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit = event => {
        event.preventDefault();
        const newQuote = {};
        this.props.fields.forEach(field => {
            try {
                newQuote[field] = event.target[field].value
            } catch (e) {
                newQuote[field] = '';
            }
        });
        console.log(newQuote);
        this.props.handleNewQuote(newQuote);
    };

    render = () => {

        // "Region": "Asia",
        // "Country": "Singapore",
        // "Item Type": "Household",
        // X"Sales Channel": "Offline",
        // X"Vendor": "C",
        // X "Transaction Date": "6/27/2010",
        // X "Transaction ID": 922752702,
        // X "Received Date": "8/7/2010",
        // "Lead Time (DAYS)": 41,
        // X"Units Ordered": 1885,
        // X"Unit Cost": 668.27,
        // X"Freight Cost": 16246,
        // "Total Cost": 1275934.95,
        // X "Metric": 1.009546786
        return (
            <div className='newquote'>
                <Form onSubmit={e => this.handleSubmit(e)}>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label>Region</Form.Label>
                            <Form.Control name="Region" placeholder="Enter region"/>
                        </Form.Group>   
                        <Form.Group as={Col}>
                            <Form.Label>Country</Form.Label>
                            <Form.Control name="Country" placeholder="Enter country"/>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Item type</Form.Label>
                            <Form.Control name="Item Type" placeholder="Enter item type"/>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Sales Channel</Form.Label>
                            <Form.Control name="Sales Channel" placeholder="Enter sales channel"/>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Vendor</Form.Label>
                            <Form.Control name="Vendor" placeholder="Enter vendor"/>
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label>Lead time (Days)</Form.Label>
                            <Form.Control name="Lead Time (DAYS)" placeholder="Enter lead time"/>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Units ordered</Form.Label>
                            <Form.Control name="Units Ordered" placeholder="Enter units ordered"/>
                        </Form.Group>   
                        <Form.Group as={Col}>
                            <Form.Label>Unit Cost</Form.Label>
                            <Form.Control name="Unit Cost" placeholder="Enter unit cost"/>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Freight Cost</Form.Label>
                            <Form.Control name="Frieght Cost" placeholder="Enter freight cost"/>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Total Cost</Form.Label>
                            <Form.Control name="Total Cost" placeholder="Enter total cost"/>
                        </Form.Group>
                    </Form.Row>
                    <Button type="submit">Submit Quote</Button>
                </Form>
            </div>
        );
    };
}