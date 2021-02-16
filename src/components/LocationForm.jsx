import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

export class LocationForm extends Component {
  constructor(props) {
    super(props);
  }

  onChange = (e) => {
    let address = {
      ...this.props.address,
      [e.target.name]: e.target.value,
    };
    this.props.handleAddressChange(address);
  };

  render() {
    const { address } = this.props;
    return (
      <Form>
        <Form.Group controlId="formGridAddress1">
          <Form.Label>Street</Form.Label>
          <Form.Control
            name={"street"}
            value={address.street || ""}
            onChange={this.onChange}
          />
        </Form.Group>

        <Form.Group controlId="formGridCity">
          <Form.Label>City</Form.Label>
          <Form.Control
            name={"city"}
            value={address.city || ""}
            onChange={this.onChange}
          />
        </Form.Group>

        <Form.Row>
          <Form.Group as={Col} controlId="formGridState">
            <Form.Label>State</Form.Label>
            <Form.Control
              name={"state"}
              value={address.state || ""}
              onChange={this.onChange}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridZip">
            <Form.Label>Zip / Post Code</Form.Label>
            <Form.Control
              name={"postalCode"}
              value={address.postalCode || ""}
              onChange={this.onChange}
            />
          </Form.Group>
        </Form.Row>
        <Button variant="primary" onClick={this.props.findAddress}>
          Submit
        </Button>
      </Form>
    );
  }
}

export default LocationForm;
