import React, {ReactElement} from 'react';
import AuthenticationPage from "./components/pages/auth/AuthenticationPage";
import { BrowserRouter, Route } from "react-router-dom";
import MainPage from "./components/pages/main/MainPage";
import MockGroupService from "./services/mock/MockGroupService";
import MockUserService from "./services/mock/MockUserService";

export default class App extends React.Component {

  state = {
    value: "",
    modal: null
  };

  private readonly baseUrl = "https://true-chat.herokuapp.com";
  // private readonly userService = new RemoteUserService(this.baseUrl, new RemoteAuthService(this.baseUrl));
  // private readonly groupService = new RemoteGroupService(this.baseUrl, this.userService);

  // For testing purposes
  private readonly userService = new MockUserService(300);
  private readonly groupService = new MockGroupService(300);

  render() {
    return (
      <BrowserRouter>
        <Route exact path="/">
          <MainPage groupService={this.groupService} userService={this.userService}/>
        </Route>
        <Route exact path="/auth">
          <AuthenticationPage userService={this.userService}/>
        </Route>
      </BrowserRouter>
    )
  }

}