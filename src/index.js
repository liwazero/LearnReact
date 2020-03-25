import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


import MyButton from './demos/button'


//step1:组件1,Square
//step2:props接收了来自父组件的value 
//step3:添加构造函数用来设置this.state,this.state是每个组件的私有属性  在js的class中，每次定义它的子类构造函数时，都需要调用super方法。
//所有含有构造函数的react组件中，构造函数必须以super（props）方法开头
//每次在组件中调用setState时，react都会自动更新其子组件
/*
class Square extends React.Component{
  render(){
    return(
      <button 
      className="square" 
      onClick={()=>this.props.onClick()}>
      {this.props.value}
      </button>
    )
  }
}
*/
//修改为函数组件
function Square(props){
  return(
    <button 
    className='square' 
    onClick={()=>props.onClick()}>
    {props.value}  
    </button>
  )
}


//step1:组件2,Board  renderSquare函数在组件头部定义，后又在render函数中使用
//step2:修改renderSquare函数，并传递value值给子组件square 
class Board extends React.Component{
  //增加构造函数
  /*将状态提升到Game组件
  constructor(props){
    super(props);
    this.state={
      squares:Array(9).fill(null),
      xIsNext:true,
    }
  }
  */
  //定义handle函数
  /*
  handleClick(i){
    const squares = this.state.squares.slice();//此处复制了原数组，从而改变数组时对元数据不产生影响
    //增加判断游戏输赢的条件，从而决定是否能进行下一步
    if(calculateWinner(squares) || squares[i]){
      return;
    }
    squares[i]=this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares:squares,
      xIsNext:!this.state.xIsNext,
    }); //把新数组赋值给原数组
  }
  */
  //定义渲染square的方式
  renderSquare(i){
    // return <Square value={this.state.squares[i]}/>
    return (<Square 
    value={this.props.squares[i]}
    onClick={()=>this.props.onClick(i)}
    />)
  }

  render(){
    //调用处理输赢的函数，并修改判断逻辑
    /*
    let winner = calculateWinner(this.state.squares);
    let status;
    if(winner){
      status = "Winner is" + winner;
    }else{
      status = "Next player:"+(this.state.xIsNext ? 'X' : 'O');
    }
    */
    return(
      <div>
        <MyButton/>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    )
  }
}

//组件3：Game
class Game extends React.Component{
  constructor(props){
    super(props);
    this.state={
      history:[
        {squares:Array(9).fill(null)},
      ],
      stepNumber:0,
      xIsNext:true,
    }
  }

  handleClick(i){
    // const history = this.state.history;
    const history = this.state.history.slice(0,this.state.stepNumber+1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if(calculateWinner(squares) || squares[i]){
      return;
    }
    squares[i] = this.state.xIsNext ? 'X':'O';

    this.setState({
      history:history.concat([{
        squares:squares,
      }]),
      stepNumber:history.length,
      xIsNext:!this.state.xIsNext,
    });
  }

  jumpTo(step){
    this.setState({
      stepNumber:step,
      xIsNext:(step%2) === 0,
    })
  }

  restartGame(){
    this.setState({
      history:[
        {squares:Array(9).fill(null)},
      ],
      stepNumber:0,
      xIsNext:true
    })
  }

  render(){
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step,move)=>{
      const desc = move ?
      'Go to move #'+move:
      'Go to game start';
      return(
        <li key={move}>
          <button onClick={()=>this.jumpTo(move)}>{desc}</button>
        </li>
      )
    });

    let status;
    if(winner){
      status = "Winner is" + winner;
    }else{
      status = "Next Player is" + (this.state.xIsNext ? 'X' : 'O');
    }



    return(
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i)=>this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <button 
          className='game-restart' 
          onClick={()=>{
            this.restartGame();
          }}
          >Restart</button>
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    )
  }
}
//三个组件Square,Board,Game Square组成了Board，Board又是Game的一个组成部分，然后将Game组件作为根节点来渲染


