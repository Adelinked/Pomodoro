import "./App.css";
import React from "react";
import ReactDOM from "react-dom";

import "font-awesome/css/font-awesome.min.css";

class Element extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e) {
    this.props.updateFun(e.target.id);
  }
  render() {
    return (
      <div className="element-div">
        <h3 id={this.props.idLabel}>{this.props.label}</h3>
        <div className="cmd-div">
          <i
            className="fa fa-arrow-down"
            id={this.props.idDec}
            onClick={this.handleClick}
          ></i>
          <p className="timeLen" id={this.props.idLen}>
            {this.props.len}
          </p>
          <i
            className="fa fa-arrow-up"
            id={this.props.idInc}
            onClick={this.handleClick}
          ></i>
        </div>
      </div>
    );
  }
}

const baseStyle = { color: "bisque" };
const fewTimeStyle = { color: "red" };
let timeStyle = baseStyle;
let leftTime = 60;

class Timer extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    this.props.updateFun(e.target.id);
  }

  render() {
    return (
      <div className="timer-div">
        <h3 id={this.props.idLabel} style={this.props.timerSyle}>
          {" "}
          {this.props.timerLabel}{" "}
        </h3>
        <p
          className="time-left"
          id={this.props.idTimerLeft}
          style={this.props.timerSyle}
        >
          {this.props.timeLeft}{" "}
        </p>
        <div className="cmd-div">
          <div id={this.props.idStartStop} onClick={this.handleClick}>
            <i className="fa fa-play stop-start-icon"> </i>
            <i className="fa fa-pause stop-start-icon"> </i>
          </div>
          <i
            className="fa fa-refresh"
            id={this.props.idReset}
            onClick={this.handleClick}
          >
            {" "}
          </i>
        </div>
      </div>
    );
  }
}

const readTime = (str) => {
  return (
    parseInt(str.replace(/:\d\d/, "")) * 60 + parseInt(str.replace(/\d\d:/, ""))
  );
};
const writeTime = (num) => {
  const min = Math.floor(Math.abs(num) / 60);
  const sec = Math.abs(num) % 60;
  const minStr = min < 10 ? "0" + String(min) : String(min);
  const secStr = sec < 10 ? "0" + String(sec) : String(sec);
  return minStr + ":" + secStr;
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breakLen: 5,
      sessionLen: 25,
      currentTimer: "Session",
      timeLeft: "25:00",
      timerPaused: false,
      style: baseStyle,
    };
    this.updateElementSes = this.updateElementSes.bind(this);
    this.updateElementBrk = this.updateElementBrk.bind(this);
    this.updateTimer = this.updateTimer.bind(this);
    this.changeCurrent = this.changeCurrent.bind(this);
  }

  updateElementSes(id) {
    if (!this.state.timerPaused) {
      this.setState((state) => {
        const updateSes = /^session/.test(id)
          ? /increment$/.test(id)
            ? state.sessionLen == 60
              ? 0
              : 1
            : state.sessionLen == 1
            ? 0
            : -1
          : 0;
        if (state.currentTimer === "Session")
          return {
            sessionLen: state.sessionLen + updateSes,
            timeLeft: writeTime((state.sessionLen + updateSes) * 60),
            style: baseStyle,
          };
        else {
          return { sessionLen: state.sessionLen + updateSes, style: baseStyle };
        }
      });
    }
  }

  updateElementBrk(id) {
    if (!this.state.timerPaused) {
      this.setState((state) => {
        const updateBrk = /^break/.test(id)
          ? /increment$/.test(id)
            ? state.breakLen == 60
              ? 0
              : 1
            : state.breakLen == 1
            ? 0
            : -1
          : 0;
        if (state.currentTimer === "Break") {
          return {
            breakLen: state.breakLen + updateBrk,
            timeLeft: writeTime((state.breakLen + updateBrk) * 60),
            style: baseStyle,
          };
        } else {
          return { breakLen: state.breakLen + updateBrk, style: baseStyle };
        }
      });
    }
  }

  changeCurrent() {
    this.setState((state) => {
      if (state.currentTimer == "Session") {
        return {
          currentTimer: "Break",
          timeLeft: writeTime(state.breakLen * 60),
          style: baseStyle,
        };
      } else {
        return {
          currentTimer: "Session",
          timeLeft: writeTime(state.sessionLen * 60),
          style: baseStyle,
        };
      }
    });
  }

  componentWillUpdate() {
    leftTime = readTime(this.state.timeLeft);
    if (leftTime == 0) {
      const sound = document.querySelector("#beep");
      sound.currentTime = 0;
      sound.play();
      this.changeCurrent();
    }
  }

  updateTimer(id) {
    if (id === "reset") {
      clearInterval(this.state.timer);
      timeStyle = baseStyle;
      const sound = document.querySelector("#beep");
      sound.pause();
      sound.currentTime = 0;
      this.setState({
        breakLen: 5,
        sessionLen: 25,
        currentTimer: "Session",
        timeLeft: "25:00",
        timerPaused: false,
        style: baseStyle,
      });
    } else if (id === "start_stop") {
      this.setState((state) => ({ timerPaused: !state.timerPaused }));
      if (!this.state.timerPaused) {
        this.state.timer = setInterval(
          () =>
            this.setState((state) => ({
              timeLeft: writeTime(readTime(state.timeLeft) - 1),
              style:
                readTime(this.state.timeLeft) <= 60 ? fewTimeStyle : baseStyle,
            })),
          1000
        );
      } else {
        clearInterval(this.state.timer);
      }
    }
  }
  render() {
    return (
      <div id="container">
        <h1> 25 + 5 Clock </h1>
        <Element
          idLabel="break-label"
          label="Break Length"
          updateFun={this.updateElementBrk}
          idDec="break-decrement"
          idInc="break-increment"
          idLen="break-length"
          len={this.state.breakLen}
        />
        <Element
          idLabel="session-label"
          label="Session Length"
          updateFun={this.updateElementSes}
          idDec="session-decrement"
          idInc="session-increment"
          idLen="session-length"
          len={this.state.sessionLen}
        />

        <Timer
          idLabel="timer-label"
          timerLabel={this.state.currentTimer}
          idTimerLeft="time-left"
          timeLeft={this.state.timeLeft}
          idStartStop="start_stop"
          idReset="reset"
          timerSyle={this.state.style}
          updateFun={this.updateTimer}
        />
        <audio
          id="beep"
          src="https://s3.amazonaws.com/freecodecamp/drums/Chord_1.mp3"
        >
          {" "}
        </audio>
        <div id="by">
          <p> Designed and coded by </p>
          <p>
            {" "}
            <a
              href="https://www.freecodecamp.org/fccf13b2fc8-7cde-4bf2-a0be-72e94aca204e"
              target="_blank"
            >
              {" "}
              Adel Aziz Boulfekhar{" "}
            </a>
          </p>
        </div>
      </div>
    );
  }
}

export default App;
