import React from "react";
import "./AuthFormCheckbox.scss";

type AuthFormCheckboxProps = {
  onChange: (value: boolean) => void
  label: string
}

export default class AuthFormCheckbox extends React.Component<AuthFormCheckboxProps> {

  render() {
    const { label, onChange } = this.props;
    return (
      <label className="Auth-form-checkbox">
        <input type="checkbox" onChange={event => {
          onChange(event.currentTarget.checked);
        }}/>
        &nbsp;
        {label}
      </label>
    );
  }

}