import React from "react";
import {match, Redirect} from "react-router-dom"
import GroupService, {GroupDetails} from "../../services/GroupService";
import UserService from "../../services/UserService";
import {Spinner} from "../../widgets/Widgets";
import GroupEditPage from "./edit/GroupEditPage";

export default class GroupPage extends React.Component<Props, State> {

  state = {
    groupDetails: undefined
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
      () => { }
    );
  }

  render() {
    const { userService, groupService } = this.props;
    const groupDetails = (this.state.groupDetails as GroupDetails|undefined);
    if (!userService.userIsPresent()) {
      return <Redirect to="/"/>
    }
    if (groupDetails === undefined) {
      return this.showSpinner();
    }
    if (groupDetails.creator.username === userService.getCurrentUser()) {
      return (
        <GroupEditPage
          groupService={groupService}
          userService={userService}
          groupId={groupDetails.groupId}
        />
      );
    } else {
      return <div>View Group</div>
    }
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
}