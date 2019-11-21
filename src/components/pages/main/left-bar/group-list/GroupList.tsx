import React from "react";
import GroupService, {GroupDetails, GroupMember} from "../../../../../services/GroupService";
import {GroupInitialsAvatar, Spinner} from "../../../../widgets/Widgets";
import "bootstrap/dist/css/bootstrap.min.css";
import "./GroupList.scss"
import {Link} from "react-router-dom";
import UserService from "../../../../../services/UserService";

export default class GroupList extends React.Component<Props, State> {

  state = {
    groups: undefined
  };

  private intervalId: any;

  loadGroups = () => {
    this.props.groupService.findAll(result => this.updateGroups(result.data));
  };

  componentDidMount(): void {
    this.intervalId = setInterval(this.loadGroups, 2000);
  }

  componentWillUnmount(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  updateGroups = (groups: GroupDetails[]) => {
    this.setState(state => ({
      ...state, groups: groups
    }))
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

  displayLastMessage = (message?: string) => {
    if (!message) {
      return "no messages yet...";
    }
    if (message.length > 16) {
      return `${message.slice(0, 16)} + "..."`
    }
    return message;
  };

  render() {
    const groups = (this.state.groups as GroupDetails[]|undefined);

    if (!groups) {
      return <div className="text-center"><Spinner /></div>
    }

    return (
      <div className="Group-list">
        {groups.map((details) => (
          <div className="group-details" key={details.groupId}>
            <div className="row">
              <div className="col-2">
                <GroupInitialsAvatar groupData={details} />
              </div>
              <div className="col-10">
                <div className="row">
                  <div className="col-12 group-name">
                    <Link to={`/group/${details.groupId}`} className="a-none">
                      {this.displayGroupName(details)}
                    </Link>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 group-first-message">
                    {this.displayLastMessage(details.lastMessage)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

}

type State = {
  groups: GroupDetails[]|undefined
}

type Props = {
  groupService: GroupService,
  userService: UserService
}