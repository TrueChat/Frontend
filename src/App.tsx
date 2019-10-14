import React from 'react';
import AuthenticationPage from "./pages/auth/AuthenticationPage";

export default class App extends React.Component {

  state = {
    value: ""
  };

  render() {
    return <AuthenticationPage />
  }
}