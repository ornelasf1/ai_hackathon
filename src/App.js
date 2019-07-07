import React from 'react';
import './App.css';

import {Quote} from './components/Quote'
import { Quotetable } from './components/Quotetable';

const schema = [
  'Status',
  'Region',
  'Country',
  'Item Type',
  'Sales Channel',
  'Vendor',
  'Transaction Date',
  'Transaction ID',
  'Received Date',
  'Lead Time (DAYS)',
  'Units Ordered',
  'Unit Cost',
  'Freight Cost',
  'Total Cost'
];


class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      newQuote: {}
    }
  }

  handleNewQuote = newquote => {
    this.setState({newQuote: newquote});
  };
  

  render = () => {
    return (
      <div>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
          crossOrigin="anonymous"
        />
        <Quote fields={schema} handleNewQuote={this.handleNewQuote} />
        <Quotetable fields={schema} newQuote={this.state.newQuote}/>
      </div>
    );}
}




export default App;
