import { CallApi } from "./CallApi";
import Environment from "../environment/Environment";

const Citas = {
  getAll(username) {
    let token = this.getTokenLogged();

    return CallApi(`/citas/?username=${username}`, token, {
      method: "GET",
      body: JSON.stringify()
    });
  },

  getByClient(cliente) {
    let token = this.getTokenLogged();

    return CallApi(`/citas/?cliente=${cliente}`, token, {
      method: "GET",
      body: JSON.stringify()
    });
  },

  add(
    cliente,
    sucursal,
    fecha,
    hora_inicio,
    hora_fin,
    tratamiento,
    observaciones
  ) {
    let token = this.getTokenLogged();
    return CallApi("/citas/", token, {
      method: "POST",
      body: JSON.stringify({
        cliente,
        sucursal,
        fecha,
        hora_inicio,
        hora_fin,
        tratamiento,
        observaciones
      })
    });
  },

  edit(id, data) {
    let token = this.getTokenLogged();

    return CallApi(`/citas/${id}/`, token, {
      method: "PUT",
      body: JSON.stringify(data)
    });
  },

  delete(id) {
    let token = this.getTokenLogged();
    return CallApi(`/citas/${id}/`, token, {
      method: "DELETE",
      body: JSON.stringify({})
    });
  },

  getTokenLogged() {
    let token = "";

    //if (localStorage.getItem("logged_user")) {
    //  token = Environment.ACCESS_TOKEN[localStorage.getItem("logged_user")].key;
    //} else {
    token = Environment.ACCESS_TOKEN["admin"].key;
    //}

    return token;
  }
};

export default Citas;
