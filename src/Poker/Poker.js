import React,{Component} from 'react';
import Script from 'react-load-script'

const POKERJS_URL = "http://localhost:8080/js";

const PATH_BASE = 'http://localhost:8080';
const PATH_POKER = '/poker';
const PARAM_ID = 'id=';



class Poker extends Component {
    constructor(props){
        super(props);
        this.state ={
            color:"heart",
            num:"4",
            x:"50px",//x坐标
            y:"100px",//y坐标
        }
        //绑定方法到this
        this.addPokerCard.bind(this)
        this.setPokerState.bind(this)
        this.fetchPokerInfo.bind(this)
    }

    render(){

        const card_css = {
            position:"absolute",
            top:this.state.y,
            left:this.state.x,
        }

        return (
        <div>
            <canvas style={card_css} id="myowncanvas"></canvas>
           
        </div>
            )
    }

    

    addPokerCard(){
        const {color,num} = this.state
        console.log(this.state)
        const canvas = document.getElementById('myowncanvas').getContext('2d');
        canvas.drawPokerCard(10, 10, 120, color, num);
    }

    componentDidMount(){
        //从服务器获取card的json数据
        this.fetchPokerInfo()

        // this.addPokerCard()
    }

    //异步获取数据函数
  fetchPokerInfo(id=0) {
    fetch(`${PATH_BASE}${PATH_POKER}`)
      .then(response => response.json())
      .then(result => this.setPokerState(result))
      .then(()=>this.addPokerCard())
      .catch(e => console.log(e));
  }

  setPokerState(result){
      //设置state中的poker状态
      console.log(result)
      this.setState({num:result.num})
      
  }

}

export default Poker;