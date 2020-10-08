import { CallApi } from "./CallApi";
import Environment from "../environment/Environment";

const Cliente = {
  add(first_name, last_name, email, telefono, fecha_nacimiento) {
    let token = this.getTokenLogged();
    return CallApi("/clientes/", token, {
      method: "POST",
      body: JSON.stringify({
        nombre: first_name,
        apellido: last_name,
        email,
        telefono,
        fecha_nacimiento
      })
    });
  },

  edit(cliente_id, first_name, last_name, email, telefono, fecha_nacimiento) {
    let token = this.getTokenLogged();
    return CallApi(`/clientes/${cliente_id}/`, token, {
      method: "PUT",
      body: JSON.stringify({
        nombre: first_name,
        apellido: last_name,
        email,
        telefono,
        fecha_nacimiento
      })
    });
  },

  delete(cliente_id) {
    let token = this.getTokenLogged();
    return CallApi(`/clientes/${cliente_id}/`, token, {
      method: "DELETE",
      body: JSON.stringify({})
    });
  },

  getAll() {
    let token = this.getTokenLogged();
    //console.log(token);
    return CallApi("/clientes/", token);
  },

  getTokenLogged() {
    //console.log(Environment.ACCESS_TOKEN);
    let token = "";

    //if (Environment.ACCESS_TOKEN[localStorage.getItem("logged_user")]) {
    //  token = Environment.ACCESS_TOKEN[localStorage.getItem("logged_user")].key;
    //} else {
    token = Environment.ACCESS_TOKEN["admin"].key;
    //}

    console.log(token);

    return token;
  }
};

export default Cliente;
