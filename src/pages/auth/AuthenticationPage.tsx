import React from "react";
import "./AuthenticationPage.scss";
import AuthForm, {SubmissionFailureHandler, SubmissionSuccessHandler} from "./components/AuthForm";
import {SignInData} from "./components/tabs/SignInTab";
import {SignUpData} from "./components/tabs/SignUpTab";
import UserService from "../../services/UserService";
import { Redirect } from "react-router-dom";

type AuthenticationPageProps = {
  userService: UserService
}

export type ConstraintViolation = {
  property: string,
  violates: boolean,
  message: string
}


export default class AuthenticationPage extends React.Component<AuthenticationPageProps> {

  state : {redirectTo?: string}  = {
    redirectTo: undefined
  };

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo}/>
    }
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
    this.setState(state => {
      return {
        ...state,
        redirectTo: "/profile"
      }
    })
  };
};