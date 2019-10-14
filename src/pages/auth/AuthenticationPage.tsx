import React from "react";
import "./AuthenticationPage.scss";
import AuthForm from "./components/AuthForm";
import AuthService from "../../services/AuthService";

type AuthenticationPageProps = {
  authService: AuthService
}

export type ConstraintViolation = {
  property: string,
  violates: boolean,
  message: string
}

export default class AuthenticationPage extends React.Component<AuthenticationPageProps> {

  state : { signUpViolations: ConstraintViolation[], signInViolations: [] } = {
    signUpViolations: [],
    signInViolations: []
  };

  render() {
    const { authService } = this.props;
    return (
      <div className="Authentication-page">
        <div className="header">
          
        </div>
        <div className="form-container">
          <AuthForm
            onSignIn={data => {

            }}
            onSignUp={data => {
              authService
                .register(data.login, data.email, data.password)
                .then(response => {
                  // do smth with key
                });
            }}
          />
        </div>
      </div>
    );
  }
}