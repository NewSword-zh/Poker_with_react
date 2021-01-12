import React from 'react';
import Websocket from 'react-websocket';

  class ProductDetail extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        count: 0
      };
    }

    handleData(data) {
      let result = JSON.parse(data);
      console.log(result)
      //这里需要的json数据{movement:1}
      this.setState({count: result.movement});
    }

    render() {
      return (
        <div>
          Count: <strong>{this.state.count}</strong>
          
          <Websocket url='ws://localhost:8080/test'
              onMessage={this.handleData.bind(this)}/>
        </div>
      );
    }
  }

  export default ProductDetail;