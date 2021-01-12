import './App.css';
import React,{Component} from 'react';


const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';

// ES6
//const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;

const largeColumn = {
  width: '40%',
};
const midColumn = {
  width: '30%',
};
const smallColumn = {
  width: '10%',
};

// ES5			
// function isSearched(searchTerm) {
//   return function(item) {
//     return item.title.toLowerCase().includes(searchTerm.toLowerCase());
//   }
// }

// ES6
// 筛选函数：如果item中的title中有相应字符串 则被留下
// const isSearched = searchTerm => item =>
//   item.title.toLowerCase().includes(searchTerm.toLowerCase());

//这是一个要包涵状态的组件 所有使用class形式 将状态和相应的变化方法写在类的字段中
class App extends Component {
  //es6 class
  constructor(props){
    super(props);//强制显式调用super()

    this.state = {//不能直接修改state,必须通过setState()
      //list:list, es5
      result : null,
      searchTerm: DEFAULT_QUERY,
    };

    //绑定方法的this
    this._delete = this._delete.bind(this);//注意这里的绑定this是必须的 否则在该函数内部的this就会是undefined
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);

    //处理搜索输入框的输入变化事件
    this.onSearchChange = this.onSearchChange.bind(this);

    //处理搜索输入框的表单提交事件
    this.onSearchSubmit = this.onSearchSubmit.bind(this);

  }//构造函数

  //组件的渲染函数 使用jsx这种混合js和html和css的语法
  render() {
    const { searchTerm, result } = this.state;
    const page = (result && result.page) || 0;
    if (!result) { return null; }//返回空 则该组件不渲染
    return(
      <div className="page">
        <div className="interations">
          <Search
          value={searchTerm}
          onChange={this.onSearchChange}
          onSubmit = {this.onSearchSubmit}
            >
          搜索
          </Search>
        </div>
        { 
        //true && 'Hello World' 的值永远是 “Hello World”。而 false && 'Hello World' 的值则永远是 false。
        result && //这里是条件渲染
        <Table
          list={result.hits}
          _delete={this._delete}
        />}
        <div className="interations">
              <Button onClick={()=>this.fetchSearchTopStories(searchTerm,page+1)}>
                下一页
              </Button>
        </div>

      </div>
    )
  }

  //删除函数
  _delete(id){
    //返回新的列表 而不是修改原列表 是react不可变哲学的最佳实践
    const isNotid = item => item.objectID !== id;
    const updatedHits = this.state.result.hits.filter(isNotid);
    this.setState({
      //拥抱不可变
      //法一：result: Object.assign({}, this.state.result, { hits: updatedHits })
      result: {...this.state.result,hits:updatedHits}
    })
  }

  //处理输入框的输入变化事件
  onSearchChange(event){
      this.setState({searchTerm:event.target.value});//输入框中的输入值
      
  }

  //处理输入框提交事件
  onSearchSubmit(event){
    //根据提交的输入框中的数据重新拉取api数据
    const {searchTerm} = this.state;
    this.fetchSearchTopStories(searchTerm);
    //注意打断原始的表单提交事件
    event.preventDefault();
  }

  //将数据更新到State中
  setSearchTopStories(result) {
    this.setState({ result });
  }

  //异步获取数据函数
  fetchSearchTopStories(searchTerm,page = 0) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(e => e);
  }

  //在组件挂载时调用异步获取数据函数
  componentDidMount() {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
  }

}



//使用无状态组件
const Button = ({className='',onClick,children})=>{
  return(
  <button className={className} type="button" onClick={onClick}>
  {children}
  </button>
  )
}

const Search = ({value, children,onChange,onSubmit}) =>{
  return (
    <form onSubmit={onSubmit} >
      
      <input
        type="text"
        value={value}
        onChange={onChange}
      />
      <button type="submit">{children}</button>
    </form>
  );
}

const Table = ({list, _delete})=>{
  return (
    <div className="table">
        {list.map(item =>
          <div key={item.objectID} className="table-row">
            <span>
              <a href={item.url}>{item.title}</a>
            </span>
            <span style={smallColumn}>{item.author}</span>
            <span style={largeColumn}>{item.num_comments}</span>
            <span style={midColumn}>{item.points}</span>
            <span>
             <Button className="button-inline" onClick={()=>_delete(item.objectID)}>
                Dismiss
              </Button>
            </span>
          </div>
        )}
      </div>
  )
}
  

export default App;
