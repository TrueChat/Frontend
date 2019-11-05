import React from "react";

type Props = {
  value: string,
  onChange: (value: string) => void,
  placeholder?: string,
  onEnter?: () => void
}

const Input = (props: Props) => (
  <input
    className="Input"
    onChange={(e) => props.onChange(e.currentTarget.value)}
    onKeyDown={e => {
      if (e.keyCode === 13) {
        props.onEnter && props.onEnter();
      }
    }}
    value={props.value}
    placeholder={props.placeholder ? props.placeholder : ""}
  />
);

export default Input;