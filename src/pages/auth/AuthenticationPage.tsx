import React from "react";
import "./AuthenticationPage.scss";
import AuthForm from "./components/AuthForm";
import AuthService from "../../services/AuthService";
import {SignInData} from "./components/tabs/SignInTab";
import {SignUpData} from "./components/tabs/SignUpTab";

type AuthenticationPageProps = {
  authService: AuthService
}

export type ConstraintViolation = {
  property: string,
  violates: boolean,
  message: string
}

type ServerErrorResponse = {
  [key: string]: string[]
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

  private handleSignIn = (data: SignInData, onFail: (violations: ConstraintViolation[]) => void) => {
    this.props.authService
      .login(data.login, data.password)
      .then(response => {
        alert("successfully signed in");
      })
      .catch(error => {
        onFail(this.translateConstraintViolations(error.response.data));
      })
  };

  private handleSignUp = (data: SignUpData, onFail: (violations: ConstraintViolation[]) => void) => {
    this.props.authService
      .register(data.login, data.email, data.password)
      .then(response => {
        alert("successfully signed up");
      })
      .catch(error => {
        onFail(this.translateConstraintViolations(error.response.data));
      })
  };

  private translateConstraintViolations(errors: ServerErrorResponse) {
    const violations: ConstraintViolation[] = [];
    for (let key of Object.keys(errors)) {
      let violation: ConstraintViolation;
      if (key === "password1") {
        violation = this.newViolation("password", errors[key][0]);
      } else if (key === "password2") {
        violation = this.newViolation("confirmPassword", errors[key][0]);
      } else if (key === "username") {
        violation = this.newViolation("login", errors[key][0]);
      } else if (key === "non_field_errors") {
        violation = this.newViolation("_other", errors[key][0]);
      } else {
        violation = this.newViolation(key, errors[key][0]);
      }
      violations.push(violation)
    }
    return violations;
  }

  private newViolation(property: string, message: string) : ConstraintViolation {
    return {
      property: property, violates: true, message: message
    }
  }

}