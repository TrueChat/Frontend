import React from "react";
import {match} from "react-router-dom"
import GroupService from "../../services/GroupService";
import UserService from "../../services/UserService";

export default class GroupPage extends React.Component<Props, State> {

}

type Props = {
  match?: match,
  groupService: GroupService,
  userService: UserService
}

type State = {

}