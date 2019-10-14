import React from "react";
import AuthFormInput from "../form-inputs/AuthFormInput";
import SubmitButton from "../common/SubmitButton";
import AuthFormCheckbox from "../form-inputs/AuthFormCheckbox";

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
    }
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
        </div>
        <div className="tab-section">
          <AuthFormInput
            label={"Email"}
            value={formData.email}
            type="email"
            changeHandler={value => this.setField("email", value)}
          />
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
        </div>
        <div className="tab-section">
          <AuthFormCheckbox
            onChange={value => this.setField("remember", value)}
            label="Remember me"
          />
        </div>
        <div className="tab-section text-right">
          {/* TODO: add validation */}
          <SubmitButton onClick={event => {
            this.validate();
            this.props.onSubmit(this.state.formData);
          }}/>
        </div>
      </div>
    )
  }

  private validate() {

  }

  setField = (field: string, value: any) => {
    this.setState((state: any) => {
      state.formData[field] = value;
      return state;
    });
  };
}
