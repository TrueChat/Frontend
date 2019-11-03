import React from 'react';
import AuthenticationPage from "./pages/auth/AuthenticationPage";
import { BrowserRouter, Route } from "react-router-dom";
import ProfilePage from "./pages/profile/ProfilePage";
import MainPage from "./pages/main/MainPage";
import MockUserService from "./services/mock/MockUserService";
import GroupCreationPage from "./pages/group/create/GroupCreationPage";
import MockGroupService from "./services/mock/MockGroupService";
import GroupEditPage from "./pages/group/edit/GroupEditPage";
import GroupPage from "./pages/group/GroupPage";

export default class App extends React.Component {

  state = {
    value: ""
  };

  private readonly baseUrl = "https://true-chat.herokuapp.com";
  // private readonly userService = new RemoteUserService(this.baseUrl, new RemoteAuthService(this.baseUrl));

  // For testing purposes
  private readonly userService = new MockUserService(300);
  private readonly groupService = new MockGroupService(300);

  render() {
    return (
      <BrowserRouter>
        <Route exact path="/">
          <MainPage userService={this.userService} />
        </Route>
        <Route exact path="/auth">
          <AuthenticationPage userService={this.userService} />
        </Route>
        <Route exact path="/group/">
          <GroupCreationPage groupService={this.groupService}/>
        </Route>
        <Route path="/group/:groupId">
          <GroupPage
            userService={this.userService}
            groupService={this.groupService}
          />
        </Route>
        <Route exact path="/profile">
          <ProfilePage userService={this.userService} />
        </Route>
      </BrowserRouter>
    )
  }
}