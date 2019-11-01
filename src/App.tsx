import React from 'react';
import AuthenticationPage from "./pages/auth/AuthenticationPage";
import RemoteAuthService from "./services/impl/RemoteAuthService";
import RemoteUserService from "./services/impl/RemoteUserService";
import { BrowserRouter, Route } from "react-router-dom";
import ProfilePage from "./pages/profile/ProfilePage";
import MainPage from "./pages/main/MainPage";
import MockUserService from "./testing/MockUserService";
import GroupCreationPage from "./pages/group/creation/GroupCreationPage";
import GroupService from "./services/GroupService";
import MockGroupService from "./testing/MockGroupService";
import GroupEditingPage from "./pages/group/editing/GroupEditingPage";

export default class App extends React.Component {

  state = {
    value: ""
  };

  private readonly baseUrl = "https://true-chat.herokuapp.com";
  // private readonly userService = new RemoteUserService(this.baseUrl, new RemoteAuthService(this.baseUrl));

  // For testing purposes
  private readonly userService = new MockUserService(1000);
  private readonly groupService = new MockGroupService(1000);

  render() {
    return (
      <BrowserRouter>
        <Route exact path="/">
          <MainPage userService={this.userService} />
        </Route>
        <Route exact path="/auth">
          <AuthenticationPage userService={this.userService} />
        </Route>
        <Route exact path="/group-creation">
          <GroupCreationPage groupService={this.groupService}/>
        </Route>
        <Route exact path="/group-editing">
          <GroupEditingPage groupService={this.groupService} />
        </Route>
        <Route exact path="/profile">
          <ProfilePage userService={this.userService} />
        </Route>
      </BrowserRouter>
    )
  }
}