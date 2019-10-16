import React from 'react';
import AuthenticationPage from "./pages/auth/AuthenticationPage";
import AuthService from "./services/AuthService";
import UserService from "./services/UserService";

export default class App extends React.Component {

  state = {
    value: ""
  };

  private userService = new UserService(new AuthService("https://true-chat.herokuapp.com"));

  render() {
    return <AuthenticationPage userService={this.userService}/>
  }
}