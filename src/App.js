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
  'Total Cost',
  'Metric'
];
// let quotes = [];
// getQuotes = () => {
//   fetch('http://localhost:4200')
//       .then(res => res.json())
//       .then(data => {
//           quotes = data.map(quote => ({Status: 'None', ...quote}));
//       });
// }

function App() {
  // getQuotes();

  return (
    <div>
      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
        integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
        crossorigin="anonymous"
      />
      <Quote fields={schema} />
      <Quotetable fields={schema} />
    </div>
  );
}



export default App;
