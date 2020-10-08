import { CallApi } from "./CallApi";
import Environment from "../environment/Environment";

const Sucursales = {
  getAll() {
    let token = this.getTokenLogged();

    return CallApi("/sucursales/", token, {
      method: "GET",
      body: JSON.stringify()
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

export default Sucursales;
