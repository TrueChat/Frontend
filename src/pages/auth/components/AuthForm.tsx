import React from "react";
import "./AuthForm.scss";
import {SignInData} from "./tabs/SignInTab";
import {SignUpData} from "./tabs/SignUpTab";
import SignInTab from "./tabs/SignInTab";
import SignUpTab from "./tabs/SignUpTab";
import {ConstraintViolation} from "../AuthenticationPage";
import {SubmissionFailureHandler, SubmissionSuccessHandler} from "../../../services/UserService";

require("bootstrap/dist/css/bootstrap.css");

enum Tab {
  SignIn, SignUp
}

type AuthFormProperties = {
  onSignIn: (
    data: SignInData,
    onFail: SubmissionFailureHandler,
    onSuccess: SubmissionSuccessHandler
  ) => void,
  onSignUp: (
    data: SignUpData,
    onFail: SubmissionFailureHandler,
    onSuccess: SubmissionSuccessHandler
  ) => void,
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
            ? <SignInTab onSubmit={(data, onFail, onSuccess) => {
              this.props.onSignIn(data, onFail, onSuccess);
            }}/>
            : <SignUpTab onSubmit={(data, onFail, onSuccess) => {
              this.props.onSignUp(data, onFail, onSuccess)
            }}/>
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