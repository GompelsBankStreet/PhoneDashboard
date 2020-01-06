import React from 'react';

class QueueDetails extends React.Component{
  constructor(props){
    super(props);

    //console.log(props);

    this.state = {
      abandonCount: 0,
      logs: props.logs
    };
  }

  componentDidMount() {
    var abd = 0;

    var arr = this.state.logs;
    if (arr !== ''){
      for(var i = 0; i < arr.length; ++i){
        //console.log(arr[i]);
        if(arr[i]['event'] === 'ABANDON')
          abd++;
      }
    }

    this.setState({abandonCount: abd});
  }

  render(){
    const {abandonCount} = this.state;

    return(
      <div>
      <h1>Abandoned Calls</h1>
      {abandonCount}
      </div>
    );
  }

}

export default QueueDetails;
