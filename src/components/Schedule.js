import React, { Component, Fragment } from "react";
import { Navbar } from "react-bootstrap";
import BodyBig from "./BodyBig";
import "./styles/Schedule.css";
import Paper from "@material-ui/core/Paper";
import { ViewState, EditingState } from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  Appointments,
  AppointmentForm,
  AppointmentTooltip,
  WeekView,
  EditRecurrenceMenu,
  AllDayPanel,
  ConfirmationDialog,
  Resources,
  DragDropProvider,
  DateNavigator,
  Toolbar
} from "@devexpress/dx-react-scheduler-material-ui";
import {
  pink,
  purple,
  teal,
  amber,
  deepOrange
} from "@material-ui/core/colors";
import Environment from "../environment/Environment";
import Sucursales from "../services/Sucursales";
import Notiflix from "notiflix-react";
import Auth from "../services/Auth";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { InputLabel } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import Cliente from "../services/Cliente";
import Citas from "../services/Citas";

const clientes = [];

let appointments = [];

class Schedule extends Component {
  constructor() {
    super();
    this.state = {
      data: appointments,
      resources: [
        {
          fieldName: "cliente",
          title: "Cliente",
          instances: clientes
        }
      ],
      currentDate: new Date(),
      editingAppointmentId: undefined,
      sucursales: [],
      user: {
        profile: {
          sucursal: 1
        }
      },
      loading: true
    };

    this.fetchData();

    this.commitChanges = this.commitChanges.bind(this);
    this.changeAddedAppointment = this.changeAddedAppointment.bind(this);
    this.changeAppointmentChanges = this.changeAppointmentChanges.bind(this);
    this.changeEditingAppointmentId = this.changeEditingAppointmentId.bind(
      this
    );
  }
  async fetchData() {
    appointments = [];
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
        let user = JSON.parse(localStorage.getItem("user_info"));
        this.setState({
          data: appointments,
          resources: [
            {
              fieldName: "cliente",
              title: "Cliente",
              instances: clientes
            }
          ],
          currentDate: new Date(),
          editingAppointmentId: undefined,
          sucursales: response.results,
          user,
          loading: true
        });
        Cliente.getAll().then(response => {
          for (let r of response.results) {
            let c = clientes.find(cliente => cliente.id === r.id);
            if (!c) {
              clientes.push({
                text: `${r.nombre} ${r.apellido}`,
                id: r.id
              });
            }
          }
          Citas.getAll(user.username).then(response => {
            for (let a of response.results) {
              //appointments = [];
              let ap = appointments.find(
                appointment => appointment.id === a.id
              );
              if (!ap) {
                appointments.push({
                  title: a.tratamiento,
                  startDate: `${a.fecha} ${a.hora_inicio}`,
                  endDate: `${a.fecha} ${a.hora_fin}`,
                  notes: a.observaciones,
                  id: a.id,
                  cliente: a.cliente
                });
              }
            }
            this.setState({
              data: appointments,
              resources: [
                {
                  fieldName: "cliente",
                  title: "Cliente",
                  instances: clientes
                }
              ],
              currentDate: new Date(),
              editingAppointmentId: undefined,
              sucursales: this.state.sucursales,
              user: this.state.user,
              loading: false
            });
            console.log(this.state);
            Notiflix.Loading.Remove();
          });
        });
      });
    });
  }
  changeAddedAppointment(addedAppointment) {
    this.setState({ addedAppointment });
  }

  changeAppointmentChanges(appointmentChanges) {
    this.setState({ appointmentChanges });
  }

  changeEditingAppointmentId(editingAppointmentId) {
    this.setState({ editingAppointmentId });
  }

  commitChanges({ added, changed, deleted }) {
    console.log(added);
    console.log(changed);
    console.log(deleted);
    //{title: "holaaa", startDate: Tue Apr 21 2020 10:00:00 GMT-0300 (hora estándar de Uruguay), endDate: Tue Apr 21 2020 10:30:00 GMT-0300 (hora estándar de Uruguay), allDay: false, notes: "a", …}
    if (added) {
      Citas.add(
        added.cliente,
        this.state.user.profile.sucursal,
        this.convertDateFormat(added.startDate),
        this.convertHourFormat(added.startDate),
        this.convertHourFormat(added.endDate),
        added.title,
        added.notes
      ).then(response => {
        this.fetchData();
      });
    }
    if (deleted) {
      Citas.delete(deleted).then(response => {
        this.fetchData();
      });
    }
    if (changed) {
      let cliente = 0;
      let keys = Object.keys(changed);
      let id = keys[0];

      let data = changed[id];
      console.log(data);
      let keys_data = Object.keys(data);
      console.log(keys_data);
      if (keys_data.indexOf("cliente") > -1) {
        cliente = data["cliente"];
        console.log(cliente);
      } else {
        let cita = this.state.data.find(a => a.id == id);
        cliente = cita["cliente"];
      }

      if (keys_data.indexOf("startDate") > -1) {
        data["fecha"] = this.convertDateFormat(data.startDate);
      }

      if (keys_data.indexOf("startDate") > -1) {
        data["hora_inicio"] = this.convertHourFormat(data.startDate);
      }

      if (keys_data.indexOf("endDate") > -1) {
        data["hora_fin"] = this.convertHourFormat(data.endDate);
      }

      if (keys_data.indexOf("title") > -1) {
        data["tratamiento"] = data.title;
      }

      if (keys_data.indexOf("notes") > -1) {
        data["observaciones"] = data.notes;
      }

      data["sucursal"] = this.state.user.profile.sucursal;
      data["cliente"] = cliente;

      Citas.edit(id, data).then(response => {
        this.fetchData();
      });
    }
    this.setState(state => {
      let { data } = state;
      if (added) {
        const startingAddedId =
          data.length > 0 ? data[data.length - 1].id + 1 : 0;
        data = [...data, { id: startingAddedId, ...added }];
      }
      if (changed) {
        data = data.map(appointment =>
          changed[appointment.id]
            ? { ...appointment, ...changed[appointment.id] }
            : appointment
        );
      }
      if (deleted !== undefined) {
        data = data.filter(appointment => appointment.id !== deleted);
      }
      return { data };
    });
  }
  convertDateFormat(fecha) {
    let d = new Date(fecha);
    let year = d.getFullYear();
    let month =
      d.getMonth() + 1 > 9 ? d.getMonth() + 1 : `0${d.getMonth() + 1}`;
    let day = d.getDate() > 9 ? d.getDate() : `0${d.getDate}`;

    return `${year}-${month}-${day}`;
  }
  convertHourFormat(fecha) {
    let d = new Date(fecha);
    let hours = d.getHours() > 9 ? d.getHours() : `0${d.getHours()}`;
    let minutes = d.getMinutes() > 9 ? d.getMinutes() : `0${d.getMinutes()}`;
    let seconds = d.getSeconds() > 9 ? d.getSeconds() : `0${d.getSeconds()}`;

    return `${hours}:${minutes}:${seconds}`;
  }
  render() {
    const {
      currentDate,
      resources,
      data,
      addedAppointment,
      appointmentChanges,
      editingAppointmentId
    } = this.state;
    return this.state.data.length > 1 ? (
      <Fragment>
        <div id="select-container">
          <FormControl variant="outlined">
            <InputLabel id="demo-simple-select-outlined-label">
              Sucursal
            </InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="select-sucursal"
              label="Sucursal"
              value={1}
            >
              {this.state.sucursales.map(s => {
                return (
                  <MenuItem value={s.id} key={s.id}>
                    {s.nombre}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>
        <div className="schedule_form">
          <div className="body_title">
            <div>Agenda</div>
          </div>

          <div className="schedule_body">
            <Paper>
              <Scheduler data={data} height={660} locale="es-ES">
                <ViewState currentDate={currentDate} />
                <EditingState
                  onCommitChanges={this.commitChanges}
                  addedAppointment={addedAppointment}
                  onAddedAppointmentChange={this.changeAddedAppointment}
                  appointmentChanges={appointmentChanges}
                  onAppointmentChangesChange={this.changeAppointmentChanges}
                  editingAppointmentId={editingAppointmentId}
                  onEditingAppointmentIdChange={this.changeEditingAppointmentId}
                  locale="es-ES"
                />
                <Toolbar />
                <DateNavigator />
                <WeekView startDayHour={9} endDayHour={22} locale="es-ES" />
                <EditRecurrenceMenu locale="es-ES" />
                <ConfirmationDialog locale="es-ES" />
                <Appointments locale="es-ES" />
                <AppointmentTooltip
                  showOpenButton
                  showDeleteButton
                  locale="es-ES"
                />
                <AppointmentForm locale="es-ES" />
                <Resources data={resources} mainResourceName="sucursal" />
                <DragDropProvider />
              </Scheduler>
            </Paper>
          </div>
        </div>
      </Fragment>
    ) : null;
  }
}

export default Schedule;
