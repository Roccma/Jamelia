import React, { Component, Fragment } from "react";
import "./styles/Home.css";
import Sucursales from "../services/Sucursales";
import Auth from "../services/Auth";
import Environment from "../environment/Environment";
import Notiflix from "notiflix-react";
class Home extends Component {
  constructor() {
    super();
    this.state = {
      user: {
        id: "",
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        sucursal_nombre: "",
        sucursal_direccion: ""
      }
    };
    this.fetchData();
  }
  fetchData() {
    Notiflix.Loading.Init({
      svgColor: "#87cbe2"
    });

    Notiflix.Loading.Circle();
    Auth.getToken("admin", "admin").then(data => {
      Environment.ACCESS_TOKEN = {
        ...Environment.ACCESS_TOKEN,
        admin: {
          key: data.access,
          date: new Date()
        }
      };
      Environment.REFRESH_TOKEN = data.refresh;
      Sucursales.getAll().then(data => {
        let sucs = data.results;
        let user_now = JSON.parse(localStorage.getItem("user_info"));
        let sucursal = sucs.find(s => s.id === user_now["profile"].sucursal);
        this.setState({
          user: {
            id: user_now.id,
            username: user_now.username,
            first_name: user_now.first_name,
            last_name: user_now.last_name,
            email: user_now.email,
            sucursal_nombre: sucursal.nombre,
            sucursal_direccion: sucursal.direccion
          }
        });

        Notiflix.Loading.Remove();
      });
    });
  }

  render() {
    return (
      <Fragment>
        <div className="home_form">
          <div className="information_form">
            <div className="body_title">
              <div>Mis datos</div>
            </div>
            <div id="information">
              <b>Nombre:</b>
              <br />
              {this.state.user.first_name + " " + this.state.user.last_name}
              <br />
              <br />
              <b>Correo electrónico:</b>
              <br />
              {this.state.user.email}
              <br />
              <br />
              <b>Sucursal:</b>
              <br />
              {this.state.user.sucursal_nombre}
              <br />
              <br />
              <b>Dirección de Sucursal:</b>
              <br />
              {this.state.user.sucursal_direccion}
            </div>
          </div>
          <div className="information_form" id="item2">
            <div className="body_title">
              <div>Recordatorios</div>
            </div>
            <div id="information">
              Hoy es el cumpleaños de Virgilio Romero. No olvides saludarlo en
              su día
            </div>
            <hr />
            <div id="information">
              Victoria Romero hace más de dos meses que no tiene una sesión en
              la clínica
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Home;
