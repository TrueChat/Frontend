import {Link} from "react-router-dom";
import React, { ReactElement} from "react";

const ModalLink = (props: ModalLinkProps) => (
  <Link
    className={props.className}
    to={{
      pathname: "/modal/" + props.modalName + "/" + (props.relativePath ? props.relativePath : ""),
      state: {
        modal: { name: props.modalName }
      }}}
  >
    {props.children}
  </Link>
);

export type ModalLinkProps = {
  modalName: string,
  relativePath?: string,
  className?: string,
  children?: any
};

export default ModalLink;