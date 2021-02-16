import React, { Component } from "react";

import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";

export class CurrentWeather extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Card className="border-0" bg={this.props.theme}>
        <Container
          className="d-flex justify-content-center"
          style={{ width: "18rem" }}
        >
          <Card.Body>
            <Card.Img
              style={{
                width: "9rem",
                marginBottom: "-2rem",
                marginTop: "-1rem",
              }}
              src={`https://openweathermap.org/img/wn/${this.props.current.weather[0].icon}@4x.png`}
            />
            <Card.Title>{this.props.current.temp}&deg;C</Card.Title>
            <Card.Text>
              <em>{this.props.current.weather[0].description}</em>
            </Card.Text>
          </Card.Body>
        </Container>
      </Card>
    );
  }
}

export default CurrentWeather;
