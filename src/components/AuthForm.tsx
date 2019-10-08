import React from "react";
import "./AuthForm.scss";
import AuthFormInput from "./auth/AuthFormInput";
require("bootstrap/dist/css/bootstrap.css");

enum Tab {
  SignIn, SignUp
}

const SubmitButton = () => (
  <span className="submit-button">
    Submit
  </span>
);

class SignUpTab extends React.Component {

  state = {
    login: "",
    password: ""
  };

  render() {
    return (
      <div>
        <div className="tab-section">
          <AuthFormInput
            label={"Login"}
            value={this.state.login}
            changeHandler={value => this.setField("login", value)}
          />
        </div>
        <div className="tab-section">
          <AuthFormInput
            label={"Password"}
            value={this.state.password}
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
    this.setState(state => ({
      ...state,
      [field]: value
    }));
  }

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
            ? <SignUpTab />
            : null
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