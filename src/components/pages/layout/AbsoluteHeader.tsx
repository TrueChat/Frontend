import React from "react";
import "./AbsoluteHeader.scss";

export default class AbsoluteHeader extends React.Component {

  render() {
    return (
      <div className="Absolute-header">
        {this.props.children}
      </div>
    );
  }
}