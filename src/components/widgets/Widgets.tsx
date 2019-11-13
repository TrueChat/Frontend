import React from "react";
import {UserProfile} from "../../services/UserService";
import {GroupData} from "../../services/GroupService";
import {ClipLoader} from "react-spinners";

export const Initials = ({initials} : {initials: string}) => (
  <span className="Initials-avatar">
    <span className="initials">{initials}</span>
  </span>
);

export const UserInitialsAvatar = ({profile}: {profile: UserProfile}) => (
  <Initials initials={
    profile.first_name && profile.last_name
      ? `${profile.first_name[0]}${profile.last_name[0]}`
      : "NS"
  }/>
);

export const GroupInitialsAvatar = ({groupData} : {groupData: GroupData}) => (
  <Initials initials={
    groupData.name.length < 2
      ? "GN"
      : groupData.name.substr(0, 2)
  }/>
);

export const Spinner = () => (
  <ClipLoader color="rgb(153, 153, 153)"/>
);

type DropdownProps = {
  toggle: string|React.ReactElement;
  options: string[],
  onSelect: (option: string) => void
}

type DropdownState = {
  expanded: boolean
}

export class Dropdown extends React.Component<DropdownProps, DropdownState> {

  private readonly elementRef = React.createRef<HTMLDivElement>();

  state = {
    expanded: false
  };

  windowClickListener = (event: Event) => {
    event.stopPropagation();
    if (!this.elementIsInside(event.target as Element, this.elementRef.current as Element)) {
      this.hide();
    }
  };

  elementIsInside(target: Element, parent: Element) {
    if (parent === target) {
      return true;
    }
    let children = parent.children;
    for (let i = 0; i < children.length; i++) {
      let child = children[i];
      if (child === target) {
        return true;
      }
      if (this.elementIsInside(target, child)) {
        return true;
      }
    }
    return false;
  }

  componentDidMount(): void {
    window.addEventListener("click", this.windowClickListener);
  }

  componentWillUnmount(): void {
    window.removeEventListener("click", this.windowClickListener);
  }

  render() {
    const { toggle, options, onSelect } = this.props;
    const { expanded } = this.state;
    return (
      <div className="Dropdown" ref={this.elementRef}>
        <div className="toggle" onClick={this.toggle}>
          {toggle}
        </div>
        <div className={`options${expanded ? " expand" : ""}`}>
          {options.map(option => (
            <div
              className="option"
              key={this.optionKey(option)}
              onClick={_ =>
                this.hide(() => onSelect(option))
              }
            >
              {option}
            </div>
          ))}
        </div>
      </div>
    );
  }

  optionKey = (option: string) => {
    return "Dropdown-option-" + option;
  };

  private toggle = (event: React.MouseEvent<HTMLDivElement>) => {
    this.setState(state => ({
      ...state,
      expanded: !state.expanded
    }))
  };

  private hide = (afterHide?: () => void) => {
    this.setState(state => ({
      ...state,
      expanded: false
    }), () => afterHide && afterHide());
  }

}