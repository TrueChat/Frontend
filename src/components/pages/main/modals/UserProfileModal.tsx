import UserService, {UserProfile} from "../../../../services/UserService";
import React from "react";
import {Spinner} from "../../../widgets/Widgets";
import UserProfileEditView from "../../../views/profile/edit/UserProfileEditView";
import UserProfileView from "../../../views/profile/view/UserProfileView";

export default class UserProfileModal extends React.Component<Props, State> {

  state = {
    userProfile: undefined
  };

  componentDidMount(): void {
    this.props.userService
      .loadProfile(this.props.username)
      .then(profile => {
        this.setState((state: any) => ({
          ...state, userProfile: profile
        }));
      })
  }

  render() {
    const { userService } = this.props;
    const userProfile = (this.state.userProfile as UserProfile|undefined);
    let viewToRender = null;

    if (userProfile) {
      if (userProfile.username === userService.getCurrentUser()) {
        viewToRender = (
          <UserProfileEditView userService={userService} userProfile={userProfile} />
        );
      } else {
        viewToRender = (
          <UserProfileView userProfile={userProfile} />
        )
      }
    } else {
      viewToRender = <Spinner />
    }

    return viewToRender;
  }

}

type Props = {
  userService: UserService,
  username: string
}

type State = {
  userProfile: UserProfile|undefined
}