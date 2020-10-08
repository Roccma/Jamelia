import React, { Component } from "react";

import "./styles/BodySmall.css";
import UserNewForm from "./UserNewForm";
import UserLoginForm from "./UserLoginForm";

class BodySmall extends Component {
  render() {
    return (
      <div className="body_small">
        <div className="container body_small_container">
          {this.props.form === "login" && (
            <UserLoginForm title="Iniciar sesión"></UserLoginForm>
          )}
          {this.props.form === "registro" && (
            <UserNewForm title="Nuevo usuario"></UserNewForm>
          )}
        </div>
      </div>
    );
  }
}

export default BodySmall;
