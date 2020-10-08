import React, { Component, Fragment, useState } from "react";
import "./styles/ClientesForm.css";
import "./styles/Modal.css";
import Environment from "../environment/Environment";
import Notiflix from "notiflix-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEraser,
  faEdit,
  faTrash,
  faPencilAlt
} from "@fortawesome/free-solid-svg-icons";
import Cliente from "../services/Cliente";
import Auth from "../services/Auth";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
let today = new Date();
let month =
  today.getMonth() + 1 < 10 ? `0${today.getMonth() + 1}` : today.getMonth() + 1;
let day = today.getDate() < 10 ? `0${today.getDate() + 1}` : today.getDate();

class ClientesForm extends Component {
  constructor() {
    super();

    Notiflix.Notify.Init({
      width: "500px",
      position: "right-top",
      distance: "15px",
      fontSize: "18px"
    });

    this.state = {
      cliente: {
        first_name: "",
        last_name: "",
        telefono: "",
        email: "",
        fecha_nacimiento: `${today.getFullYear()}-${month}-${day}`
      },
      clientes: [],
      edit: false,
      delete: false,
      cliente_id: 0
    };

    this.fetchData();
  }

  limpiarState() {
    this.setState({
      cliente: {
        first_name: "",
        last_name: "",
        telefono: "",
        email: "",
        fecha_nacimiento: `${today.getFullYear()}-${month}-${day}`,
        fecha_nacimiento_esp: `${day}/${month}/${today.getFullYear()}`
      },
      clientes: [],
      edit: false,
      delete: false,
      cliente_id: 0
    });
  }

  fetchData() {
    Notiflix.Loading.Init({
      svgColor: "#87cbe2"
    });

    Notiflix.Loading.Circle();
    //this.limpiarState();

    Auth.getToken("admin", "admin").then(data => {
      Environment.ACCESS_TOKEN = {
        ...Environment.ACCESS_TOKEN,
        admin: {
          key: data.access,
          date: new Date()
        }
      };
      Environment.REFRESH_TOKEN = data.refresh;
      Cliente.getAll().then(response => {
        let clientes = response.results;
        for (let cli of clientes) {
          let f = cli.fecha_nacimiento;
          let fSplit = f.split("-");
          cli.fecha_nacimiento_esp = `${fSplit[2]}/${fSplit[1]}/${fSplit[0]}`;
        }
        this.setState({
          cliente: this.state.cliente,
          clientes: response.results,
          edit: false,
          delete: false,
          cliente_id: 0
        });
        Notiflix.Loading.Remove();
      });
    });
  }

  handleChange = e => {
    this.setState({
      cliente: {
        ...this.state.cliente,
        [e.target.name]: e.target.value
      },
      clientes: this.state.clientes,
      edit: this.state.edit,
      delete: this.state.false,
      cliente_id: 0
    });
  };

  handleChangeEdit = e => {
    this.setState({
      cliente: this.state.cliente,
      clientes: this.state.clientes,
      edit: this.state.edit,
      delete: this.state.delete,
      cliente_id: {
        ...this.state.cliente_id,
        [e.target.name]: e.target.value
      }
    });

    console.log(this.state);
  };

