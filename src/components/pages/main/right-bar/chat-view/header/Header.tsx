import React from "react";
import GroupService, {GroupDetails, GroupMember} from "../../../../../../services/GroupService";
import ModalLink from "../../../modals/ModalLink";
import "./Header.scss"

export default class Header extends React.Component<Props, State> {

  state = {
    details: undefined
  };

  componentDidMount(): void {
    this.loadDetails();
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    if (prevProps.groupId !== this.props.groupId) {
      this.loadDetails();
    }
  }

  loadDetails() {
    this.props.groupService.loadDetails(this.props.groupId, this.setGroupDetails, () => {});
  };

  setGroupDetails = (details: GroupDetails) => {
    this.setState(state => ({
      ...state, details: details
    }));
  };

  displayGroupName = (groupDetails: GroupDetails) => {
    if (!groupDetails.isDialog) {
      return groupDetails.name;
    }
    let firstMember = groupDetails.members[0];

    return this.displayUsername(firstMember);
  };

  displayUsername = (user: GroupMember) => {
    if (user.firstName) {
      if (user.lastName) {
        return `${user.firstName} ${user.lastName}`;
      }
      return `${user.firstName}`;
    }
    return user.username;
  };

  render() {
    const details = this.state.details as GroupDetails|undefined;

    if (!details) {
      return <div className="Chat-view-header"/>
    }

    return (
      <div className="Chat-view-header">
        <div className="row">
          <div className="col-11">
            {this.displayGroupName(details)}
          </div>
          <div className="col-1">
            <ModalLink modalName="groupProfile" relativePath={this.props.groupId} className="a-none">
              <i className="fas fa-info-circle"/>
            </ModalLink>
          </div>
        </div>
      </div>
    );
  }
}

type Props = {
  groupService: GroupService,
  groupId: string
}

type State = {
  details: GroupDetails|undefined
}