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
    this.props.groupService.findAll(result => {
      this.updateGroups(result.data);
      if (this.stackSize === 0) {
        return;
      }
      this.stackSize--;
      this.loadGroups();
    });
  };

  private maxStackSize = 500;

  private stackSize = 0;

  componentDidMount(): void {
    this.intervalId = setInterval(() => {
      if (this.stackSize === 0) {
        this.stackSize = this.maxStackSize;
        this.loadGroups();
      }
    }, 500);
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
    return this.displayUsername(this.getDialogParticipant(groupDetails));
  };

  getDialogParticipant = (dialog: GroupDetails) : GroupMember => {
    let firstMember = dialog.members[0];
    if (this.props.userService.getCurrentUser() === firstMember.username) {
      return dialog.creator;
    } else {
      return firstMember;
    }
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
    if (message.length > 24) {
      return `${message.slice(0, 24)}...`
    }
    return message;
  };

  displayGroupAvatar(groupDetails: GroupDetails) {
    if (groupDetails.isDialog) {
      const participant = this.getDialogParticipant(groupDetails);
      return (
        <GroupInitialsAvatar
          groupData={{
            ...groupDetails,
            name: this.displayUsername(participant),
            images: [...participant.images]
          }}
        />
      )
    } else {
      return <GroupInitialsAvatar groupData={groupDetails} />
    }
  }

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
                <Link to={`/group/${details.groupId}`} className="a-none">
                  {this.displayGroupAvatar(details)}
                </Link>
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
                  <div className="col-12 group-first-message text-break">
                    <Link to={`/group/${details.groupId}`} className="a-none">
                      {this.displayLastMessage(details.lastMessage)}
                    </Link>
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