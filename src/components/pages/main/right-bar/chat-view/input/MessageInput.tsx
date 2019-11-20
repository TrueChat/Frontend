import React from "react";
import "./MessageInput.scss"

export default class MessageInput extends React.Component<Props> {

  render() {
    const { value, onChange, onEnter, placeholder } = this.props;
    return (
      <input
        type="text"
        value={value}
        className="Message-input"
        onChange={e => {
          onChange(e.currentTarget.value);
        }}
        placeholder={placeholder}
        onKeyDown={e => {
          if (e.keyCode === 13) {
            onEnter && onEnter();
          }
        }}
      />
    )
  }

}

type Props = {
  value: string,
  onChange: (value: string) => void,
  onEnter?: () => void,
  placeholder?: string
}