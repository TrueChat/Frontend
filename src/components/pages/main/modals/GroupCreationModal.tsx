import React from "react";
import GroupService, {GroupCreationData, GroupData} from "../../../../services/GroupService";
import GroupCreationView from "../../../views/group/create/GroupCreationView";
import {ConstraintViolation, ResponseHandler} from "../../../../services/types";
import { Redirect } from "react-router";

export default class GroupCreationModal extends React.Component<Props> {

  state = {
    redirect: undefined
  };

  render() {
    const redirect = this.state.redirect as string|undefined;

    if (redirect) {
      return <Redirect to={redirect}/>
    }

    return (
      <GroupCreationView
        onSubmit={this.handleSubmit}
      />
    )
  }

  handleSubmit = (data: GroupCreationData, onSuccess: ResponseHandler<string>, onFailure: ResponseHandler<ConstraintViolation[]>) => {
    const _onSuccess = ({data}: {data: string}) => {
      this.setState(state => ({
        ...state, redirect: `/group/${data}`
      }));
    };

    this.props.groupService.createGroup(data, _onSuccess, onFailure);
  }

}

type Props = {
  groupService: GroupService
}