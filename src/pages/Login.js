import React, { Component, Fragment } from "react";
import HeaderBig from "../components/HeaderBig";
import BodySmall from "../components/BodySmall";

class Login extends Component {
  render() {
    return (
      <Fragment>
        <HeaderBig></HeaderBig>
        <BodySmall form="login"></BodySmall>
      </Fragment>
    );
  }
}

export default Login;
