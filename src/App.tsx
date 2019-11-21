import React from 'react';
import {BrowserRouter, Route, Switch, Redirect} from "react-router-dom";
// import MockGroupService from "./services/mock/MockGroupService";
// import MockUserService from "./services/mock/MockUserService";
import MainPage from "./components/pages/main/MainPage";
import AuthenticationPage from "./components/pages/auth/AuthenticationPage";
import RemoteUserService from "./services/impl/RemoteUserService";
import RemoteGroupService from "./services/impl/RemoteGroupService";
import RemoteAuthService from "./services/impl/RemoteAuthService";
// import MockChatService from "./services/mock/MockChatService";
import HttpChatService from "./services/impl/HttpChatService";
import MockUserService from "./services/mock/MockUserService";
import MockGroupService from "./services/mock/MockGroupService";
import MockChatService from "./services/mock/MockChatService";


export default class App extends React.Component {

  constructor(props: any) {
    super(props);
    this.state = {
      value: "",
      previousLocation: props.location
    };
  }

  private readonly baseUrl = "https://true-chat.herokuapp.com";
  private readonly userService = new RemoteUserService(this.baseUrl, new RemoteAuthService(this.baseUrl));
  private readonly groupService = new RemoteGroupService(this.baseUrl, this.userService);
  private readonly chatService = new HttpChatService(this.userService, 1000, this.baseUrl);


  // For testing purposes
  // private readonly userService = new MockUserService(300);
  // private readonly groupService = new MockGroupService(300);
  // private readonly chatService = new MockChatService(1000);

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/auth">
            <AuthenticationPage userService={this.userService}/>
          </Route>
          <Route path="/" children={props => (
            <MainPage
              location={props.location}
              groupService={this.groupService}
              userService={this.userService}
              chatService={this.chatService}
            />
          )}/>
        </Switch>
      </BrowserRouter>
    )
  }
}