import React from 'react';


class Dashboard extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      abandonCount: 0,
      answeredCount: 0,
      queueLength:0,
      currentWait:0,
      avgWaitTime:0,
      avgTalkTime:0,
      abdAvgWait:0,
      abdMaxWait:0,
      inProgress:0,
      callTime:0,
      callHistory:0,
      history: props.history,
      logs: props.logs,
      currTime: props.time
    };
  }

  componentDidMount() {
    this.setState({abandonCount: getAbandoned(this.state.logs)});
    this.setState({answeredCount: getAnswered(this.state.logs)});
    this.setState({queueLength: getQueueLength(this.state.logs)});
    this.setState({avgWaitTime: getAvgWait(this.state.logs)});
    this.setState({avgTalkTime: getAvgTalk(this.state.logs)});
    this.setState({currentWait: getCurrentWait(this.state.logs, this.state.time)});
    this.setState({abdAvgWait:  getAbdAvgWait(this.state.logs)});
    this.setState({abdMaxWait: getAbdMaxWait(this.state.logs)});
    this.setState({inProgress: getInProgress(this.state.logs)});
    this.setState({callTime:getCurrentCallTime(this.state.logs, this.state.time)});
    this.setState({callHistory:getCallHistoryData(this.state.logs)});
  }

  render(){
    const {abandonCount, answeredCount, queueLength, avgWaitTime, avgTalkTime, history, currentWait, abdAvgWait, abdMaxWait, inProgress, callTime} = this.state;

    // var good = "Good";
    // var med = "Medium";
    // var bad = "Bad";

    var waitClass = '';
    var talkClass = '';
    var abdClass = '';

    var currentQ = <div className="App-item"><h1>Current Queue Length</h1>{queueLength}<br/><p className="Current">Current Wait: {currentWait}</p></div>;
    var abd = <div className="App-item"><h1>Abandoned Calls</h1><span className={abdClass}>{abandonCount}</span><br/><p className="Current">Avg Abandon Wait: {abdAvgWait}<br/>Max Abandon Wait: {abdMaxWait}</p></div>;
    var calls = <div className="App-item"><h1>Calls In Progress</h1>{inProgress}<p className="Current">Call Duration: {callTime}</p></div>;
    var answeredCalls = <div className="App-item"><h1>Answered Calls</h1>{answeredCount}</div>;
    var averageWait = <div className="App-item"><h1>Average Wait Time</h1><span className={waitClass}>{avgWaitTime}</span></div>;
    var averageTalk = <div className="App-item"><h1>Average Talk Time</h1><span className={talkClass}>{avgTalkTime}</span></div>;

    if (history)
    {
      currentQ = '';
    }

    return(
      <div>
      {currentQ}
      {calls}
      <div>
      {averageWait}
      {answeredCalls}
      {averageTalk}
      {abd}</div>
      </div>
    );
  }
}

function getCallHistoryData(arr){
    if(arr !== '')
    {
      for (var i = 0; i < arr.length; ++i){

      }
    }
}

function getInProgress(arr){
  var ttl = 0;
  if (arr !== ''){
    for(var i = 0; i < arr.length; ++i){
      if(arr[i]['event'] === 'CONNECT'){
        ttl++;
      }
      if(arr[i]['event'] === 'COMPLETEAGENT' || arr[i]['event'] === 'COMPLETECALLER'){
        ttl--;
      }
    }
  }
  return ttl;
}

function getCurrentCallTime(arr, nowTime){
  var call = [];
  arr.push(0);
  if (arr !== ''){
    var uid = 0;
    var active = false;
    var callStart = '00:00:00';
    var callEnd = '00:00:00';
    for(var i = 0; i < arr.length; ++i){
      if(arr[i]['uniqueid'] !== uid){
        //this is a new set of uniqueids
        uid = arr[i]['uniqueid'];
        if(i !== 0 && active === true)
        {
          call.push([callStart,callEnd]);
        }
        active = false;
        callEnd = '0';
        callStart = '0';
      }else{
        //this is looping through the current uniqueid set
        if (arr[i]['event'] === 'CONNECT')
        {
          active = true;
          callStart = arr[i]['datetime'];
          callEnd = new Date();
        }else{
          if(active){
            if(arr[i]['event'] === 'COMPLETEAGENT' || arr[i]['event'] === 'COMPLETECALLER'){
              active = false;
            }
          }
        }
      }
    }

    var callLength = '00:00:00';
    if(call.length > 0){
      callLength = calcTotalTime(call);
    }
    return callLength;
  }
}

