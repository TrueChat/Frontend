import UserService from "../../services/UserService";
import React from "react";
import { Redirect } from "react-router-dom";

type MainPageProps = {
  userService: UserService
}

export default class MainPage extends React.Component<MainPageProps> {

  render() {
    return <Redirect to="auth" />
  }

}