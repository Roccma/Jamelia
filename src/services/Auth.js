import { CallApi } from "./CallApi";
import Environment from "../environment/Environment";

const Auth = {
  getToken(username, password) {
    let token = this.getTokenLogged();
    return CallApi("/api/token/", token, {
      method: "POST",
      body: JSON.stringify({ username, password })
    });
  },
  refresh(username) {
    let token = this.getTokenLogged();
    CallApi("/api/token/refresh/", token, {
      method: "POST",
      body: JSON.stringify({
        refresh: Environment.REFRESH_TOKEN[username]
      })
    }).then(resp => {
      Environment.ACCESS_TOKEN = {
        ...Environment.ACCESS_TOKEN,
        [localStorage.getItem("logged_user")]: {
          key: resp.access,
          date: new Date()
        }
      };
    });
  },

  getTokenLogged() {
    let token = "";

    if (localStorage.getItem("logged_user")) {
      token = Environment.ACCESS_TOKEN[localStorage.getItem("logged_user")];
    }

    return token;
  }
};

export default Auth;
