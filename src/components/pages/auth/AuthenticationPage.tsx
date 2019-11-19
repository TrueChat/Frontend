import React from "react";
import "./AuthenticationPage.scss";
import AuthForm from "./components/AuthForm";
import {SignInData} from "./components/tabs/SignInTab";
import {SignUpData} from "./components/tabs/SignUpTab";
import { Redirect } from "react-router-dom";
import HeaderImage from "../../../resources/Form-Header.png";
import UserService, {SubmissionFailureHandler, SubmissionSuccessHandler} from "../../../services/UserService";
import AbsoluteHeader from "../layout/AbsoluteHeader";

type AuthenticationPageProps = {
  userService: UserService
}

export default class AuthenticationPage extends React.Component<AuthenticationPageProps> {

  state : {redirectTo?: string}  = {
    redirectTo: undefined
  };

  render() {
    if (this.props.userService.userIsPresent()) {
      return <Redirect to="/"/>
    }
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo}/>
    }
    return (
      <div className="Authentication-page">
        <AbsoluteHeader>
          <div className="header-image-container">
            <img src={HeaderImage} />
          </div>
        </AbsoluteHeader>
        <div className="form-container">
          <AuthForm
            onSignIn={this.handleSignIn}
            onSignUp={this.handleSignUp}
          />
        </div>
      </div>
    );
  }

  private handleSignIn = (data: SignInData, onFail: SubmissionFailureHandler) => {
    let _onSuccess = () => {
      this.redirectToProfilePage();
    };
    this.props.userService
      .login(data.login, data.password, _onSuccess, onFail);
  };

  private handleSignUp = (data: SignUpData, onFail: SubmissionFailureHandler, onSuccess: SubmissionSuccessHandler) => {
    const _onSuccess = () => {
      onSuccess();
    };
    this.props.userService
      .register({
        username: data.login,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword
      }, _onSuccess, onFail)
  };

  private redirectToProfilePage() {
    this.setState(state => ({
      ...state,
      redirectTo: "/profile"
    }));
  }

};