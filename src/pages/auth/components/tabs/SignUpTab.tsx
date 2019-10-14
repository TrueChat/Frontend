import React from "react";
import AuthFormInput from "../form-inputs/AuthFormInput";
import SubmitButton from "../common/SubmitButton";
import AuthFormCheckbox from "../form-inputs/AuthFormCheckbox";
import ErrorMessage from "../common/ErrorMessage";

export type SignUpData = {
  email: string,
  login: string,
  password: string,
  remember: boolean
}

type SignUpTabProps = {
  onSubmit: (data: SignUpData) => void;
}

export default class SignUpTab extends React.Component<SignUpTabProps> {

  state = {
    formData: {
      email: "",
      password: "",
      confirmPassword: "",
      login: "",
      remember: false
    },
    isValid: true,
    violations: {
      passwordsDontMatch: false,
      invalidEmail: false,
      invalidLogin: false
    }
  };

  render() {
    const { formData, violations } = this.state;
    return (
      <div>
        <div className="tab-section">
          <AuthFormInput
            label={"Login"}
            value={formData.login}
            changeHandler={value => this.setField("login", value)}
          />
          {violations.invalidLogin ? <ErrorMessage message={"invalid login"} /> : null}
        </div>
        <div className="tab-section">
          <AuthFormInput
            label={"Email"}
            value={formData.email}
            type="email"
            changeHandler={value => this.setField("email", value)}
          />
          {violations.invalidEmail ? <ErrorMessage message={"invalid email"} /> : null}
        </div>
        <div className="tab-section">
          <AuthFormInput
            label={"Password"}
            value={formData.password}
            type="password"
            changeHandler={value => this.setField("password", value)}
          />
        </div>
        <div className="tab-section">
          <AuthFormInput
            label={"Confirm password"}
            value={formData.confirmPassword}
            type="password"
            changeHandler={value => this.setField("confirmPassword", value)}
          />
          {violations.passwordsDontMatch ? <ErrorMessage message={"passwords don't match"} /> : null}
        </div>
        <div className="tab-section">
          <AuthFormCheckbox
            onChange={value => this.setField("remember", value)}
            label="Remember me"
          />
        </div>
        <div className="tab-section text-right">
          <SubmitButton onClick={_ => {
            this.validate(formData => {
              this.props.onSubmit(formData);
            });
          }}/>
        </div>
      </div>
    )
  }

  private validate(onSuccess: (formData: SignUpData) => void) {
    this.setState((state: any) => {
      const formData = state.formData;
      state.violations.invalidEmail = !this.emailIsValid(formData.email);
      state.violations.invalidLogin = !this.loginIsValid(formData.login);
      state.violations.passwordsDontMatch = !this.passwordsMatch(formData.password, formData.confirmPassword);
      return state;
    }, () => {
      if (this.isValid()) {
        onSuccess(this.state.formData);
      }
    });
  }

  private loginIsValid(login: string) {
    return login.length !== 0;
  }

  private emailIsValid(email: string) {
    if (email.length < 3) {
      return false;
    }
    return email.indexOf("@") !== -1;
  }

  private passwordsMatch(p1: string, p2: string) {
    return p1 === p2;
  }

  private isValid() {
    for (let violation of Object.values(this.state.violations)) {
      if (violation) {
        return false;
      }
    }
    return true;
  }

  setField = (field: string, value: any) => {
    this.setState((state: any) => {
      state.formData[field] = value;
      return state;
    });
  };
}
