import React, { Component, Fragment } from "react";
import Navbar from "../components/Navbar";
import BodyBig from "../components/BodyBig";

class Historia extends Component {
  render() {
    return (
      <Fragment>
        <Navbar></Navbar>
        <BodyBig form="historia"></BodyBig>
      </Fragment>
    );
  }
}

export default Historia;