function getAnswered(arr){
  var ttl = 0;
  if (arr !== ''){
    for(var i = 0; i < arr.length; ++i){
      if(arr[i]['event'] === 'CONNECT')
        ttl++;
    }
  }
  return ttl;
}

function getQueueLength(arr){
  var qlen = 0;
  if (arr !== ''){
    var uid = 0;
    for(var i = 0; i < arr.length; ++i){
      if(arr[i]['uniqueid'] !== uid){
        //this is a new set of uniqueids
        uid = arr[i]['uniqueid'];
        qlen++;
      }else{
        //this is looping through the current uniqueid set
        if (arr[i]['event'] === 'CONNECT')
        {
          //this call HAS been answered
          qlen--;
        }

        if(arr[i]['event'] === 'ABANDON'){
          //this call has been Abandoned
          qlen--;
        }

      }
    }
    return qlen;
  }
}

function getAvgWait(arr){
  var wait = [];
  arr.push(0);
  if (arr !== ''){
    var uid = 0;
    var ans = false;
    var waitStart = '';
    var waitEnd = '';
    for(var i = 0; i < arr.length; ++i){
      if(arr[i]['uniqueid'] !== uid){
        //this is a new set of uniqueids
        uid = arr[i]['uniqueid'];
        ans = false;
        if(i !== 0 && waitStart !== '' && waitEnd !== '')
        {
          wait.push([waitStart,waitEnd]);
        }
        waitEnd = '';
        waitStart = '';
      }else{
        //this is looping through the current uniqueid set
        if (arr[i]['event'] === 'CONNECT')
        {
          //this call HAS been answered
          ans = true;
          waitEnd = arr[i]['datetime'];
        }

        if(arr[i]['event'] === 'ENTERQUEUE'){
          waitStart = arr[i]['datetime'];
        }

        if (ans === false)
        {
          waitEnd = arr[i]['datetime'];
        }
      }
    }

    var avgWait = '00:00:00';
    if(wait.length > 0){
      avgWait = calcAvgTime(wait);
    }

    return avgWait;
  }
}

function getCurrentWait(arr){
  var wait = [];
  arr.push(0);
  if (arr !== ''){
    var uid = 0;
    var ans = false;
    var waitStart = '';
    var waitEnd = '';
    for(var i = 0; i < arr.length; ++i){
      if(arr[i]['uniqueid'] !== uid){
        //this is a new set of uniqueids
        uid = arr[i]['uniqueid'];
        if(i !== 0 && ans === false && waitStart !== '' && waitEnd !== '')
        {
          wait.push([waitStart,waitEnd]);
        }
        ans = false;
        waitEnd = '';
        waitStart = '';
      }else{
        //this is looping through the current uniqueid set
        if (arr[i]['event'] === 'CONNECT' || arr[i]['event'] === 'ABANDON')
        {
          //this call HAS been answered
          ans = true;
        }else{
          if(arr[i]['event'] === 'ENTERQUEUE'){
            waitStart = arr[i]['datetime'];
          }
          waitEnd = new Date();
        }
      }
    }
    var avgWait = '00:00:00';
    if(wait.length > 0){
      avgWait = calcTotalTime(wait);
    }
    return avgWait;
  }
}

function calcAvgTime(arr){
  var startTime = '';
  var endTime = '';
  var diffTime = '';
  var timeArr = [];
  for(var i = 0; i < arr.length; ++i){
    startTime = arr[i][0];
    endTime = arr[i][1];
    diffTime = new Date(endTime) - new Date(startTime);
    timeArr.push(diffTime);
  }
  var totalTime = 0;
  var arrLength = timeArr.length;
  for(var j = 0; j < timeArr.length; ++j){
    totalTime += timeArr[j];
  }
  var avg = Math.round(((totalTime / arrLength)  / 1000)).toString().toHHMMSS();
  return avg;
}

