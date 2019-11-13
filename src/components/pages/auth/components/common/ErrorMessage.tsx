import React from "react";
import "./ErrorMessage.scss";

const ErrorMessage = ({message}: {message: string}) => (
  <div className="Error-message">
    {message}
  </div>
);


export default ErrorMessage;