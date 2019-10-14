import React from "react";
import AuthFormInput from "../form-inputs/AuthFormInput";
import SubmitButton from "../common/SubmitButton";

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
            changeHandler={value => this.setField("email", value)}
          />
        </div>
        <div className="tab-section">
          <AuthFormInput
            label={"Password"}
            value={formData.password}
            changeHandler={value => this.setField("password", value)}
          />
        </div>
        <div className="tab-section">
          <AuthFormInput
            label={"Confirm password"}
            value={formData.confirmPassword}
            changeHandler={value => this.setField("confirmPassword", value)}
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

  setField = (field: string, value: string) => {
    this.setState((state: any) => {
      state.formData[field] = value;
      return state;
    });
  };
}
