import React, { Component } from "react";
import "./styles/UserLoginForm.css";
import Environment from "../environment/Environment";
import Notiflix from "notiflix-react";
import Auth from "../services/Auth";
import User from "../services/User";
import { Link } from "react-router-dom";
class UserLogin extends Component {
  constructor() {
    super();
    Notiflix.Notify.Init({
      width: "500px",
      position: "right-top",
      distance: "15px",
      fontSize: "18px"
    });
    this.state = {
      user: {
        username: "",
        password: ""
      }
    };

    this.fetchData();
  }

  async fetchData() {
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
      localStorage.setItem("logged_user", "admin");
      Notiflix.Loading.Remove();
    });
  }

  handleSubmit = e => {};

  handleChange = e => {
    this.setState({
      user: {
        ...this.state.user,
        [e.target.name]: e.target.value
      }
    });
  };

  handleClick = e => {
    e.preventDefault();
    if (this.state.user.username === "") {
      Notiflix.Notify.Warning("No se ha indicado el usuario");
      return;
    }

    if (this.state.user.password === "") {
      Notiflix.Notify.Warning("No se ha indicado contraseña del usuario");
      return;
    }

    Notiflix.Loading.Circle();
    Auth.getToken(this.state.user.username, this.state.user.password).then(
      data => {
        Notiflix.Loading.Remove();
        if (data.detail) {
          Notiflix.Notify.Warning("Las credenciales son incorrectas");
          return;
        } else {
          localStorage.setItem("logged_user", this.state.user.username);
          Environment.ACCESS_TOKEN = {
            ...Environment.ACCESS_TOKEN,
            [this.state.user.username]: {
              key: data.access,
              date: new Date()
            }
          };
          User.getAll().then(response => {
            let usuarios = response["results"];
            let user_info = usuarios.find(
              u => u.username === this.state.user.username
            );

            localStorage.setItem("user_info", JSON.stringify(user_info));

            window.location.href = "/home";
          });
          //console.log(Environment.ACCESS_TOKEN);
          /*Environment.REFRESH_TOKEN = {
            ...Environment.REFRESH_TOKEN,
            this.state.user.username : data.refresh
          };*/
        }
      }
    );
  };

  render() {
    return (
      <div className="UserLoginContainer">
        <div className="UserLoginTitle">
          <h4 className="body_title">{this.props.title}</h4>
        </div>
        <form onSubmit={this.handleSubmit} className="UserLoginForm">
          <table className="UserLoginTable">
            <tbody>
              <tr>
                <td>
                  <label className="UserLoginLabel">Usuario</label>
                  <input
                    className="form-control"
                    type="text"
                    value={this.state.user.username}
                    onChange={this.handleChange}
                    name="username"
                  />
                  <br />
                </td>
              </tr>
              <tr>
                <td>
                  <label className="UserLoginLabel">Contraseña</label>
                  <input
                    className="form-control"
                    type="password"
                    value={this.state.user.password}
                    onChange={this.handleChange}
                    name="password"
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="2">
                  <button
                    className="btn btn-success btn-lg UserLoginBtn"
                    onClick={this.handleClick}
                  >
                    Aceptar
                  </button>
                </td>
              </tr>
              <tr>
                <td colSpan="2">
                  <Link to="/registro" className="UserLoginLink">
                    ¿No tienes cuenta? ¡Regístrate!
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    );
  }
}

export default UserLogin;
