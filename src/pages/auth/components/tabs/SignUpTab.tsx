import React from "react";
import AuthFormInput from "../form-inputs/AuthFormInput";
import SubmitButton from "../common/SubmitButton";
import AuthFormCheckbox from "../form-inputs/AuthFormCheckbox";
import {ConstraintViolation} from "../../AuthenticationPage";
import ErrorMessage from "../common/ErrorMessage";

export type SignUpData = {
  email: string,
  login: string,
  password: string,
  remember: boolean
}

type SignUpTabProps = {
  onSubmit: (data: SignUpData, onFailure: (violations: ConstraintViolation[]) => void ) => void;
  violations?: ConstraintViolation[]
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
    violations: []
  };

  render() {
    const { formData } = this.state;
    const onSubmissionFailure = (violations: ConstraintViolation[]) => {
      this.setState(state => ({...state, violations: violations }))
    };
    return (
      <div>
        <div className="tab-section">
          <AuthFormInput
            label={"Login"}
            value={formData.login}
            changeHandler={value => this.setField("login", value)}
          />
          {this.renderViolationMessageIfPresent("login")}
        </div>
        <div className="tab-section">
          <AuthFormInput
            label={"Email"}
            value={formData.email}
            type="email"
            changeHandler={value => this.setField("email", value)}
          />
          {this.renderViolationMessageIfPresent("email")}
        </div>
        <div className="tab-section">
          <AuthFormInput
            label={"Password"}
            value={formData.password}
            type="password"
            changeHandler={value => this.setField("password", value)}
          />
          {this.renderViolationMessageIfPresent("password")}
        </div>
        <div className="tab-section">
          <AuthFormInput
            label={"Confirm password"}
            value={formData.confirmPassword}
            type="password"
            changeHandler={value => this.setField("confirmPassword", value)}
          />
          {this.renderViolationMessageIfPresent("confirmPassword")}
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
              this.props.onSubmit(formData, onSubmissionFailure);
            });
          }}/>
        </div>
      </div>
    )
  }

  private renderViolationMessageIfPresent(property: string) {
    const violation = this.findViolation(property, this.state.violations);
    if (violation !== null) {
      return <ErrorMessage message={violation.message}/>
    }
  }

  private validate(onSuccess: (formData: SignUpData) => void) {
    this.setState((state: any) => {
      const formData = state.formData;
      const violations: ConstraintViolation[] = [];
      this.checkEmail(formData.email, violations);
      this.checkLogin(formData.login, violations);
      this.checkPasswordMatch(formData.password, formData.confirmPassword, violations);
      state.violations = violations;
      return state;
    }, () => {
      if (this.isValid()) {
        onSuccess(this.state.formData);
      }
    });
  }


  // TODO code duplication: check functions have the same structure but differ only for several parameters
  private checkLogin(value: string, violations: ConstraintViolation[]) {
    const loginIsValid = (login: string) => login.length !== 0;
    if (!loginIsValid(value)) {
      if (!this.violationIsPresent("login", violations)) {
        violations.push({property: "login", violates: true, message: "invalid login"})
      }
    } else {
      this.removeViolation("login", violations);
    }
  }

  private checkEmail(value: string, violations: ConstraintViolation[]) {
    const emailIsValid = (email: string) => {
      return email.length >= 3 && email.indexOf("@") !== -1;
    };
    if (!emailIsValid(value)) {
      if (!this.violationIsPresent("email", violations)) {
        violations.push({property: "email", violates: true, message: "invalid email" })
      }
    } else {
      this.removeViolation("email", violations);
    }
  }

  private checkPasswordMatch(p1: string, p2: string, violations: ConstraintViolation[]) {
    if (p1 !== p2) {
      if (!this.violationIsPresent("confirmPassword", violations)) {
        violations.push({property: "confirmPassword", violates: true, message: "password dont match"});
      }
    } else {
      this.removeViolation("confirmPassword", violations);
    }
  }

  private violationIsPresent(property: string, violations: ConstraintViolation[]) : boolean {
    return this.findViolation(property, violations) !== null;
  }

  private findViolation(property: string, violations: ConstraintViolation[]) : null | ConstraintViolation {
    let i = violations.findIndex(violation => violation.property === property);
    if (i === -1) {
      return null;
    } else {
      return violations[i];
    }
  }

  private removeViolation(property: string, violations: ConstraintViolation[]) {
    let index = -1;
    for (let i = 0; i < violations.length; i++) {
      if (violations[i].property === property) {
        index = i;
        break;
      }
    }
    if (index !== -1) {
      violations.splice(index, 1);
    }
  }

  private isValid() {
    for (let violation of Object.values(this.state.violations) as ConstraintViolation[]) {
      if (violation.violates) {
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