//处理输赢的函数
function calculateWinner(squares){
  const lines= [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6],
  ];
  for(let i = 0; i < lines.length; i++){
    const[a,b,c] = lines[i];
    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
      return squares[a];
    }
  }
  return null;
}

//渲染节点部分
//====================================================================
/*
ReactDOM.render(
  <Game/>,
  document.getElementById('root')
);
*/

//=========================================================================
/*
function formatDate(date){
  return date.toLocaleDateString();
};
const comment = {
  date:new Date(),
  text:'这是我随便写的一些字呀',
  author:{
    name:'孟你妹',
    avatarUrl:'https://placekitten.com/g/64/64'
  },
};

class Avatar extends React.Component{
  render(){
    return(
      <div className='UserInfo'>
        <img className='Avatar'
          src={this.props.author.avatarUrl}
          alt={this.props.author.name}
        />
        <div className='UserInfo-name'>
          {this.props.author.name}
        </div>
      </div>
    )
  }
};

class CommentText extends React.Component{
  render(){
    return(
      <div className='Comment-text'>
        {this.props.text}
      </div>
    )
  }
};
class CommentDate extends React.Component{
  render(){
    return(
      <div className='Comment-date'>
        {formatDate(this.props.date)}
      </div>
    )
  }
};
class Comment extends React.Component{
  render(){
    return(
      <div className='Comment'>
        <Avatar author={comment.author}/>
        <CommentText text={comment.text}/>
        <CommentDate date={comment.date}/>
      </div>
    )
  }
};


ReactDOM.render(
    <Comment />,
    document.getElementById('root')
    )
*/
/*
class FormatTime extends React.Component{
  render(){
    return(
      <h2>It is {this.props.date.toLocaleTimeString()}.</h2>
    )
  }
}

class Clock extends React.Component{
  constructor(props){
    super(props); //调用this的时候必须调用super构造函数
    this.state={
      date:new Date()
    };
  }

  componentDidMount(){
    this.timeID=setInterval(()=>this.tick(),1000)
  }

  componentWillUnmount(){
    clearInterval(this.timeID)
  }

  tick(){
    this.setState({
      date:new Date()
    })
  }
  render(){
    return(
      <div>
        <h1>hello,world</h1>
        <FormatTime date={this.state.date}/>
      </div>
    )
  }
}

class ThreeClock extends React.Component{
  render(){
    return(
      <div>
        <Clock/>
        <Clock/>
        <Clock/>
      </div>
    )
  }
}
ReactDOM.render(<ThreeClock/>,document.getElementById('root'))
*/
/*
class Toggle extends React.Component{
  constructor(props){
    super(props);
    this.state={
      isToggleOn:false
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(){
    this.setState(state=>({
      isToggleOn:!state.isToggleOn
    }));
  }

  render(){
    return(
      // <button onClick={this.handleClick.bind(this,this.state)}>
      <button onClick={this.handleClick}>
        {this.state.isToggleOn ? 'ON':'OFF'}
      </button>
    )
  }
}
ReactDOM.render(<Toggle/>,document.getElementById('root'))
*/
/*
class UserGreeting extends React.Component{
  render(){
    return <h1>Welcome Back!</h1>
  }
}

class GuestGreeting extends React.Component{
  render(){
    return <h1>Please Sign Up!</h1>
  }
}

class Greeting extends React.Component{
  render(){
    let isLogin = this.props.isLogin;
    if(isLogin){
      return <UserGreeting/>
    }
    return <GuestGreeting/>
  }
}

function LoginButton(props){
  return(
    <button onClick={props.onClick}>login</button>
  )
}

function LogoutButton(props){
  return(
    <button onClick={props.onClick}>logout</button>
  )
}

class LoginControl extends React.Component{
  constructor(props){
    super(props);
    this.state={
      isLoginIn:false
    };
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    
  }

  handleLogin(){
    this.setState({
      isLoginIn:true
    })
  }
  handleLogout(){
    this.setState({
      isLoginIn:false
    })
  }
  render(){
    const isLogin = this.state.isLoginIn;
    let button;
    if(isLogin){
        button = <LogoutButton onClick={this.handleLogout}/>;
    }else{
        button = <LoginButton onClick={this.handleLogin}/>
    }
    return(
      <div>
        <Greeting isLogin={isLogin}/>
        {button}
      </div>
    )
  }
}

ReactDOM.render(<LoginControl/>,document.getElementById('root'))
*/
/*
function MailBox(props){
  const unreadMessage = props.unreadMessage
  return(
    <div>
      <h1>哈喽呀</h1>
      {unreadMessage.length > 0 && 
        <h1>你有{unreadMessage.length}条未读信息</h1>
      }
    </div>
  )
}
const unreadMessage = [];
ReactDOM.render(<MailBox unreadMessage={unreadMessage}/>,document.getElementById('root'))
*/
/*
function WarningBanner(props){
    if(!props.warn){
      return null
    }
    return(
      <div className='warning'>这是一条警告信息</div>
    )
}

class Page extends React.Component{
  constructor(props){
    super(props);
    this.state={
      warn:true
    }
    this.warningShow = this.warningShow.bind(this)
  }

  warningShow(){
    this.setState(state=>({
      warn:!state.warn
    }))
  }
  render(){
    return(
      <div>
        <WarningBanner warn={this.state.warn}/>
        <button onClick={this.warningShow}>
          {this.state.warn ? '隐藏':'显示'}
        </button>
      </div>

    )
  }
}

ReactDOM.render(<Page/>,document.getElementById('root'))
*/

