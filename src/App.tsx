import React from 'react';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import MockGroupService from "./services/mock/MockGroupService";
import MockUserService from "./services/mock/MockUserService";
import MainPage from "./components/pages/main/MainPage";

export default class App extends React.Component {

  constructor(props: any) {
    super(props);
    this.state = {
      value: "",
      previousLocation: props.location
    };
  }

  private readonly baseUrl = "https://true-chat.herokuapp.com";
  // private readonly userService = new RemoteUserService(this.baseUrl, new RemoteAuthService(this.baseUrl));
  // private readonly groupService = new RemoteGroupService(this.baseUrl, this.userService);

  // For testing purposes
  private readonly userService = new MockUserService(300);
  private readonly groupService = new MockGroupService(300);

  render() {
    return (
      <BrowserRouter>
          <Route exact path="/" children={props => (
            <MainPage
              location={props.location}
              groupService={this.groupService}
              userService={this.userService}
            />
          )}/>
      </BrowserRouter>
    )
  }
}