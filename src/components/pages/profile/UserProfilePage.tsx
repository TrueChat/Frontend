import React from "react";
import {match, Redirect} from "react-router-dom";
import UserService, {UserProfile} from "../../../services/UserService";
import {Spinner} from "../../widgets/Widgets";
import UserProfileView from "../../views/profile/view/UserProfileView";
import "./UserProfilePage.scss";
import UserProfileEditView from "../../views/profile/edit/UserProfileEditView";
import "bootstrap/dist/css/bootstrap.css";

export default class UserProfilePage extends React.Component<Props, State> {

  state = {
    profile: undefined,
    redirect: undefined
  };

  componentDidMount(): void {
    this.props.userService
      .loadProfile(this.getUsername())
      .then(profile => {
        this.setState(state => ({
          ...state, profile: profile
        }))
      })
      .catch(error => {
        this.setState(state => ({
          ...state, redirect: "/"
        }))
      });
  }

  render() {
    const { userService } = this.props;
    const profile = this.state.profile as UserProfile|undefined;
    const redirect = this.state.redirect as string|undefined;

    if (redirect) {
      return <Redirect to={redirect}/>;
    }

    if (!userService.userIsPresent()) {
      return <Redirect to="/auth"/>
    }

    if (!profile) {
      return this.showSpinner();
    }
  
    if (profile.username === userService.getCurrentUser()) {
      return <UserProfileEditView userProfile={profile} userService={userService} />
    } else {
      return <UserProfileView userProfile={profile} />
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
  profile?: UserProfile,
  redirect?: string
}