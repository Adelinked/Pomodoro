import './App.css';
import React from 'react';
import ReactDOM from 'react-dom';

import 'font-awesome/css/font-awesome.min.css';


class Element extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  } 
  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyPress);
  }
  componentWillUnmount() {
      document.removeEventListener("keydown", this.handleKeyPress);
  }
  handleClick() {
    this.props.updateFun(this.props.value, this.props.classProp);
  }
  handleKeyPress (e) {
    if (String(e.keyCode) === this.props.keyCode) {
      const padId = this.props.id;
      document.querySelector("#"+padId).classList.add('calc-pads-active');
      setTimeout(() => document.querySelector("#"+padId).classList.remove('calc-pads-active'), 500);
      this.props.updateFun(this.props.value, this.props.classProp);
    }
  }
  render() {
    return (
      <div id={this.props.id} className={this.props.classProp} onClick={this.handleClick} value={this.props.value} keyCode={this.props.keyCode}>
      <p>{this.props.value}</p>
      </div>
    );
  }
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {display: '0', expression: '', previous: '', valid: true}
    this.updateFun = this.updateFun.bind(this); 
    this.handleClick = this.handleClick.bind(this);

    App.defaultProps = {
      limitMessage: 'DIGIT LIMIT MET'
    };
  } 
  
  updateFun(value, classProp) {
    
    if(this.state.previous) {
      if (classProp === 'operation') {
        this.setState({expression: this.state.previous, previous: ''});
      }
      else if (classProp === 'digit' || classProp === 'decimal'){
        this.setState({expression: '', display: '0', previous: ''});
      }      
    }

    if(value === 'AC') {
      this.setState({display: '0', expression: ''});
    }
    else {
      let disp = this.state.display;
      let exp= this.state.expression;
      let validOpr = this.state.valid;
      let evaluation;
      const endDigitDecimal =/\d$|\.$/;
      const endMinus = /-$/;
      const endDigit = /\d$/;
      const hasDecimal = /(\.)+/g;
      const endDecimal = /\.$/;
      const hasOper = /(-|X|\+|\/)+/g;
      
      this.setState(state => {          
      const valExp = state.expression;
      const valDisp = state.display;
      let tempDisp = this.state.display;      

      if (classProp === 'digit') {
        if (this.state.display.length < 22) {
          const tempDisp = () => endDigitDecimal.test(this.state.display) && state.display !== '0'  ? 
                                                                       state.display + value : value;  
          disp = tempDisp();
          if (value === '0' && state.display === '0') {
            exp = '0';
          }
          else {
            exp = state.expression + value;
            if (!hasDecimal.test(exp) && (!hasOper.test(exp))){
              exp = exp.replace(/^0/,'');
            }
          }
          validOpr = true;
        } 
        else {
          document.querySelector("#display").style.display = 'none'; 
          document.querySelector("#limit-msg").style.display = 'block'; 
          setTimeout(()=> document.querySelector("#display").style.display = 'block', 500);
          setTimeout(()=> document.querySelector("#limit-msg").style.display = 'none', 500);      
        }          
      }
      else if (classProp === 'operation') {
        disp = value;
        if (value !== '-') {
          const tempexp = () => endDigitDecimal.test(valExp) ? valExp + value : valExp.replace(/\D+$/, value);
          exp = tempexp();
          if(!endDigitDecimal.test(exp[exp.length - 2])) {
            exp = exp.slice (0, exp.length - 2) + exp.slice (exp.length - 2, exp.length - 1);
          }
        }
        else {
          const tempexp = () => endDigitDecimal.test(valExp) || (!endMinus.test(valExp)) ? valExp + value : valExp; 
          exp = tempexp() ;
        }   
        validOpr = false;        
      }
      else if (classProp === 'decimal') {
        const tempexp = () => (!hasDecimal.test(valDisp)) ? '.' : '';
        let tmp = tempexp();
        if (endDigit.test(valDisp)) {
          disp =  valDisp + tmp;
          exp =  valExp + tmp ;
        }
        else {
          exp = valExp;
          if (!endDecimal.test(valExp)) {
            exp += '0.' ;
          }
        }    
        if (!valExp) {
          exp ='0.'
        }      
        validOpr = true;    
      }   
      else if (classProp === 'equals') {
        if (!state.previous) { 
          if (state.valid) {
            evaluation = eval(valExp.replace(/X+/g,'*'));
            exp = valExp + '=' + evaluation; 
            disp= '';
            disp += evaluation;
            return ({expression: exp, display: disp, previous: evaluation})
          }
          else {
            return ({expression: '=NAN', display: 'NAN'})
          }             
        }
        else {
          return ({previous: state.previous})
        }
      }
      return ({expression: exp, display: disp, valid: validOpr})
    }); 
    }   
  }
  handleClick() {

  }
  render() {
    return (
      <div >  
        <div id="calculator">   
          <div id="expression"><p>{this.state.expression}</p></div>
          <div id="display"><p>{this.state.display}</p></div>
          <div id="limit-msg"><p>DIGIT LIMIT MET</p></div>
          <div id="calculator-pads">
            <Element classProp='clear' id='clear' value='AC' updateFun={this.updateFun} keyCode='27'/>
            <Element classProp='operation' id="divide" value='/' updateFun={this.updateFun} keyCode='111'/>
            <Element classProp='operation' id="multiply" value='X' updateFun={this.updateFun} keyCode='106'/>
            <Element classProp='digit' id='seven' value='7' updateFun={this.updateFun} keyCode='55'/>
            <Element classProp='digit' id='eight' value='8' updateFun={this.updateFun} keyCode='56'/>
            <Element classProp='digit' id='nine' value='9' updateFun={this.updateFun} keyCode='57'/>
            <Element classProp='operation' id="subtract" value='-' updateFun={this.updateFun} keyCode='109'/>
            <Element classProp='digit' id='four' value='4' updateFun={this.updateFun} keyCode='52'/>
            <Element classProp='digit' id='five' value='5' updateFun={this.updateFun} keyCode='53'/>
            <Element classProp='digit' id='six' value='6' updateFun={this.updateFun} keyCode='54'/>
            <Element classProp='operation' id="add" value='+' updateFun={this.updateFun} keyCode='107'/>
            <Element classProp='digit' id='one' value='1' updateFun={this.updateFun} keyCode='49'/>
            <Element classProp='digit' id='two' value='2' updateFun={this.updateFun} keyCode='50'/>
            <Element classProp='digit' id='three' value='3' updateFun={this.updateFun} keyCode='51'/>
            <Element classProp='equals' id='equals' value='=' updateFun={this.updateFun} keyCode='13'/>
            <Element classProp='digit' id='zero' value='0' updateFun={this.updateFun} keyCode='48'/>
           <Element classProp='decimal' id='decimal' value='.' updateFun={this.updateFun} keyCode='110'/>
         </div>
       </div>
       <div id="by">
         <p>Designed and coded by</p>
         <p><a href='https://www.freecodecamp.org/fccf13b2fc8-7cde-4bf2-a0be-72e94aca204e' target='_blank'>Adel Aziz Boulfekhar</a></p>
       </div>
       
     </div>
    );
  }
};



export default App;
