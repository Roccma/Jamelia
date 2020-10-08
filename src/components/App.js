import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Login from "../pages/Login";
import Registro from "../pages/Registro";
import Home from "../pages/Home";
import Clientes from "../pages/Clientes";
import Schedule from "../pages/Schedule";
import Historia from "../pages/Historia";
import Usuarios from "../pages/Usuarios";

export default function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Login}></Route>
        <Route exact path="/login" component={Login}></Route>
        <Route exact path="/registro" component={Registro}></Route>
        <Route exact path="/home" component={Home}></Route>
        <Route exact path="/clientes" component={Clientes}></Route>
        <Route exact path="/agenda" component={Schedule}></Route>
        <Route exact path="/historia" component={Historia}></Route>
        <Route exact path="/usuarios" component={Usuarios}></Route>
      </Switch>
    </BrowserRouter>
  );
}
