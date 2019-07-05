
import React from 'react';
import {Form, Col} from 'react-bootstrap';
import './Quote.css';

export class Quote extends React.Component {
    

    render = () => {

        // "Region": "Asia",
        // "Country": "Singapore",
        // "Item Type": "Household",
        // "Sales Channel": "Offline",
        // "Vendor": "C",
        // X "Transaction Date": "6/27/2010",
        // X "Transaction ID": 922752702,
        // X "Received Date": "8/7/2010",

        // "Lead Time (DAYS)": 41,
        // "Units Ordered": 1885,
        // "Unit Cost": 668.27,
        // "Freight Cost": 16246,
        // "Total Cost": 1275934.95,
        // X "Metric": 1.009546786
        return (
            <div className='newquote'>
                <Form>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label>Region</Form.Label>
                            <Form.Control placeholder="Enter region"/>
                        </Form.Group>   
                        <Form.Group as={Col}>
                            <Form.Label>Country</Form.Label>
                            <Form.Control placeholder="Enter country"/>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Item type (Days)</Form.Label>
                            <Form.Control placeholder="Enter item type"/>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Sales Channel</Form.Label>
                            <Form.Control placeholder="Enter sales channel"/>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Vendor</Form.Label>
                            <Form.Control placeholder="Enter vendor"/>
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label>Lead time (Days)</Form.Label>
                            <Form.Control placeholder="Enter lead time"/>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Units ordered</Form.Label>
                            <Form.Control placeholder="Enter units ordered"/>
                        </Form.Group>   
                        <Form.Group as={Col}>
                            <Form.Label>Unit Cost</Form.Label>
                            <Form.Control placeholder="Enter unit cost"/>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Freight Cost</Form.Label>
                            <Form.Control placeholder="Enter freight cost"/>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Total Cost</Form.Label>
                            <Form.Control placeholder="Enter total cost"/>
                        </Form.Group>
                    </Form.Row>
                </Form>
            </div>
        );
    };
}