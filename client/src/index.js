import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

var moment = require('moment')
var today = moment(new Date()).format('YYYY-MM-DD');

ReactDOM.render(<App key={today} today={today}/>, document.getElementById('root'));
