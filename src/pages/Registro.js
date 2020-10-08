import React, { Component, Fragment } from "react";
import Auth from "../services/Auth";
import Environment from "../environment/Environment";
import HeaderBig from "../components/HeaderBig";
import BodySmall from "../components/BodySmall";
import Sucursales from "../services/Sucursales";

class Registro extends Component {
  constructor() {
    super();
  }

  componentDidMount() {}

  async fetchData() {
    Auth.getToken("admin", "admin").then(data => {
      Environment.ACCESS_TOKEN["admin"] = {
        key: data.access,
        date: new Date()
      };
      Environment.REFRESH_TOKEN = data.refresh;
      localStorage.setItem("logged_user", "admin");
      Sucursales.getAll().then(response => {
        Environment.SUCURSALES = response.results;
      });
    });
  }

  render() {
    return (
      <Fragment>
        <HeaderBig></HeaderBig>
        <BodySmall form="registro"></BodySmall>
      </Fragment>
    );
  }
}

export default Registro;
