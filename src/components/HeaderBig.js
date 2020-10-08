import React, { Component } from "react";
import "./styles/HeaderBig.css";
import imgLeftUp from "../images/fondo-left-up.png";
import imgRightUp from "../images/fondo-right-up.png";
import logo from "../images/logo.png";

class HeaderBig extends Component {
  render() {
    return (
      <div className="header_big">
        <img src={imgLeftUp} alt="Left Up"></img>
        <img src={logo} alt="Logo" className="imgLogo"></img>
        <img src={imgRightUp} alt="Right Up"></img>
      </div>
    );
  }
}

export default HeaderBig;