function calcTotalTime(arr){
  var startTime = '';
  var endTime = '';
  var diffTime = '';
  for(var i = 0; i < arr.length; ++i){
    if(i===0){
      startTime = arr[i][0];
      endTime = arr[i][1];
    }else{
      if(arr[i][0] <= startTime){
        startTime = arr[i][0];
      }
      if(arr[i][1] > endTime){
        endTime = arr[i][1];
      }
    }
  }

  if(startTime === ''){
    startTime = new Date();
    endTime = new Date();
  }

  diffTime = new Date(endTime) - new Date(startTime);

  var max = Math.round((diffTime  / 1000)).toString().toHHMMSS();
  return max;
}
// eslint-disable-next-line
String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
}

function getAvgTalk(arr){
  var call = [];
  arr.push(0);
  if (arr !== ''){
    var uid = 0;
    var callStart = '';
    var callEnd = '';
    for(var i = 0; i < arr.length; ++i){
      if(arr[i]['uniqueid'] !== uid){
        //this is a new set of uniqueids
        uid = arr[i]['uniqueid'];
        if(i !== 0 && callStart !== '' && callEnd !== '')
        {
          call.push([callStart,callEnd]);
        }
        callEnd = '';
        callStart = '';
      }else{
        //this is looping through the current uniqueid set
        if (arr[i]['event'] === 'CONNECT')
        {
          callStart = arr[i]['datetime'];
        }

        if(arr[i]['event'] === 'COMPLETECALLER' || arr[i]['event'] === 'COMPLETEAGENT'){
          callEnd = arr[i]['datetime'];
        }

      }
    }

    var avgCall = '00:00:00';
    if(call.length > 0){
      avgCall = calcAvgTime(call);
    }
    return avgCall;
  }
}

function getAbandoned(arr){
  var abd = 0;
  if (arr !== ''){
    for(var i = 0; i < arr.length; ++i){
      if(arr[i]['event'] === 'ABANDON')
        abd++;
    }
  }
  return abd;
}

function getAbdAvgWait(arr){
  var wait = getAbandonedWait(arr);
  var avgWait = '00:00:00';
  if(wait.length > 1){
    avgWait = calcAvgTime(wait);
  }
  return avgWait;
}

function getAbdMaxWait(arr){
  var wait = getAbandonedWait(arr);
  var avgWait = '00:00:00';
  if(wait.length > 1){
    avgWait = calcMaxTime(wait);
  }
  return avgWait;
}

function calcMaxTime(arr){
  var startTime = '';
  var endTime = '';
  var diffTime = '';
  var timeArr = [];
  for(var i = 0; i < arr.length; ++i){
    startTime = arr[i][0];
    endTime = arr[i][1];
    diffTime = new Date(endTime) - new Date(startTime);
    timeArr.push(diffTime);
  }

  var maxTime = getMaxOfArray(timeArr);

  var avg = Math.round((maxTime  / 1000)).toString().toHHMMSS();
  return avg;
}

function getMaxOfArray(numArray) {
  return Math.max.apply(null, numArray);
}

function getAbandonedWait(arr){
  var wait = [];
  arr.push(0);
  if (arr !== ''){
    var uid = 0;
    var abd = false;
    var waitStart = '';
    var waitEnd = '';
    for(var i = 0; i < arr.length; ++i){
      if(arr[i]['uniqueid'] !== uid){
        //this is a new set of uniqueids
        uid = arr[i]['uniqueid'];

        if(i !== 0 && abd === true && waitStart !== '' && waitEnd !== '')
        {
          wait.push([waitStart,waitEnd]);
        }
        abd = false;
        waitEnd = '';
        waitStart = '';
      }else{
        //this is looping through the current uniqueid set
        if (arr[i]['event'] === 'ABANDON')
        {
          //this call HAS been answered
          abd = true;
          waitEnd = arr[i]['datetime'];
        }else{
          if(arr[i]['event'] === 'ENTERQUEUE'){
            waitStart = arr[i]['datetime'];
          }
          waitEnd = arr[i]['datetime'];
        }
      }
    }

    return wait;

  }
}

export default Dashboard;
