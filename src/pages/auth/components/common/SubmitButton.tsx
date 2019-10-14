import React from "react";
import "./SubmitButton.scss";

type ClickHandler = (event: React.MouseEvent) => void;

const SubmitButton = ({onClick} : { onClick: ClickHandler }) => (
  <span className="Submit-button" onClick={event => onClick(event)}>
    Submit
  </span>
);

export default SubmitButton