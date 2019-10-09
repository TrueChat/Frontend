import React from "react";
import "./AuthForm.scss";
import AuthFormInput from "./form-inputs/AuthFormInput";
require("bootstrap/dist/css/bootstrap.css");

enum Tab {
  SignIn, SignUp
}

const SubmitButton = () => (
  <span className="submit-button">
    Submit
  </span>
);

class SignInTab extends React.Component {

  state = {
    formData: {
      login: "",
      password: ""
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
            label={"Password"}
            value={formData.password}
            changeHandler={value => this.setField("password", value)}
          />
        </div>
        <div className="text-right tab-section">
          <SubmitButton/>
        </div>
      </div>
    );
  }

  setField = (field: string, value: string) => {
    this.setState((state: any) => {
      state.formData[field] = value;
      return state;
    });
  };
}

class SignUpTab extends React.Component {

  state = {
    formData: {
      email: "",
      password: "",
      confirmPassword: "",
      login: ""
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
          <SubmitButton />
        </div>
      </div>
    )
  }

  setField = (field: string, value: string) => {
    this.setState((state: any) => {
      state.formData[field] = value;
      return state;
    });
  };
}

export default class AuthForm extends React.Component {

  state = {
    activeTab: Tab.SignIn,
  };

  TabControl = ({tabName, label} : {tabName: Tab, label: string}) => (
    <div
      className={`control${this.state.activeTab === tabName ? " active" : ""}`}
      onClick={_ => this.setActiveTab(tabName)}
    >
      {label}
    </div>
  );

  render() {
    const TabControl = this.TabControl;

    return (
      <div className="Auth-form">
        <div className="header">
        </div>
        <div className="tab-controls row">
          <div className="col-6">
            <TabControl tabName={Tab.SignIn} label={"Sign In"}/>
          </div>
          <div className="col-6">
            <TabControl tabName={Tab.SignUp} label={"Sign Up"}/>
          </div>
        </div>
        <div className="body">
          {this.state.activeTab === Tab.SignIn
            ? <SignInTab />
            : <SignUpTab />
          }
        </div>
      </div>
    );
  }

  setActiveTab(tab: Tab) {
    this.setState(state => ({
      ...state,
      activeTab: tab
    }));
  }

}