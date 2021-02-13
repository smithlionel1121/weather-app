import "./App.css";

import React, { Component } from "react";

import API_KEY from "./env";
import CurrentWeather from "./components/CurrentWeather";
import WeeklyForecast from "./components/WeeklyForecast";

import Container from "react-bootstrap/Container";

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: "dark",
      date: new Date(),
      longitude: 51.5085,
      latitude: -0.1257,
      data: { current: { temp: NaN } },
    };
  }

  collectData = async () => {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${this.state.latitude}&lon=${this.state.longitude}&exclude=minutely,hourly&appid=${API_KEY}&units=metric`
    );

    const data = await res.json();
    this.setState({
      data,
      theme: data.current.temp >= 20 ? "warning" : "info",
    });
  };

  local = () => {
    navigator.geolocation.getCurrentPosition(this.success, this.errors);
  };

  success = ({ coords }) => {
    this.setState({
      latitude: coords.latitude,
      longitude: coords.longitude,
    });
    this.collectData();
  };

  errors = (err) => {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  };

  render() {
    return (
      <div className={`App bg-${this.state.theme} text-white py-4`}>
        <Container>
          <h1 className="py-3">Weather App</h1>

          <button onClick={this.collectData}>Run</button>
          <button onClick={this.local}>Local</button>

          {!!this.state.data.current.temp && (
            <div>
              <CurrentWeather
                current={this.state.data.current}
                theme={this.state.theme}
              />
              <WeeklyForecast
                daily={this.state.data.daily}
                className="text-white"
              />
            </div>
          )}
        </Container>
      </div>
    );
  }
}

export default App;
