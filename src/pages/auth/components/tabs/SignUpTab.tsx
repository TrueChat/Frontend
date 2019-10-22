import React from "react";
import AuthFormInput from "../form-inputs/AuthFormInput";
import SubmitButton from "../../../common/SubmitButton";
import AuthFormCheckbox from "../form-inputs/AuthFormCheckbox";
import {ConstraintViolation} from "../../AuthenticationPage";
import ErrorMessage from "../common/ErrorMessage";
import {ClipLoader} from "react-spinners";
import {SubmissionFailureHandler, SubmissionSuccessHandler} from "../../../../services/UserService";

export type SignUpData = {
  email: string,
  login: string,
  password: string,
  remember: boolean
}

type SignUpTabProps = {
  onSubmit: (
    data: SignUpData,
    onFailure: SubmissionFailureHandler,
    onSuccess: SubmissionSuccessHandler
  ) => void;
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
    violations: [],
    loading: false,
    submitted: false
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
        {this.state.loading ? this.showSpinner() : null}
        {this.state.submitted ? this.showSuccessMessage() : this.showSubmitButton()}
      </div>
    );
  }

  private showSubmitButton() {
    return (
      <div className="tab-section text-right">
        <SubmitButton onClick={this.submitData}/>
      </div>
    );
  }

  private showSpinner() {
    return (
      <div className="tab-section text-center">
        <ClipLoader color="rgb(153, 153, 153)"/>
      </div>
    );
  }

  private showSuccessMessage() {
    return (
      <div>
        <div className="tab-section text-center">
          <div className="c-attention">
            Verification email has been sent. Check your mail.
          </div>
        </div>
        <div className="tab-section text-center">
          {/*//TODO should use React Router*/}
          <a className="Submit-button a-none" href="/profile">
            OK
          </a>
        </div>
      </div>
    );
  }

  private submitData = () => {
    const onSubmissionFailure = (violations: ConstraintViolation[]) => {
      this.setState(state => ({...state, violations: violations, loading: false }))
    };
    const onSubmissionSuccess = () => {
      this.setState(state => ({ ...state, loading: false, submitted: true }));
    };
    this.setState((state: any) => {
      this.props.onSubmit(state.formData, onSubmissionFailure, onSubmissionSuccess);
      state.loading = true;
      return state;
    });
  };

  private renderViolationMessageIfPresent(property: string) {
    const violation = this.findViolation(property, this.state.violations);
    if (violation !== null) {
      return <ErrorMessage message={violation.message}/>
    }
  }

  private findViolation(property: string, violations: ConstraintViolation[]) : null | ConstraintViolation {
    let i = violations.findIndex(violation => violation.property === property);
    if (i === -1) {
      return null;
    } else {
      return violations[i];
    }
  }

  setField = (field: string, value: any) => {
    this.setState((state: any) => {
      state.formData[field] = value;
      return state;
    });
  };
}
