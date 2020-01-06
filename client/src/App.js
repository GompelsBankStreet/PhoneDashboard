import React from 'react';
import Dashboard from './Dashboard';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import './App.css';
class App extends React.Component{

  constructor(props) {
    super(props);
    // eslint-disable-next-line

    const receivedDate = props.today;

    this.state = {
      startDateState: receivedDate,
      endDateState: receivedDate,
      history: false,
      logs: [],
      time: ''
    };

    this.handleStartChange = this.handleStartChange.bind(this);
    this.handleEndChange = this.handleEndChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.getData = this.getData.bind(this);
    this.render = this.render.bind(this);

    this.getData();

  }

  getData() {
  fetch('api/stats?startDate=' + this.state.startDateState + '&endDate=' + this.state.endDateState)
      .then(resp => resp.json())
      .then(data => this.setState({logs: data}));
  }

  setTime(){
    const moment = require('moment');
    var nowTime =  moment(new Date()).format('DD/MM/YYYY HH:mm:ss');
    this.setState({time: nowTime});
  }

  handleStartChange(date){
    const moment = require('moment');
    var startDate1 =  moment(date).format('YYYY-MM-DD');
    this.setState({startDateState: startDate1});
    this.getData();
  }

  handleEndChange(date){
    const moment = require('moment');
    var endDate1 =  moment(date).format('YYYY-MM-DD');
    this.setState({endDateState: endDate1});
    this.getData();
  }

  componentDidMount() {
    this.interval = setInterval(() => this.getData(), 5000);
    this.timeInterval = setInterval(() => this.setTime(), 500);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    this.interval = null;
  }

  handleClick(e) {
     e.preventDefault();
     this.handleStartChange(new Date());
     this.handleEndChange(new Date());
   }

render(){

    const {logs, startDateState, endDateState, history, time} = this.state;

    var splitLog = logs.slice();

  return (
      <div className="App">
        <div className="App-header">
        <div className="DateTimeSearch">
          <div className="dtp-container"><label className="dtp-label">Start:</label><DatePicker className="dtp" selected={new Date(startDateState)} onChange={this.handleStartChange} selectsStart startDate={new Date(startDateState)} endDate={new Date(endDateState)} maxDate={new Date(endDateState)} dateFormat='dd/MM/yyyy'/></div>
          <div className="dtp-container"><label className="dtp-label">End:</label><DatePicker className="dtp" selected={new Date(endDateState)} onChange={this.handleEndChange} selectsEnd startDate={new Date(startDateState)} endDate={new Date(endDateState)} minDate={new Date(startDateState)} maxDate={new Date()} dateFormat='dd/MM/yyyy'/></div>
          <div className="dtp-container"><button onClick={this.handleClick}>TODAY</button></div>
        </div>
        <Dashboard key={time} logs={splitLog} history={history} time={time} />
        </div>

      </div>
    );
  }



}



export default App;
