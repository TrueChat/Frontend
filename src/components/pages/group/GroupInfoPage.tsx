import React from "react";
import {match, Redirect} from "react-router-dom"
import GroupService, {GroupDetails} from "../../../services/GroupService";
import UserService from "../../../services/UserService";
import {Spinner} from "../../widgets/Widgets";
import GroupEditView from "../../views/group/edit/GroupEditView";
import GroupInfoView from "../../views/group/view/GroupInfoView";
import "./GroupInfoPage.scss";

export default class GroupInfoPage extends React.Component<Props, State> {

  state = {
    groupDetails: undefined,
    redirect: undefined
  };

  componentDidMount(): void {
    this.props.groupService.loadDetails(
      this.getGroupId(),
      details => {
        this.setState(state => ({
          ...state,
          groupDetails: details
        }))
      },
      () => {
        this.setState(state => ({
          ...state, redirect: "/"
        }));
      }
    );
  }

  render() {
    const { userService, groupService } = this.props;
    const groupDetails = this.state.groupDetails as GroupDetails|undefined;
    const redirect = this.state.redirect as string|undefined;

    if (redirect) {
      return <Redirect to={redirect}/>
    }
    if (!userService.userIsPresent()) {
      return <Redirect to="/auth"/>
    }
    if (groupDetails === undefined) {
      return this.showSpinner();
    }

    let viewToRender = null;


    if (groupDetails.creator.username === userService.getCurrentUser()) {
      viewToRender = (
        <GroupEditView
          groupService={groupService}
          userService={userService}
          groupId={groupDetails.groupId}
        />
      );
    } else {
      viewToRender =  (
        <GroupInfoView
          groupService={groupService}
          userService={userService}
          groupId={groupDetails.groupId}
          groupDetails={groupDetails}
        />
      );
    }

    return (
      <div className="Group-info-page">
        {viewToRender}
      </div>
    )
  }

  showSpinner = () => {
    return (
      <div className="text-center"><Spinner/></div>
    )
  };

  getGroupId = () => {
    const { match } = this.props;

    // simple workaround
    return match ? (match.params as any).groupId: "";
  }
}

type Props = {
  match?: match,
  groupService: GroupService,
  userService: UserService
}

type State = {
  groupDetails?: GroupDetails,
  redirect?: string
}