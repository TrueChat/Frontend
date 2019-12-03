import React from 'react';
import {BrowserRouter, Route, Switch } from "react-router-dom";
import MainPage from "./components/pages/main/MainPage";
import AuthenticationPage from "./components/pages/auth/AuthenticationPage";
import RemoteUserService from "./services/impl/RemoteUserService";
import RemoteGroupService from "./services/impl/RemoteGroupService";
import RemoteAuthService from "./services/impl/RemoteAuthService";
import HttpChatService from "./services/impl/HttpChatService";
// import MockUserService from "./services/mock/MockUserService";
// import MockGroupService from "./services/mock/MockGroupService";
// import MockChatService from "./services/mock/MockChatService";
import RemotePrivateChatService from "./services/impl/RemotePrivateChatService";
// import MockStatisticsService from "./services/mock/MockStatisticsService";
// import MockPrivateChatService from "./services/mock/MockPrivateChatService";
import RemoteStatisticsService from "./services/impl/RemoteStatisticsService";


export default class App extends React.Component {

  constructor(props: any) {
    super(props);
    this.state = {
      value: "",
      previousLocation: props.location
    };
  }

  private readonly baseUrl = "https://true-chat.herokuapp.com";
  private readonly statisticsBaseUrl = "https://truechat-stats.herokuapp.com";
  private readonly userService = new RemoteUserService(this.baseUrl, new RemoteAuthService(this.baseUrl));
  private readonly groupService = new RemoteGroupService(this.baseUrl, this.userService);
  private readonly chatService = new HttpChatService(this.userService, 1000, this.baseUrl);
  private readonly privateChatService = new RemotePrivateChatService(this.baseUrl, this.userService);
  private readonly statisticsService= new RemoteStatisticsService(this.statisticsBaseUrl, this.userService);
  //
  // For testing purposes
  // private readonly userService = new MockUserService(300);
  // private readonly groupService = new MockGroupService(300);
  // private readonly chatService = new MockChatService(50000);
  // private readonly privateChatService = new MockPrivateChatService();
  // private readonly statisticsService = new MockStatisticsService(300);

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
              privateChatService={this.privateChatService}
              statisticsService={this.statisticsService}
            />
          )}/>
        </Switch>
      </BrowserRouter>
    )
  }
}