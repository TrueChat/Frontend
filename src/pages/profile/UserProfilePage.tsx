import React from "react";
import {match, Redirect} from "react-router-dom";
import UserService, {UserProfile} from "../../services/UserService";
import {Spinner} from "../../widgets/Widgets";
import ProfileEditPage from "./edit/ProfileEditPage";
import ProfileViewPage from "./view/ProfileViewPage";

export default class UserProfilePage extends React.Component<Props> {

  state = {
    profile: undefined
  };

  componentDidMount(): void {
    this.props.userService.loadProfile(this.getUsername())
      .then(profile => {
        this.setState(state => ({
          ...state, profile: profile
        }))
      });
  }

  render() {
    const { userService } = this.props;
    const profile = this.state.profile as UserProfile|undefined;

    if (!userService.userIsPresent()) {
      return <Redirect to="/auth"/>
    }

    if (!profile) {
      return this.showSpinner();
    }
  
    if (profile.username === userService.getCurrentUser()) {
      return <ProfileEditPage userService={userService} />
    } else {
      return <ProfileViewPage userProfile={profile} />
    }
  }

  showSpinner = () => {
    return <div className="text-center"><Spinner/></div>
  };

  getUsername = () => {
    const { match } = this.props;

    return match ? (match.params as any).username : "";
  };
}

type Props = {
  match?: match,
  userService: UserService,
}

type State = {
  profile?: UserProfile
}