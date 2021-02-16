import "./App.css";

import React, { Component } from "react";

import API_KEY from "./env";
import CurrentWeather from "./components/CurrentWeather";
import WeeklyForecast from "./components/WeeklyForecast";
import LocationForm from "./components/LocationForm";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import SplitButton from "react-bootstrap/SplitButton";

export class App extends Component {
  constructor(props) {
    super(props);
    let latitude;
    let longitude;

    if (
      !!localStorage.getItem("YSYSWeatherApp.latitude") &
      !!localStorage.getItem("YSYSWeatherApp.longitude")
    ) {
      latitude = localStorage.getItem("YSYSWeatherApp.latitude");
      longitude = localStorage.getItem("YSYSWeatherApp.longitude");
    }

    this.state = {
      theme: "dark",
      changeLocation: true,
      longitude,
      latitude,
      location: null,
      columnData: "temp",
      data: { current: { temp: NaN } },
      address: { street: null, city: null, state: null, postalCode: null },
    };
  }

  componentDidMount() {
    if (
      !!localStorage.getItem("YSYSWeatherApp.latitude") &
      !!localStorage.getItem("YSYSWeatherApp.longitude")
    ) {
      this.collectData();
    }
  }

  collectData = async () => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${this.state.latitude}&lon=${this.state.longitude}&exclude=minutely,hourly&appid=${API_KEY.weather}&units=metric`
      );

      const data = await res.json();
      this.setState({
        data,
        changeLocation: false,
        theme: data.current.temp >= 20 ? "warning" : "info",
      });
      this.reverseGeocode();
    } catch (e) {
      console.warn(e.message);
    }
  };

  local = () => {
    navigator.geolocation.getCurrentPosition(this.success, this.errors);
  };

  success = ({ coords }) => {
    try {
      this.setState({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
      localStorage.setItem("YSYSWeatherApp.latitude", coords.latitude);
      localStorage.setItem("YSYSWeatherApp.longitude", coords.longitude);
      this.collectData();
    } catch (e) {
      console.warn(e.message);
    }
  };

  errors = (err) => {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  };

  handleAddressChange = (address) => {
    this.setState((prevState) => ({
      ...prevState,
      address,
    }));
  };

  findAddress = async () => {
    try {
      const address = this.state.address;
      // let apiCall = `https://www.mapquestapi.com/geocoding/v1/address?key=${API_KEY.map}&`;
      let apiCall = `https://open.mapquestapi.com/geocoding/v1/address?key=${API_KEY.map}&`;

      for (let property in address) {
        if (!!address[property]) {
          apiCall = apiCall.concat(
            `${property}=${address[property].replace(/\s/g, "+")}&`
          );
        }
      }

      const res = await fetch(apiCall);
      const data = await res.json();

      const coords = data.results[0].locations[0].latLng;
      this.setState({
        address: { street: null, city: null, state: null, postalCode: null },
        latitude: coords.lat,
        longitude: coords.lng,
      });

      this.collectData();
    } catch (e) {
      console.warn(e.message);
    }
  };

  reverseGeocode = async () => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${this.state.latitude}&lon=${this.state.longitude}&appid=${API_KEY.weather}`
      );

      const data = await res.json();
      this.setState({
        location: data[0].name,
      });
    } catch (e) {
      console.warn(e.message);
    }
  };

  changeLocationClick = () => {
    this.setState((prevState) => ({
      changeLocation: !prevState.changeLocation,
    }));
  };

  render() {
    const LocationInput = this.state.location ? (
      <SplitButton
        title={this.state.changeLocation ? "Close Form" : "Change Location"}
        id="dropdown-menu-align-responsive-2"
        variant={this.state.theme}
        onClick={this.changeLocationClick}
      >
        <Dropdown.Item eventKey="1" active onClick={this.changeLocationClick}>
          {this.state.changeLocation ? "Close Form" : "Enter Address"}
        </Dropdown.Item>
        <Dropdown.Divider />

        <Dropdown.Item eventKey="2" onClick={this.local}>
          Find your location
        </Dropdown.Item>
      </SplitButton>
    ) : (
      <Button onClick={this.local} variant="success">
        Use My Current Location
      </Button>
    );

    const { theme, location, changeLocation, address, data } = this.state;
    return (
      <div className={`App bg-${theme} text-white py-4 my-0 100vh`}>
        <Container>
          <Row>
            <Col>
              <h1 className="py-3">Weather App</h1>
              <h4>{location}</h4>
              {LocationInput}

              {changeLocation && (
                <LocationForm
                  findAddress={this.findAddress}
                  handleAddressChange={this.handleAddressChange}
                  address={address}
                  changeLocation={changeLocation}
                />
              )}

              {!!data.current.temp && (
                <div>
                  <CurrentWeather current={data.current} theme={theme} />
                  <WeeklyForecast daily={data.daily} className="text-white" />
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
