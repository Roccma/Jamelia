import { CallApi } from "./CallApi";
import Environment from "../environment/Environment";

const User = {
  add(username, first_name, last_name, email, sucursal, password) {
    let token = this.getTokenLogged();
    return CallApi("/users/", token, {
      method: "POST",
      body: JSON.stringify({
        username,
        first_name,
        last_name,
        email,
        profile: { sucursal },
        password
      })
    });
  },

  getAll() {
    let token = this.getTokenLogged();
    return CallApi("/users/", token);
  },

  getTokenLogged() {
    let token = "";

    //if (localStorage.getItem("logged_user")) {
    //  token = Environment.ACCESS_TOKEN[localStorage.getItem("logged_user")].key;
    //}

    token = Environment.ACCESS_TOKEN["admin"].key;

    return token;
  }
};

export default User;
