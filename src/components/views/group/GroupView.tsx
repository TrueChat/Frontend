import GroupEditView from "./edit/GroupEditView";
import GroupInfoView from "./view/GroupInfoView";
import React from "react";
import GroupService, {GroupDetails} from "../../../services/GroupService";
import UserService from "../../../services/UserService";

export default class GroupView extends React.Component<Props> {

  render() {
    const { groupDetails, userService, groupService } = this.props;

    if (groupDetails.creator.username === userService.getCurrentUser()) {
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
  }
}

type Props = {
  groupDetails: GroupDetails,
  userService: UserService,
  groupService: GroupService
}