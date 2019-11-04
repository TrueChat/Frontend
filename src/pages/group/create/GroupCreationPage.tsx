import React from "react";
import GroupService, { GroupCreationData } from "../../../services/GroupService";
import GroupCreationForm from "./form/GroupCreationForm";
import "./GroupCreationPage.scss";
import {ResponseHandler} from "../../../services/types";

type GroupCreationPageProps = {
  groupService: GroupService
}

export default class GroupCreationPage extends React.Component<GroupCreationPageProps> {

  render() {
    return (
      <div className="Group-creation-page">
        <GroupCreationForm onSubmit={this.handleSubmit} />
      </div>
    );
  }

  private handleSubmit = (data: GroupCreationData, onSuccess: ResponseHandler, onFailure: ResponseHandler) => {
    this.props.groupService.createGroup(data, onSuccess, onFailure);
  }

}