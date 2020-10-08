import React, { Component, Fragment } from "react";
import "./styles/ClientesForm.css";
import "./styles/Modal.css";
import "./styles/Users.css";
import Environment from "../environment/Environment";
import Notiflix from "notiflix-react";
import Auth from "../services/Auth";
import Sucursales from "../services/Sucursales";
import User from "../services/User";
class Users extends Component {
  constructor() {
    super();

    this.state = {
      usuarios: [],
      sucursales: []
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
      Sucursales.getAll().then(response => {
        this.setState({
          usuarios: [],
          sucursales: response.results
        });
        User.getAll().then(resp => {
          let usus = resp.results;
          let usuarios = [];
          for (let u of usus) {
            let new_usu = {
              id: u.id,
              username: u.username,
              nombre: `${u.first_name} ${u.last_name}`,
              email: u.email,
              sucursal: this.getSucursal(u.profile.sucursal)
            };
            usuarios.push(new_usu);
          }
          this.setState({
            usuarios,
            sucursales: this.state.sucursales
          });
          Notiflix.Loading.Remove();
        });
      });
    });
  }

  getSucursal(id) {
    let suc = this.state.sucursales.find(s => s.id == id);
    return suc.nombre;
  }

  render() {
    const columns = [
      "Usuario",
      "Nombre completo",
      "Correo electrónico",
      "Sucursal"
    ];
    return (
      <Fragment>
        <div className="clientes_form">
          <div className="body_title">
            <div>Usuarios</div>
          </div>
          <div className="clientes_body">
            <br />
            <table className="table table-striped">
              <thead>
                <tr className="tr">
                  {columns.map(col => {
                    return (
                      <th scope="col" key={col}>
                        {col}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {this.state.usuarios.map(u => {
                  return (
                    <tr key={u.id}>
                      <td>{u.username}</td>
                      <td>{u.nombre}</td>
                      <td>{u.email}</td>
                      <td>{u.sucursal}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Users;
