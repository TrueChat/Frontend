import React from "react";
import "./ModalVeiw.scss";

export default class ModalView extends React.Component<Props> {

  render() {
    const { children, handleClose } = this.props;
    return (
      <div className="Modal-view" onClick={handleClose}>
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
  title?: string,
  children: string|React.ReactElement
  handleClose: () => void;
}