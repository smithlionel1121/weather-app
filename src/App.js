import "./App.css";

import React, { Component } from "react";

import API_KEY from "./env";
import CurrentWeather from "./components/CurrentWeather";
import WeeklyForecast from "./components/WeeklyForecast";

import Container from "react-bootstrap/Container";

export class App extends Component {
  constructor(props) {
    super(props);
    let latitude;
    let longitude;


    if(!localStorage.getItem('YSYSWeatherApp.latitude') | !localStorage.getItem('YSYSWeatherApp.longitude')) {
      latitude = 51.5085;
      longitude = -0.1257;
    } else {
      latitude = localStorage.getItem('YSYSWeatherApp.latitude')
      longitude = localStorage.getItem('YSYSWeatherApp.longitude')
    }


    this.state = {
      theme: "dark",
      date: new Date(),
      longitude,
      latitude,
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
    localStorage.setItem('YSYSWeatherApp.latitude', coords.latitude)
    localStorage.setItem('YSYSWeatherApp.longitude', coords.longitude)
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
              <h4>{this.state.data.timezone.split("/")[1]}</h4>
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
