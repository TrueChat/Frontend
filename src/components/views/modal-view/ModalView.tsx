import React from "react";
import {isParent} from "../../../util/dom-utils";

export default class ModalView extends React.Component<Props> {

  modalNode = React.createRef<HTMLDivElement>();

  windowOnClickListener = (event: MouseEvent) => {
    let target = (event.currentTarget as Element|null);
    if (target == null) {
      return;
    }
    if (!this.nodeIsInsideModal(target)) {
      this.props.handleClose()
    }
  };

  nodeIsInsideModal(node: Element) {
    const modalNode = (this.modalNode.current as Element);
    return modalNode === node || isParent(modalNode, node);
  }

  componentDidMount(): void {
      window.addEventListener("click", this.windowOnClickListener);
  }

  componentWillUnmount(): void {
    window.removeEventListener("click", this.windowOnClickListener);
  }

  render() {
    const { title, children, handleClose } = this.props;
    return (
      <div className="Modal-view" ref={this.modalNode}>
        <div className="modal-header">
          {title ? "" : ""} <i className="fas fa-times" onClick={handleClose}/>
        </div>
        <div className="modal-body">
          {children}
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