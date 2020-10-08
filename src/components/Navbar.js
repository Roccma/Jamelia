import React, { Component, Fragment } from "react";
import "./styles/Navbar.css";
import Environment from "../environment/Environment";
import Notiflix from "notiflix-react";
import { Link } from "react-router-dom";
import logo from "../images/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faCalendar,
  faUsers,
  faUser,
  faSignOutAlt,
  faAddressBook
} from "@fortawesome/free-solid-svg-icons";

class Navbar extends Component {
  constructor() {
    super();
    Notiflix.Notify.Init({
      width: "500px",
      position: "right-top",
      distance: "15px",
      fontSize: "18px"
    });

    //this.fetchData();
  }

  render() {
    return (
      <Fragment>
        <nav className="navbar navbar-expand-lg navbar-light">
          <a className="navbar-brand" href="#">
            <img src={logo} width="100" height="40" alt=""></img>
          </a>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/home">
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <FontAwesomeIcon icon={faHome}></FontAwesomeIcon>
                  &nbsp;&nbsp;Inicio
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/clientes">
                  <FontAwesomeIcon icon={faAddressBook}></FontAwesomeIcon>
                  &nbsp;&nbsp;Clientes
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/agenda">
                  <FontAwesomeIcon icon={faCalendar}></FontAwesomeIcon>
                  &nbsp;&nbsp;Agenda
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/usuarios">
                  &nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <FontAwesomeIcon icon={faUsers}></FontAwesomeIcon>
                  &nbsp;&nbsp;Usuarios
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  <FontAwesomeIcon icon={faSignOutAlt}></FontAwesomeIcon>
                  &nbsp;&nbsp;Salir
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </Fragment>
    );
  }
}

export default Navbar;
