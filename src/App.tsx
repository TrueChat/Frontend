import React from 'react';
import AuthForm from "./components/AuthForm";

export default class App extends React.Component {

  state = {
    value: ""
  };

  render() {
    return (
      <div style={{
        width: "500px",
        margin: "0 auto"
      }}>
        <AuthForm />
      </div>
    );
  }
}