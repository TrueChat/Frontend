import React from "react";

type Props = {
  onSelect: (file: File) => void;
  className?: string,
  icon?: string
}

export default class AttachmentControl extends React.Component<Props> {

  ref = React.createRef<HTMLInputElement>();

  render() {
    const { className, icon } = this.props;
    return (
      <span className={className}>
        <input type="file" className="d-none" ref={this.ref} onChange={this.handleChange}/>
        <i className={`${icon ? icon : "fas fa-paperclip"} cursor-pointer`} onClick={e => {
          this.ref.current && this.ref.current.click();
        }}/>
      </span>
    );
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      this.props.onSelect(event.target.files[0] as File);
    }
  }

}