import React, { Component, Fragment } from "react";
import "./styles/BodyBig.css";
import ClientesForm from "./ClientesForm";
import Schedule from "./Schedule";
import Home from "./Home";
import HistoriaClinica from "./HistoriaClinica";
import Users from "./Users";

class BodyBig extends Component {
  render() {
    return (
      <Fragment>
        <div className="body_big">
          <div className="container body_big_container">
            {this.props.form === "clientes" && <ClientesForm></ClientesForm>}
            {this.props.form === "agenda" && <Schedule></Schedule>}
            {this.props.form === "home" && <Home></Home>}
            {this.props.form === "historia" && (
              <HistoriaClinica></HistoriaClinica>
            )}
            {this.props.form === "usuarios" && <Users></Users>}
          </div>
        </div>
      </Fragment>
    );
  }
}

export default BodyBig;
