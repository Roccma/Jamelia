import React, { Component } from "react";
import "./styles/UserNewForm.css";
import Environment from "../environment/Environment";
import Notiflix from "notiflix-react";
import Auth from "../services/Auth";
import Sucursales from "../services/Sucursales";
import User from "../services/User";

class UserNewForm extends Component {
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
        last_name: "",
        first_name: "",
        sucursal: "",
        email: "",
        password: "",
        confirm: ""
      },
      sucursales: []
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
        ["admin"]: {
          key: data.access,
          date: new Date()
        }
      };
      Environment.REFRESH_TOKEN = {
        ...Environment.REFRESH_TOKEN,
        ["admin"]: {
          key: data.refresh,
          date: new Date()
        }
      };
      localStorage.setItem("logged_user", "admin");
      Sucursales.getAll().then(response => {
        this.setState({
          user: this.state.user,
          sucursales: response.results
        });

        this.setState({
          user: {
            ...this.state.user,
            sucursal: this.state.sucursales[0].id
          },
          sucursales: this.state.sucursales
        });
        Notiflix.Loading.Remove();
      });
    });
  }

  handleSubmit = e => {};

  handleChange = e => {
    this.setState({
      user: {
        ...this.state.user,
        [e.target.name]: e.target.value
      },
      sucursales: this.state.sucursales
    });
  };

  handleClick = e => {
    e.preventDefault();
    if (this.state.user.username.length === 0) {
      Notiflix.Notify.Warning("No se ha indicado el usuario");
      return;
    }
    if (this.state.user.first_name.length === 0) {
      Notiflix.Notify.Warning("No se ha indicado nombre");
      return;
    }
    if (this.state.user.last_name.length === 0) {
      Notiflix.Notify.Warning("No se ha indicado apellido");
      return;
    }
    if (this.state.user.email.length === 0) {
      Notiflix.Notify.Warning("No se ha indicado correo electrónico");
      return;
    }
    if (this.state.user.email.password === 0) {
      Notiflix.Notify.Warning("No se ha indicado contraseña");
      return;
    }
    if (this.state.user.email.confirm === 0) {
      Notiflix.Notify.Warning("No se ha indicado confirmación de contraseña");
      return;
    }
    if (this.state.user.password !== this.state.user.confirm) {
      Notiflix.Notify.Warning("Las contraseñas no coinciden");
      return;
    }
    Notiflix.Loading.Circle();
    User.add(
      this.state.user.username,
      this.state.user.first_name,
      this.state.user.last_name,
      this.state.user.email,
      parseInt(this.state.user.sucursal),
      this.state.user.password
    ).then(response => {
      if (response.last_name) {
        Notiflix.Loading.Remove();
        Notiflix.Notify.Success("Usuario creado con éxito");
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } else {
        let message = "";
        Notiflix.Loading.Remove();
        if (response.username) {
          message = "El nombre de usuario se encuentra en uso";
          Notiflix.Notify.Failure(message);
        }

        if (response.email) {
          message = "El correo electrónico ya se encuentra en uso";
          Notiflix.Notify.Failure(message);
        }
      }
    });
  };

  render() {
    return (
      <div className="UserNewContainer">
        <div className="UserNewTitle">
          <h4 className="body_title">{this.props.title}</h4>
        </div>
        <form onSubmit={this.handleSubmit} className="UserNewForm">
          <table className="UserNewTable">
            <tbody>
              <tr>
                <td colSpan="2">
                  <label>Usuario</label>
                  <input
                    className="form-control"
                    type="text"
                    value={this.state.user.username}
                    onChange={this.handleChange}
                    name="username"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label>Nombre</label>
                  <input
                    className="form-control"
                    type="text"
                    value={this.state.user.first_name}
                    onChange={this.handleChange}
                    name="first_name"
                  />
                </td>
                <td>
                  <label>Apellido</label>
                  <input
                    className="form-control"
                    type="text"
                    value={this.state.user.last_name}
                    onChange={this.handleChange}
                    name="last_name"
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="2">
                  <label>Correo electrónico</label>
                  <input
                    className="form-control"
                    type="email"
                    value={this.state.user.email}
                    onChange={this.handleChange}
                    name="email"
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="2">
                  <label>Departamento</label>
                  <select
                    className="form-control"
                    name="sucursal"
                    onChange={this.handleChange}
                    value={this.state.user.sucursal}
                  >
                    {this.state.sucursales.map(sucursal => {
                      return (
                        <option value={sucursal.id} key={sucursal.id}>
                          {sucursal.nombre}
                        </option>
                      );
                    })}
                  </select>
                  <br />
                  <hr />
                </td>
              </tr>
              <tr>
                <td>
                  <label>Contraseña</label>
                  <input
                    className="form-control"
                    type="password"
                    value={this.state.user.password}
                    onChange={this.handleChange}
                    name="password"
                  />
                </td>
                <td>
                  <label>Confirmación</label>
                  <input
                    className="form-control"
                    type="password"
                    value={this.state.user.confirm}
                    onChange={this.handleChange}
                    name="confirm"
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="2">
                  <button
                    className="btn btn-success btn-lg UserNewBtn"
                    onClick={this.handleClick}
                  >
                    Aceptar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    );
  }
}

export default UserNewForm;
