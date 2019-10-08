import React from 'react';
import AuthFormInput from "./components/auth/AuthFormInput";

export default class App extends React.Component {

  state = {
    value: ""
  };

  render() {
    return (
      <div style={{
        width: "300px",
        margin: "100px auto"
      }}>
        <AuthFormInput
          label="Label"
          value={this.state.value}
          changeHandler={value => {
            this.setState(state => ({
              ...state,
              value
            }))
          }}
        />
      </div>
    )
  }
}