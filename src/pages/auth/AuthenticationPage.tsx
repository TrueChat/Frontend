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

type ServerErrorResponse = {
  [key: string]: string[]
}

export default class AuthenticationPage extends React.Component<AuthenticationPageProps> {

  state : { signUpViolations: ConstraintViolation[], signInViolations: ConstraintViolation[] } = {
    signUpViolations: [],
    signInViolations: []
  };

  render() {
    const { authService } = this.props;
    const { signInViolations, signUpViolations } = this.state;
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
                  this.setState(state => ({
                    ...state,
                    signUpViolations: []
                  }));
                })
                .catch(error => {
                  this.setState(state => ({
                    ...state,
                    signUpViolations: this.translateConstraintViolations(error.response.data)
                  }));
                })
            }}
            signInViolations={signInViolations}
            signUpViolations={signUpViolations}
          />
        </div>
      </div>
    );
  }

  private translateConstraintViolations(errors: ServerErrorResponse) {
    const violations: ConstraintViolation[] = [];
    for (let key of Object.keys(errors)) {
      let violation: ConstraintViolation;
      if (key === "password1") {
        violation = this.newViolation("password", errors[key][0]);
      } else if (key === "password2") {
        violation = this.newViolation("confirmPassword", errors[key][0]);
      } else if (key === "username") {
        violation = this.newViolation("username", errors[key][0]);
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