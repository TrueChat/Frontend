import React from "react";
import { Redirect } from "react-router-dom";
import UserService from "../../services/UserService";
import SearchView from "../../views/search/SearchView";

type Props = {
  userService: UserService
}

export default class MainPage extends React.Component<Props> {

  render() {
    // TODO temporary solution (or it should work this way) for asynchronous page reloading
    // which causes undefined behaviour such as we cannot predict 100% which page is loaded
    if (!this.props.userService.userIsPresent()) {
      return <Redirect to="/auth" />
    } else {
      return <SearchView userService={this.props.userService}/>
    }
  }

}