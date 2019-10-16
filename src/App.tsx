import React from 'react';
import AuthenticationPage from "./pages/auth/AuthenticationPage";
import AuthService from "./services/AuthService";
import UserService from "./services/UserService";
import { BrowserRouter, Route } from "react-router-dom";
import ProfilePage from "./pages/profile/ProfilePage";

export default class App extends React.Component {

  state = {
    value: ""
  };

  private userService = new UserService(new AuthService("https://true-chat.herokuapp.com"));

  render() {
    // return <AuthenticationPage userService={this.userService}/>
    return (
      <BrowserRouter>
        <Route path="/auth">
          <AuthenticationPage userService={this.userService} />
        </Route>
        <Route path="/profile">
          <ProfilePage userService={this.userService} />
        </Route>
      </BrowserRouter>
    )
  }
}