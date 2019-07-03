
import React from 'react';
import {Form, Col} from 'react-bootstrap';
import './Quote.css';

export class Quote extends React.Component {
    render = () => {
        return (
            <Form>
                <Form.Row>
                    <Col>
                        <Form.Label bsPrefix='item-name'>Item name</Form.Label>
                        <Form.Control placeholder='Item Name' />
                    </Col>
                </Form.Row>
            </Form>
        );
    };
}