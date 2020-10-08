import React, { Component, Fragment, useState } from "react";
import "./styles/ClientesForm.css";
import "./styles/Modal.css";
import "./styles/HistoriaClinica.css";
import Notiflix from "notiflix-react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import Auth from "../services/Auth";
import Environment from "../environment/Environment";
import Sucursales from "../services/Sucursales";
import Citas from "../services/Citas";

class HistoriaClinica extends Component {
  constructor() {
    super();

    Notiflix.Notify.Init({
      width: "500px",
      position: "right-top",
      distance: "15px",
      fontSize: "18px"
    });

    let cliente = JSON.parse(localStorage.getItem("cliente"));

    this.state = {
      cliente: {
        id: cliente.id,
        nombre: `${cliente.nombre} ${cliente.apellido}`,
        email: `${cliente.email}`
      },
      sucursales: [],
      citas: []
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
      Sucursales.getAll().then(response => {
        this.setState({
          cliente: {
            id: this.state.cliente.id,
            nombre: this.state.cliente.nombre,
            email: this.state.cliente.email
          },
          sucursales: response.results,
          citas: []
        });
        Citas.getByClient(this.state.cliente.id).then(resp => {
          let citas = [];
          let res = resp.results;
          for (let r of res) {
            let new_cita = {
              id: r.id,
              fecha: this.convertDateFormat(r.fecha),
              hora_inicio: this.convertHourFormat(r.hora_inicio),
              hora_fin: this.convertHourFormat(r.hora_fin),
              tratamiento: r.tratamiento,
              observaciones: r.observaciones,
              sucursal: this.getSucursal(r.sucursal)
            };
            citas.push(new_cita);
          }
          this.setState({
            cliente: {
              id: this.state.cliente.id,
              nombre: this.state.cliente.nombre,
              email: this.state.cliente.email
            },
            sucursales: this.state.sucursales,
            citas: citas
          });
          Notiflix.Loading.Remove();
        });
      });
    });
  }

  convertDateFormat(date) {
    let d = date.split("-");
    return `${d[2]}/${d[1]}/${d[0]}`;
  }

  convertHourFormat(hour) {
    let h = hour.split(":");
    return `${h[0]}:${h[1]}`;
  }

  getSucursal(id) {
    let suc = this.state.sucursales.find(s => s.id == id);
    return suc.nombre;
  }

  render() {
    const columns = [
      "Fecha",
      "Hora de inicio",
      "Hora de fin",
      "Tratamiento",
      "Observaciones",
      "Sucursal"
    ];
    return (
      <Fragment>
        <div className="clientes_form">
          <div className="body_title">
            <div>Historia clínica</div>
          </div>
          <div className="clientes_body">
            <div className="cliente-data">
              <div className="cliente-data-container">
                <FontAwesomeIcon icon={faUserCircle}></FontAwesomeIcon>
                &nbsp;&nbsp;{this.state.cliente.nombre}
              </div>
              <div className="cliente-data-container">
                <FontAwesomeIcon icon={faEnvelope}></FontAwesomeIcon>
                &nbsp;&nbsp;{this.state.cliente.email}
              </div>
            </div>
            <br />
            <table className="table table-striped">
              <thead>
                <tr>
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
                {this.state.citas.map(c => {
                  return (
                    <tr id={c.id} class="tr">
                      <td>{c.fecha}</td>
                      <td>{c.hora_inicio}</td>
                      <td>{c.hora_fin}</td>
                      <td>{c.tratamiento}</td>
                      <td>{c.observaciones}</td>
                      <td>{c.sucursal}</td>
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

export default HistoriaClinica;
