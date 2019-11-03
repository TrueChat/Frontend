import React from 'react';
import AuthenticationPage from "./pages/auth/AuthenticationPage";
import { BrowserRouter, Route } from "react-router-dom";
import ProfileEditPage from "./pages/profile/edit/ProfileEditPage";
import MainPage from "./pages/main/MainPage";
import MockUserService from "./services/mock/MockUserService";
import GroupCreationPage from "./pages/group/create/GroupCreationPage";
import MockGroupService from "./services/mock/MockGroupService";
import GroupProfilePage from "./pages/group/GroupProfilePage";
import UserProfilePage from "./pages/profile/UserProfilePage";

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
          <GroupProfilePage
            userService={this.userService}
            groupService={this.groupService}
          />
        </Route>
        <Route exact path="/profile">
          <ProfileEditPage userService={this.userService} />
        </Route>
        <Route path="/profile/:username">
          <UserProfilePage userService={this.userService} />
        </Route>
      </BrowserRouter>
    )
  }
}