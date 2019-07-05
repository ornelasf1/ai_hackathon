
import React from 'react';
import {Form, Col} from 'react-bootstrap';
import './Quote.css';

export class Quote extends React.Component {
    

    render = () => {

        const fields = this.props.fields.map((field, i) => 
            <Col key={i}>
                <Form.Label bsPrefix='field-name'>{field}</Form.Label>
                <Form.Control placeholder='' />
            </Col>
        );

        return (
            <div className='container'>
                <div className='quote container'>
                    <Form>
                        <Form.Row>{fields}</Form.Row>
                    </Form>
                </div>
            </div>
            
        );
    };
}