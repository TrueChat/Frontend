import React from "react";
import GroupService, { GroupCreationData } from "../../../services/GroupService";
import GroupCreationForm from "./form/GroupCreationForm";
import "./GroupCreationPage.scss";
import UserService from "../../../services/UserService";
import { Redirect } from "react-router-dom";
import {ResponseHandler} from "../../../services/types";

type Props = {
  groupService: GroupService,
  userService: UserService
}

type State = {
  redirect: string|undefined
}

export default class GroupCreationPage extends React.Component<Props, State> {

  state = {
    redirect: undefined
  };

  render() {
    const redirect = this.state.redirect as string|undefined;

    if (!this.props.userService.userIsPresent()) {
      return <Redirect to="/auth"/>
    }

    if (redirect) {
      return <Redirect to={redirect}/>
    }

    return (
      <div className="Group-creation-page">
        <GroupCreationForm onSubmit={this.handleSubmit} />
      </div>
    );
  }

  private handleSubmit = (data: GroupCreationData, onSuccess: ResponseHandler, onFailure: ResponseHandler) => {
    this.props.groupService.createGroup(data, resp => this.redirectToGroupEdit(resp.data), onFailure);
  };

  redirectToGroupEdit = (groupId: string) => {
    this.setState({redirect: `/group/${groupId}`});
  }
}