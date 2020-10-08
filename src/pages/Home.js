import React, { Component, Fragment } from "react";
import Auth from "../services/Auth";
import Environment from "../environment/Environment";
import HeaderBig from "../components/HeaderBig";
import BodySmall from "../components/BodySmall";
import Navbar from "../components/Navbar";
import BodyBig from "../components/BodyBig";

class Home extends Component {
  render() {
    return (
      <Fragment>
        <Navbar></Navbar>
        <BodyBig form="home"></BodyBig>
      </Fragment>
    );
  }
}

export default Home;
