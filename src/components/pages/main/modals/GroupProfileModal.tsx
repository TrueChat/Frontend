import React from "react";
import GroupEditView from "../../../views/group/edit/GroupEditView";
import GroupInfoView from "../../../views/group/view/GroupInfoView";
import GroupService, {GroupDetails} from "../../../../services/GroupService";
import UserService from "../../../../services/UserService";
import {Spinner} from "../../../widgets/Widgets";
import "bootstrap/dist/css/bootstrap.min.css";
import { Redirect } from "react-router-dom";
import UserStatisticsModal from "./UserStatisticsModal";
import UserProfileModal from "./UserProfileModal";
import PrivateChatService from "../../../../services/PrivateChatService";

export default class GroupProfileModal extends React.Component<Props, State> {

  state = {
    groupDetails: undefined
  };

  componentDidMount(): void {
    this.props.groupService
      .loadDetails(this.props.groupId, this.updateDetails, () => { })
  }

  updateDetails = (details: GroupDetails) => {
    this.setState(state => ({
      ...state, groupDetails: details
    }));
  };

  render() {
    const { userService, groupService } = this.props;
    const groupDetails = (this.state.groupDetails as GroupDetails|undefined);

    if (groupDetails) {
      if (groupDetails.isDialog) {
        if (groupDetails.creator.username === userService.getCurrentUser()) {
          return (
            <UserProfileModal
              userService={this.props.userService}
              username={groupDetails.members[0].username}
              privateChatService={this.props.privateChatService}
            />
          );
        } else {
          return (
            <UserProfileModal
              userService={this.props.userService}
              username={groupDetails.creator.username}
              privateChatService={this.props.privateChatService}
            />
          );
        }
      } else if (groupDetails.creator.username === userService.getCurrentUser()) {
        return (
          <GroupEditView
            groupService={groupService}
            userService={userService}
            groupId={groupDetails.groupId}
          />
        );
      } else {
        return (
          <GroupInfoView
            groupService={groupService}
            userService={userService}
            groupId={groupDetails.groupId}
            groupDetails={groupDetails}
          />
        );
      }
    } else {
      return <div className="text-center m-1s"><Spinner/></div>
    }
  }
}

type Props = {
  groupId: string,
  userService: UserService,
  groupService: GroupService,
  privateChatService: PrivateChatService
}

type State = {
  groupDetails: GroupDetails|undefined
}