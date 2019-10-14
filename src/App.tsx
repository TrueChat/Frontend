import React from 'react';
import AuthenticationPage from "./pages/auth/AuthenticationPage";
import AuthService from "./services/AuthService";

export default class App extends React.Component {

  state = {
    value: ""
  };

  private authService = new AuthService("https://true-chat.herokuapp.com");

  render() {
    return <AuthenticationPage authService={this.authService}/>
  }
}