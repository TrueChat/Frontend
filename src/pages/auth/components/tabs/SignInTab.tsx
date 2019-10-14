import React from "react";
import AuthFormInput from "../form-inputs/AuthFormInput";
import SubmitButton from "../common/SubmitButton"
import AuthFormCheckbox from "../form-inputs/AuthFormCheckbox";
import {ConstraintViolation} from "../../AuthenticationPage";
import ErrorMessage from "../common/ErrorMessage";

export type SignInData = {
  login: string,
  password: string
  remember: boolean
}

type SignInTabProps = {
  onSubmit: (data: SignInData) => void,
  violations?: ConstraintViolation[]
}

export default class SignInTab extends React.Component<SignInTabProps> {

  state = {
    formData: {
      login: "",
      password: "",
      remember: false
    },
  };

  render() {
    const { formData } = this.state;
    return (
      <div>
        <div className="tab-section">
          <AuthFormInput
            label={"Login"}
            value={formData.login}
            changeHandler={value => this.setField("login", value)}
          />
          {this.renderConstraintViolationMessageIfAny("login")}
        </div>
        <div className="tab-section">
          <AuthFormInput
            label={"Password"}
            value={formData.password}
            type="password"
            changeHandler={value => this.setField("password", value)}
          />
          {this.renderConstraintViolationMessageIfAny("password")}
        </div>
        <div className="tab-section">
          <AuthFormCheckbox
            onChange={value => this.setField("remember", value)}
            label="Remember me"
          />
        </div>
        <div className="text-right tab-section">
          <SubmitButton onClick={event => {
            this.props.onSubmit(this.state.formData);
          }}/>
        </div>
      </div>
    );
  }

  private renderConstraintViolationMessageIfAny(name: string) {
    const { violations } = this.props;
    if (violations !== undefined) {
      for (let violation of violations) {
        if (violation.property === name && violation.violates) {
          return <ErrorMessage message={violation.message}/>
        }
      }
    } else {
      return null;
    }
  }

  private setField = (field: string, value: any) => {
    this.setState((state: any) => {
      state.formData[field] = value;
      return state;
    });
  };
}