/*
function ListItems (props){
  const numbers = props.numbers;
  const Items = numbers.map((number)=>{
    return <li key={number.toString()}>{number}</li>
  })
  return(
    <ul>{Items}</ul>
  )
}
const numbers= [1,2,3,4,5,6]
ReactDOM.render(<ListItems numbers={numbers}/>,document.getElementById('root'))
*/
/*
function ListItem(props){
  return(
    <li>{props.value}</li>
  )
}

class List extends React.Component{
  render(){
    const list= this.props.numbers;
    const items = list.map((value) =>(
      <ListItem 
        key={value.toString()}
        value={value}
      />
      )
    )
    return(
      <ul>{items}</ul>
    )
  }
}
const numbers = [1,2,3,4,5,6];
ReactDOM.render(<List numbers={numbers}/>,document.getElementById('root'))
*/


/*
class NameForm extends React.Component{
  constructor(props){
    super(props);
    this.state={
      userInput:''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  };
  handleSubmit(e){
    alert(this.state.userInput);
    e.preventDefault();
  };

  handleChange(e){
    this.setState({
      userInput:e.target.value
    })
  };

  render(){
    return(
      <form onSubmit={this.handleSubmit}>
        <input
          type='text' 
          value={this.state.userInput}
          onChange={this.handleChange}
          />
        <input type='submit' value='提交'/>
      </form>
    )
  }
}

ReactDOM.render(<NameForm/>,document.getElementById('root'))
*/
/*
class SelectForm extends React.Component{
  constructor(props){
    super(props);
    this.state={
      selectValue:'meng'
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  handleSubmit(e){
    alert('选中的是'+this.state.selectValue);
    e.preventDefault();
  }
  handleChange(e){
    this.setState({
      selectValue:e.target.value
    })
  }
  render(){
    return(
      <form onSubmit={this.handleSubmit}>
        <select value={this.state.selectValue} onChange={this.handleChange}>
          <option value='meng'>孟你妹</option>
          <option value='liu'>大爷爷</option>
          <option value='jin'>牛金金</option>
          <option value='song'>大烧包</option>
        </select>
        <input type='submit' value='提交'/>
      </form>
    )
  }
}

ReactDOM.render(<SelectForm/>,document.getElementById('root'))
*/
/*
class Reservation extends React.Component{
  constructor(props){
    super(props);
    this.state={
      isGoing:false,
      numberOfGuests:2
    }
    this.handleChangeInput = this.handleChangeInput.bind(this);
  }

  handleChangeInput(event){
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    
    this.setState({
      [name]:value
    })
  }

  render(){
    return(
      <form>
        <label>
          参与：
          <input 
            name='isGoing'
            type='checkbox'
            checked={this.state.inGoing}
            onChange={this.handleChangeInput}
          />
        </label>
        <br/>
        <label>
          来宾人数：
          <input
            name='numberOfGuests'
            type='number'
            value={this.state.numberOfGuests}
            onChange={this.handleChangeInput}
          />
        </label>
      </form>
    )
  }
}

ReactDOM.render(<Reservation/>,document.getElementById('root'));
*/

