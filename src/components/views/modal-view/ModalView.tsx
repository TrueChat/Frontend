import React from "react";
import "./ModalVeiw.scss";

export default class ModalView extends React.Component<Props> {

  render() {
    const { children } = this.props;
    return (
      <div className="Modal-view" onClick={() => this.props.history.goBack()}>
        <div className="Modal-contents" onClick={e => e.stopPropagation()}>
          <div className="Modal-body">
            {children}
          </div>
        </div>
      </div>
    );
  }

}

type Props = {
  history: any,
  children: string|React.ReactElement
}