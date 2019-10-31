import React from "react";
import GroupService, {
  GroupCreationData,
  GroupCreationFailureHandler,
  GroupCreationSuccessHandler
} from "../../services/GroupService";
import GroupCreationForm from "./form/GroupCreationForm";
import "./GroupCreationPage.scss";

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

  private handleSubmit = (data: GroupCreationData, onSuccess: GroupCreationSuccessHandler, onFailure: GroupCreationFailureHandler) => {
    this.props.groupService.createGroup(data, onSuccess, onFailure);
  }

}