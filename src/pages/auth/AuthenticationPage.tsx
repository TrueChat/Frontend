import React from "react";
import "./AuthenticationPage.scss";
import AuthForm, {SubmissionFailureHandler, SubmissionSuccessHandler} from "./components/AuthForm";
import {SignInData} from "./components/tabs/SignInTab";
import {SignUpData} from "./components/tabs/SignUpTab";
import UserService from "../../services/UserService";

type AuthenticationPageProps = {
  userService: UserService
}

export type ConstraintViolation = {
  property: string,
  violates: boolean,
  message: string
}


export default class AuthenticationPage extends React.Component<AuthenticationPageProps> {

  render() {
    return (
      <div className="Authentication-page">
        <div className="header">
          
        </div>
        <div className="form-container">
          <AuthForm
            onSignIn={this.handleSignIn}
            onSignUp={this.handleSignUp}
          />
        </div>
      </div>
    );
  }

  private handleSignIn = (data: SignInData, onFail: SubmissionFailureHandler, onSuccess: SubmissionSuccessHandler) => {
    let _onSuccess = () =>{
      onSuccess();
      this.redirectToProfilePage();
    };
    this.props.userService
      .login(data.login, data.password, _onSuccess, onFail);
  };

  private handleSignUp = (data: SignUpData, onFail: SubmissionFailureHandler, onSuccess: SubmissionSuccessHandler) => {
    const _onSuccess = () => {
      onSuccess();
      this.redirectToProfilePage();
    };
    this.props.userService
      .register(data.login, data.email, data.password, _onSuccess, onFail)
  };

  private redirectToProfilePage = () => {
    console.log("implement redirect to profile page");
  };
};