/*
class Calculator extends React.Component{
  constructor(props){
    super(props);
    this.state={
      tempretrue:0
    }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event){
    this.setState({
      tempretrue:event.target.value
    })
  } 
  render(){
    return(
      <fieldset>
        <input
          value={this.state.tempretrue}
          onChange={this.handleChange}
        />
        <Boiling tempretrue={parseFloat(this.state.tempretrue)}/>
      </fieldset>
    )
  }
}

ReactDOM.render(<Calculator/>,document.getElementById('root'));
*/
/*
function Boiling(props){
  if(props.temperatrue >= 100){
    return <p>水开了</p>
  }else{
    return <p>水还没开</p>
  }
}

const ScaleName = {
   'c':'华氏度',
   'f':'摄氏度'
}

function toCelsius(fahrenheit){
  return (fahrenheit-32)*5/9
}

function toFahrenheit(celsius){
  return (celsius*9/5)+32
}

function tryConvert(tem,convert){
  const input = parseFloat(tem);
  if(Number.isNaN(input)){
    return ''
  }
  const output = convert(input);
  const rounded = Math.round(output*1000)/1000;
  return rounded.toString()
}
class TemperatureInput  extends React.Component{
  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event){
    this.props.onTemperatureChange(event.target.value)
  }

  render(){
    const scale = this.props.scale;
    return(
      <fieldset>
        <legend>请输入{ScaleName[scale]}</legend>
        <input 
          value={this.props.tempreture}
          onChange={this.handleChange}
        />
      </fieldset>
    )
  }
}

class Calculator  extends React.Component{
  constructor(props){
    super(props);
    this.state={
      temperatrue:'',
      scale:'c'
    }
    this.onC = this.onC.bind(this);
    this.onF = this.onF.bind(this);
  }
  
  onC(value){
    this.setState({
      temperatrue:value,
      scale:'c'
    })
  }

  onF(value){
    this.setState({
      temperatrue:value,
      scale:'f'
    })
  }
  render(){
    const scale = this.state.scale;
    const temperatrue = this.state.temperatrue;
    const celsius = scale === 'f' ? tryConvert(temperatrue,toCelsius): temperatrue;
    const fahrenheit  = scale === 'c' ? tryConvert(temperatrue,toFahrenheit):temperatrue;   
    return(
      <div>
        <TemperatureInput 
          scale='c' 
          onTemperatureChange={this.onC} 
          tempreture={celsius}/>
        <TemperatureInput 
          scale='f'
          onTemperatureChange={this.onF}
          tempreture={fahrenheit}/>
        <Boiling temperatrue={parseFloat(temperatrue)}/>
      </div>
      
    )
  }
}

ReactDOM.render(<Calculator/>,document.getElementById('root'));
*/
/*
 class Boiling extends React.Component{
   render(){
     const temperatrue = this.props.temperatrue;
     let content = '水还没开';
     if(temperatrue>=100){
       content = '水已经开了';
     }
     return(
     <p>{content}</p>
     )
   }
 }

 class TemperatureInput extends React.Component{

  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event){
    this.props.onTemperatrueChange(event.target.value)
  }

  render(){
    const temperatrue = this.props.temperatrue;
    const scale = this.props.scale;
    
     return(
      <fieldset>
        <legend>{'下面要显示的是'+scaleName[scale]}</legend>
        <input
          value={temperatrue}
          onChange={this.handleChange}
        />
      </fieldset>
     )
   }
 }

 class Calculator extends React.Component{
   constructor(props){
     super(props);
     this.state={
       temperatrue:'',
       scale:'c'
     }
     this.toC = this.toC.bind(this);
     this.toF = this.toF.bind(this);
   }
   toC(value){
    this.setState({
      temperatrue:value,
      scale:'c'
    })
   }
   toF(value){
    this.setState({
      temperatrue:value,
      scale:'f'
    })
   }
   render(){
     const temperatrue = this.state.temperatrue;
     const scale = this.state.scale;
     const celsius = scale === 'f' ? tryConvert(temperatrue,toCelsius): temperatrue;
     const fahrenheit = scale === 'c' ? tryConvert(temperatrue,toFahrenheit): temperatrue;
     return(
      <div>
        <TemperatureInput 
        scale='c'
        onTemperatrueChange={this.toC}
        temperatrue={celsius}/>
        <TemperatureInput 
        scale='f'
        onTemperatrueChange={this.toF} 
        temperatrue={fahrenheit}/>
        <Boiling temperatrue={parseFloat(fahrenheit)}/>
      </div>
     )
   }
 }

 function toCelsius(fahrenheit){
  return (fahrenheit-32)*5/9;
 }
 function toFahrenheit(celsius){
  return (celsius*9/5)+32;
 }

 function tryConvert(value,func){
    const input = parseFloat(value);
    if(Number.isNaN(input)){
      return ''
    }
    const output = func(input);
    const rounded = Math.round(output*1000)/1000;
    return rounded.toString();
 }

 const scaleName = {
   'c':'华氏度',
   'f':'摄氏度'
 }

 ReactDOM.render(<Calculator/>,document.getElementById('root'))
 */
