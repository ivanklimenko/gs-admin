import {AuthProvider} from "@pankod/refine-core";
import Cookies from "js-cookie";
import {settings} from "./common/settings";
import {EUserRole, IUser} from "interfaces/users";
import * as queryString from "query-string";

interface IToken {
  access_token: 'string';
}

export const authProvider: AuthProvider = {
  login: async ({ username, password, ...props }) => {
    //return Promise.resolve();

    let response = await fetch(`${settings.api.url}/auth/login_by_username`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: JSON.stringify({username, password})
    });

    if (response.ok) {
      let json = await response.json() as IToken;
      Cookies.set(settings.auth.token, json.access_token)
      //note: not good, but...
      window.location.href = !queryString.parse(window.location.search)?.to ? '/' : `${queryString.parse(window.location.search).to}`
      return Promise.resolve();
    } else {
      //alert("Ошибка HTTP: " + response.status);
      return Promise.reject({name: "Ошибка", message: 'Неверный логин или пароль'});
    }
  },
  logout: () => {
    Cookies.remove(settings.auth.token);
    return Promise.resolve();
  },
  checkError: () => Promise.resolve(),
  checkAuth: () => {
    const token = Cookies.get(settings.auth.token);
    if (token) {
      return Promise.resolve();
    }

    return Promise.reject();
  },
  getPermissions: async () => {
    let response = await fetch(`${settings.api.url}/users/me`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': `Bearer ${Cookies.get(settings.auth.token)}`
      }
    });

    if (response.ok) {
      let json = await response.json() as IUser;
      return Promise.resolve(json.roles);
    } else {
      //alert("Ошибка HTTP: " + response.status);
      return Promise.reject();
    }
  },
  getUserIdentity: async () => {
    //const token = localStorage.getItem(TOKEN_KEY);
    // if (!token) {
    //   return Promise.reject();
    // }

    let response = await fetch(`${settings.api.url}/users/me`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': `Bearer ${Cookies.get(settings.auth.token)}`
      }
    });

    if (response.ok) {
      let json = await response.json() as IUser;
      return Promise.resolve(json);
    } else {
      //alert("Ошибка HTTP: " + response.status);
      return Promise.reject();
    }
  },
};
