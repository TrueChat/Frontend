import React from "react";
import ProfileEditForm from "./ProfileEditForm";
import "./ProfileEditPage.scss";
import {ClipLoader} from "react-spinners";
import { Redirect } from "react-router-dom";
import UserService, {SubmissionFailureHandler, SubmissionSuccessHandler, UserProfile} from "../../../services/UserService";

type ProfilePageProps = {
  userService: UserService,
}

export default class ProfileEditPage extends React.Component<ProfilePageProps> {

  state : {userProfile?: UserProfile } = {
    userProfile: undefined
  };

  constructor(props: ProfilePageProps) {
    super(props);
    this.loadUserProfile();
  }

  render() {
    if (!this.props.userService.userIsPresent()) {
      return <Redirect to="/auth" />
    }
    return (
      <div className="Profile-page">
        <div className="form-container">
          {this.state.userProfile
            ? <ProfileEditForm userProfile={this.state.userProfile} onSubmit={this.handleSubmit} />
            : <div className="text-center"><ClipLoader color="rgb(153, 153, 153)"/></div>
          }
        </div>
      </div>
    );
  }

  private handleSubmit = (userProfile: UserProfile, onSuccess?: SubmissionSuccessHandler, onFailure?: SubmissionFailureHandler) => {
    const _onSuccess = () => {
      this.setState(state => {
        if (onSuccess) {
          onSuccess();
        }
        return {
          ...state,
          userProfile: userProfile
        }
      })
    };
    this.props.userService.updateProfileForCurrentUser(userProfile, _onSuccess, onFailure);
  };

  private loadUserProfile() {
    if (!this.props.userService.userIsPresent()) {
      return;
    }
    this.props.userService.loadProfileForCurrentUser()
      .then(userProfile => {
        this.setState(state => ({
          ...state,
          userProfile
        }))
      })
      .catch(error => {
        // TODO handle loading errors
      })
  }

}