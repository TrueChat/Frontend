import React from "react";

const Input = ({value, onChange} : {value: string, onChange: (value: string) => void}) => (
  <input className="Input" onChange={(e) => onChange(e.currentTarget.value)} value={value}/>
);

export default Input;