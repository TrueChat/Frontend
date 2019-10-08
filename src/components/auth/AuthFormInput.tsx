import React, {ReactElement} from "react";
import "./AuthFormInput.scss";

type AuthFormInputProps = {
  label: string|ReactElement,
  value: string,
  changeHandler: (value: string) => void
}

export default class AuthFormInput extends React.Component<AuthFormInputProps> {

  render() {
    const { label, value, changeHandler } = this.props;
    return (
      <div className="Auth-form-input">
          <div className="label">{label}</div>
          <input
            className="input"
            type="text"
            value={value}
            onChange={event => changeHandler(event.currentTarget.value)}
          />
      </div>
    )
  }
}