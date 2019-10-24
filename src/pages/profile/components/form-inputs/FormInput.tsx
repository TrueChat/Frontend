import React from "react";
import "./FormInput.scss";

export type FormInputProps = {
  onChange: (value: string) => void,
  value: string
};

export default class FormInput extends React.Component<FormInputProps> {

  state = {
    focus: false
  };

  inputRef = React.createRef<HTMLInputElement>();

  render() {
    const EditIcon = () => <div className="edit-icon-wrapper"><i className="edit-icon" /></div>;
    const { onChange, value } = this.props;
    const { focus } = this.state;
    return (
      <div className="Form-input">
        <input
          type="text"
          className={`input${focus ? " focus": ""}`}
          onFocus={_ => this.setFocus(true)}
          onBlur={_ => this.setFocus(false)}
          onChange={e => onChange(e.currentTarget.value)} value={value}
          ref={this.inputRef}
        />
        {focus ? null : <EditIcon/> }
      </div>
    );
  }

  private setFocus(value: boolean) {
    this.setState(state => {
      return {
        ...state,
        focus: value
      };
    })
  }
}