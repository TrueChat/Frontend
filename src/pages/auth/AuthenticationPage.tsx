import React from "react";
import "./AuthenticationPage.scss";
import AuthForm from "./components/AuthForm";

export default class AuthenticationPage extends React.Component {

  render() {
    return (
      <div className="Authentication-page">
        <div className="header">
          
        </div>
        <div className="form-container">
          <AuthForm />
        </div>
      </div>
    );
  }
}