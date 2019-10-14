import React from "react";
import "./AuthenticationPage.scss";
import AuthForm from "./components/AuthForm";
import AuthService from "../../services/AuthService";

type AuthenticationPageProps = {
  authService: AuthService
}

export default class AuthenticationPage extends React.Component<AuthenticationPageProps> {

  render() {
    const { authService } = this.props;
    return (
      <div className="Authentication-page">
        <div className="header">
          
        </div>
        <div className="form-container">
          <AuthForm
            onSignInSubmit={data => console.log(data)}
            onSignUpSubmit={data => console.log(data)}
          />
        </div>
      </div>
    );
  }
}