/*
function FancyBorder(props){
  return(
    <div className={'FancyBorder FancyBorder-'+props.color}>
      {props.children}
    </div>
  )
}

function WelcomeDialog(){
  return(
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        欢迎
      </h1>
      <p className='Dialog-message'>
        谢谢你访问我的网页！
      </p>
    </FancyBorder>
  )
}

ReactDOM.render(<WelcomeDialog/>,document.getElementById('root'))
*/
/*
function Contacts(){
  return <p>这是我的内容</p>
}
function Chat(){
  return(
    <div>
      <p>这是我的聊天内容1</p>
      <p>这是我的聊天内容2</p>
      <p>这是我的聊天内容3</p>
      <p>这是我的聊天内容4</p>
    </div>
  )
}
function SplitPane(props){
  return(
    <div className="SplitPane">
      <div className="SplitPane-left">
        {props.left}
      </div>
      <div className="SplitPane-right">
        {props.right}
      </div>
    </div>
  );
}

function App(){
  return(
    <SplitPane
      left={
        <Contacts/>
      }
      right={
        <Chat/>
      }
    />
  )
}

ReactDOM.render(<App/>,document.getElementById('root'))
*/
/*
function FancyBorder(props){
  return(
    <div className={'FancyBorder FancyBorder-'+props.color}>
      {props.children}
    </div>
  )
}


function Dialog(props){
  return(
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        {props.title}
      </h1>
      <p className='Dialog-message'>
        {props.message}
      </p>
      {props.children}
    </FancyBorder>
  )
}

class SignUpDialog extends React.Component{
  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.state={
      login:''
    };
  }
  handleChange(e){
    this.setState({
      login:e.target.value
    })
  }
  handleSignUp(){
    alert(`Welcome aboar,${this.state.login}`)
  }
  render(){
    return(
      <Dialog title="火星探险"
              message="我们怎么联系你呢？">
        <input 
          value={this.props.login}
          onChange={this.handleChange}
        /> 
        <button onClick={this.handleSignUp}>
          Sign Me Up!
        </button>         
      </Dialog>
    )
  }
}

ReactDOM.render(<SignUpDialog/>,document.getElementById('root'))
*/

