import React from "react";
import "./AuthForm.scss";
import {SignInData} from "./tabs/SignInTab";
import {SignUpData} from "./tabs/SignUpTab";
import SignInTab from "./tabs/SignInTab";
import SignUpTab from "./tabs/SignUpTab";
import {ConstraintViolation} from "../AuthenticationPage";

require("bootstrap/dist/css/bootstrap.css");

enum Tab {
  SignIn, SignUp
}

type AuthFormProperties = {
  onSignIn: (data: SignInData) => void,
  onSignUp: (data: SignUpData) => void,
  signInViolations?: ConstraintViolation[],
  signUpViolations?: ConstraintViolation[]
}

export default class AuthForm extends React.Component<AuthFormProperties> {

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
            ? <SignInTab onSubmit={data => this.props.onSignIn(data)}/>
            : <SignUpTab onSubmit={data => this.props.onSignUp(data)}/>
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