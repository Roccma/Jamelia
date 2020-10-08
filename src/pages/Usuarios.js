import React, { Component, Fragment } from "react";
import Navbar from "../components/Navbar";
import BodyBig from "../components/BodyBig";

class Usuarios extends Component {
  render() {
    return (
      <Fragment>
        <Navbar></Navbar>
        <BodyBig form="usuarios"></BodyBig>
      </Fragment>
    );
  }
}

export default Usuarios;