class ProductCategoryRow extends React.Component{
  render(){
    const category = this.props.category
    return(
      <tr colSpan='2'>
        <td>{category}</td> 
      </tr>
    )
  }
}

class ProductRow extends React.Component{
  render(){
    const product = this.props.product;
    const name = product.stocked?
        product.name:
        <span style={{color:'red'}}>{product.name}</span>
    return(
      <tr>
        <td>{name}</td>
        <td>{product.price}</td>
      </tr>
    )
  }
}

class ProductTable extends React.Component{
  render(){
    const filterText = this.props.filterText;
    const inStockOnly = this.props.inStockOnly;

    const rows = [];
    let lastCategory = null;

    this.props.product.forEach(product=>{
      if(product.name.indexOf(filterText) === -1){
        return;
      }
      if(inStockOnly && !product.stocked){
        return
      }
      if(product.category !== lastCategory){
        rows.push(
          <ProductCategoryRow
            category={product.category}
            key={product.category}
          />
        )
      }
      rows.push(
        <ProductRow
          product={product}
          key={product.name}
        />
      )
      lastCategory = product.category;
    })

    return(
      <table>
        <thead>
          <tr>
            <td>Name</td>
            <td>Price</td>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    )
  }
}

class SearchBar extends React.Component{
  constructor(props){
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
  }
  
  handleInputChange(e){
    this.props.onFilterTextChange(e.target.value);
  }

  handleCheckboxChange(e){
    this.props.onInStockOnlyChange(e.target.checked);
  }
  render(){
    return(
      <form>
        <input 
          type='text'
          value={this.props.filterText}
          onChange={this.handleInputChange}
        />
        <br/>
        <label>
          <input
            type='checkbox'
            checked={this.props.stocked}
            onChange={this.handleCheckboxChange}
          />
            只展示stock产品
        </label>
      </form>
    )
  }
}


class FilterableProductTable extends React.Component{
  constructor(props){
    super(props);
    this.state={
      filterText:'',
      stocked:false
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleCheckedChange = this.handleCheckedChange.bind(this)
  }
  handleInputChange(value){
    this.setState({
      filterText:value
    })
  }
  handleCheckedChange(value){
    this.setState({
      stocked:value
    })
  }
  render(){
    const filterText = this.state.filterText;
    const stocked = this.state.stocked;
    return(
      <div>
        <SearchBar
          filterText={filterText}
          stocked={stocked}
          onFilterTextChange={this.handleInputChange}
          onInStockOnlyChange={this.handleCheckedChange}
        />
        <ProductTable
          filterText={filterText}
          inStockOnly={stocked}
          product={this.props.products}
        />
      </div>
    )
  }
}
const PRODUCTS = [
  {category: 'Sporting Goods', price: '$49.99', stocked: true, name: 'Football'},
  {category: 'Sporting Goods', price: '$9.99', stocked: true, name: 'Baseball'},
  {category: 'Sporting Goods', price: '$29.99', stocked: false, name: 'Basketball'},
  {category: 'Electronics', price: '$99.99', stocked: true, name: 'iPod Touch'},
  {category: 'Electronics', price: '$399.99', stocked: false, name: 'iPhone 5'},
  {category: 'Electronics', price: '$199.99', stocked: true, name: 'Nexus 7'}
];


ReactDOM.render(<FilterableProductTable products={PRODUCTS}/>,document.getElementById('root'));