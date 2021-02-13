import React, { Component } from "react";

import Table from "react-bootstrap/Table";
import Card from "react-bootstrap/Card";

export class WeeklyForecast extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Card className="rounded-3 p-3 mb-0">
        <Table hover size="sm" className="text-left ">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Temperature (&deg;C)</th>
              <th>Icon</th>
            </tr>
          </thead>
          <tbody>
            {this.props.daily.map((day) => (
              <tr key={day.dt}>
                <td>
                  <b>
                    {new Date(day.dt * 1000).toLocaleString("en-GB", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })}
                  </b>
                </td>
                <td>
                  <b>{day.weather[0].description}</b>
                </td>

                <td>
                  <b>{day.temp.day.toFixed(1)} &deg;C</b>
                </td>
                <td>
                  <img
                    src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    );
  }
}

export default WeeklyForecast;
