
import React from 'react';
import {Form, Col} from 'react-bootstrap';
import './Quote.css';
import { Quotetable } from './Quotetable';

export class Quote extends React.Component {
    render = () => {
        return (
            <div className='container'>
                <div className='quote container'>
                    <Form>
                        <Form.Row>
                            <Col>
                                <Form.Label bsPrefix='field-name'>Region</Form.Label>
                                <Form.Control placeholder='' />
                            </Col>
                            <Col>
                                <Form.Label bsPrefix='field-name'>Country</Form.Label>
                                <Form.Control placeholder='' />
                            </Col>
                            <Col>
                                <Form.Label bsPrefix='field-name'>Item Type</Form.Label>
                                <Form.Control placeholder='' />
                            </Col>
                            <Col>
                                <Form.Label bsPrefix='field-name'>Sales Channel</Form.Label>
                                <Form.Control placeholder='' />
                            </Col>
                            <Col>
                                <Form.Label bsPrefix='field-name'>Vendor</Form.Label>
                                <Form.Control placeholder='' />
                            </Col>
                            <Col>
                                <Form.Label bsPrefix='field-name'>Transaction Date</Form.Label>
                                <Form.Control placeholder='' />
                            </Col>
                        </Form.Row>
                    </Form>
                </div>
                <Quotetable></Quotetable>
            </div>
            
        );
    };
}