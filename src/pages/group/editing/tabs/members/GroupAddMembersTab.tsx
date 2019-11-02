import React from "react";
import "./GroupAddMembersTab.scss";
import UserService from "../../../../../services/UserService";
import GroupService from "../../../../../services/GroupService";

export default class GroupAddMembersTab extends React.Component<Props, State> {

  render() {
    return (
      <div>

      </div>
    );
  }
}

type Props = {
  userService: UserService,
  groupService: GroupService
}

type State = {

}