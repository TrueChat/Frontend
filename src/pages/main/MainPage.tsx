import UserService from "../../services/UserService";
import React from "react";
import { Redirect } from "react-router-dom";

type MainPageProps = {
  userService: UserService
}

export default class MainPage extends React.Component<MainPageProps> {

  render() {
    // TODO temporary solution (or it should work this way) for asynchronous page reloading
    // which causes undefined behaviour such as we cannot predict 100% which page is loaded
    if (!this.props.userService.userIsPresent()) {
      return <Redirect to="/auth" />
    } else {
      return <div>Main Page</div>
    }
  }

}