  handleClick = e => {
    if (this.state.cliente.first_name.length === 0) {
      Notiflix.Notify.Warning("No se ha indicado nombre");
      return;
    }
    if (this.state.cliente.last_name.length === 0) {
      Notiflix.Notify.Warning("No se ha indicado apellido");
      return;
    }
    if (this.state.cliente.email.length === 0) {
      Notiflix.Notify.Warning("No se ha indicado correo electrónico");
      return;
    }
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
      Cliente.add(
        this.state.cliente.first_name,
        this.state.cliente.last_name,
        this.state.cliente.email,
        this.state.cliente.telefono,
        this.state.cliente.fecha_nacimiento
      ).then(response => {
        if (response.code === "token_not_valid") {
          Auth.refresh("admin").then(() => {
            Notiflix.Loading.Remove();
            Notiflix.Notify.Failure(
              "Error de seguridad, por favor vuelva a intentar"
            );
          });
        } else {
          this.fetchData();
          Notiflix.Notify.Success("Usuario agregado de manera correcta");

          Notiflix.Loading.Remove();
        }
      });
    });
  };

  handleShowEdit = cli => {
    this.setState({
      cliente: this.state.cliente,
      clientes: this.state.clientes,
      edit: true,
      delete: false,
      cliente_id: cli
    });
  };

  handleCloseEdit = () => {
    this.setState({
      cliente: this.state.cliente,
      clientes: this.state.clientes,
      edit: false,
      delete: false,
      cliente_id: 0
    });
  };

  handleShowDelete = cliente_id => {
    this.setState({
      cliente: this.state.cliente,
      clientes: this.state.clientes,
      edit: false,
      delete: true,
      cliente_id: cliente_id
    });
    console.log(cliente_id);
  };

  handleCloseDelete = () => {
    this.setState({
      cliente: this.state.cliente,
      clientes: this.state.clientes,
      edit: false,
      delete: false,
      cliente_id: 0
    });
  };

  handleDeleteClient = () => {
    Cliente.delete(this.state.cliente_id).then(response => {
      if (response["message"]) {
        Notiflix.Notify.Failure(
          "El cliente tiene citas ya agendadas, por lo que no se puede eliminar"
        );
      }
      if (response["result"] === "ok") {
        this.fetchData();
      }
    });
  };

  handleEditClient = () => {
    console.log(this.state);
    if (this.state.cliente_id.nombre.length === 0) {
      Notiflix.Notify.Warning("No se ha indicado nombre");
      return;
    }
    if (this.state.cliente_id.apellido.length === 0) {
      Notiflix.Notify.Warning("No se ha indicado apellido");
      return;
    }
    if (this.state.cliente_id.email.length === 0) {
      Notiflix.Notify.Warning("No se ha indicado correo electrónico");
      return;
    }
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
      Cliente.edit(
        this.state.cliente_id.id,
        this.state.cliente_id.nombre,
        this.state.cliente_id.apellido,
        this.state.cliente_id.email,
        this.state.cliente_id.telefono,
        this.state.cliente_id.fecha_nacimiento
      ).then(response => {
        if (response.code === "token_not_valid") {
          Auth.refresh("admin").then(() => {
            Notiflix.Loading.Remove();
            Notiflix.Notify.Failure(
              "Error de seguridad, por favor vuelva a intentar"
            );
          });
        } else {
          this.fetchData();

          Notiflix.Loading.Remove();
          this.fetchData();
        }
      });
    });
  };

  handleShowEdit = cli => {
    this.setState({
      cliente: this.state.cliente,
      clientes: this.state.clientes,
      edit: true,
      delete: false,
      cliente_id: cli
    });
  };

  handleRedirect = cli => {
    localStorage.setItem("cliente", JSON.stringify(cli));
    window.location.href = "/historia";
  };

  render() {
    const columns = [
      "Nombre",
      "Apellido",
      "Correo electrónico",
      "Teléfono",
      "Fecha de nacimiento",
      ""
    ];
    return (
      <Fragment>
        <div className="clientes_form">
          <div className="body_title">
            <div>Clientes</div>
          </div>
          <div className="clientes_body">
            <form>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <input
                        type="text"
                        placeholder="Nombre"
                        className="form-control"
                        value={this.state.cliente.first_name}
                        name="first_name"
                        onChange={this.handleChange}
                      ></input>
                    </td>
                    <td>
                      <input
                        type="text"
                        placeholder="Apellido"
                        className="form-control"
                        value={this.state.cliente.last_name}
                        name="last_name"
                        onChange={this.handleChange}
                      ></input>
                    </td>
                    <td>
                      <input
                        type="email"
                        placeholder="Correo electrónico"
                        className="form-control"
                        value={this.state.cliente.email}
                        name="email"
                        onChange={this.handleChange}
                      ></input>
                    </td>
                    <td>
                      <input
                        type="text"
                        placeholder="Teléfono"
                        className="form-control"
                        value={this.state.cliente.telefono}
                        name="telefono"
                        onChange={this.handleChange}
                      ></input>
                    </td>
                    <td>
                      <input
                        type="date"
                        placeholder="Fecha de nacimiento"
                        className="form-control"
                        id="nacimiento_input"
                        value={this.state.cliente.fecha_nacimiento}
                        name="fecha_nacimiento"
                        onChange={this.handleChange}
                      ></input>
                      <div
                        className="plus-container"
                        onClick={this.handleClick}
                      >
                        <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </form>
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
                {this.state.clientes.map(c => {
                  return (
                    <tr key={c.id} className="tr-container">
                      <td onClick={this.handleRedirect.bind(this, c)}>
                        {c.nombre}
                      </td>
                      <td onClick={this.handleRedirect.bind(this, c)}>
                        {c.apellido}
                      </td>
                      <td onClick={this.handleRedirect.bind(this, c)}>
                        {c.email}
                      </td>
                      <td onClick={this.handleRedirect.bind(this, c)}>
                        {c.telefono}
                      </td>
                      <td onClick={this.handleRedirect.bind(this, c)}>
                        {c.fecha_nacimiento_esp}
                      </td>
                      <td>
                        <div className="action-container">
                          <div
                            className="edit-container"
                            onClick={this.handleShowEdit.bind(this, c)}
                          >
                            <FontAwesomeIcon
                              icon={faPencilAlt}
                            ></FontAwesomeIcon>
                          </div>
                          <div
                            className="delete-container"
                            onClick={this.handleShowDelete.bind(this, c.id)}
                          >
                            <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <Dialog
              open={this.state.edit}
              onClose={this.handleCloseEdit}
              aria-labelledby="form-dialog-title"
              id="dialog-editar"
            >
              <DialogTitle
                id="form-dialog-title-editar"
                color="primary"
                className="color-blue"
              >
                Editar cliente
              </DialogTitle>
              <DialogContent id="form-dialog-content-editar">
                <TextField
                  margin="dense"
                  label="Nombre"
                  type="text"
                  fullWidth
                  value={this.state.cliente_id.nombre}
                  name="nombre"
                  onChange={this.handleChangeEdit}
                />
                <br />
                <br />
                <TextField
                  margin="dense"
                  label="Apellido"
                  type="text"
                  fullWidth
                  value={this.state.cliente_id.apellido}
                  name="apellido"
                  onChange={this.handleChangeEdit}
                />
                <br />
                <br />
                <TextField
                  margin="dense"
                  label="Correo electrónico"
                  type="email"
                  fullWidth
                  value={this.state.cliente_id.email}
                  name="email"
                  onChange={this.handleChangeEdit}
                />
                <br />
                <br />
                <TextField
                  margin="dense"
                  label="Teléfono"
                  type="text"
                  fullWidth
                  value={this.state.cliente_id.telefono}
                  name="telefono"
                  onChange={this.handleChangeEdit}
                />
                <br />
                <br />
                <TextField
                  label="Fecha de nacimiento"
                  type="date"
                  defaultValue={this.state.cliente_id.fecha_nacimiento}
                  InputLabelProps={{
                    shrink: true
                  }}
                  name="fecha_nacimiento"
                  onChange={this.handleChangeEdit}
                  fullWidth
                />
                <br />
                <br />
              </DialogContent>
              <DialogActions id="form-dialog-actions-editar">
                <Button onClick={this.handleCloseEdit} className="btn_action">
                  Cancelar
                </Button>
                <Button onClick={this.handleEditClient} color="primary">
                  Aceptar
                </Button>
              </DialogActions>
            </Dialog>
            <Dialog
              open={this.state.delete}
              onClose={this.handleCloseDelete}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title" className="color-red">
                Confirmación
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  ¿Está seguro/a de que desea eliminar el cliente seleccionado?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleCloseDelete}>Cancelar</Button>
                <Button onClick={this.handleDeleteClient} className="color-red">
                  Aceptar
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default ClientesForm;
