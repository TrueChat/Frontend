import React from "react";

const Input = ({value, onChange} : {value: string, onChange: (value: string) => void}) => (
  <input className="input" onChange={(e) => onChange(e.currentTarget.value)} value={value}/>
);

export default Input;