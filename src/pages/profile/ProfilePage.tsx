import React from "react";
import UserService, {SubmissionFailureHandler, SubmissionSuccessHandler, UserProfile} from "../../services/UserService";
import ProfileEditForm from "./components/ProfileEditForm";
import "./ProfilePage.scss";
import {ClipLoader} from "react-spinners";

type ProfilePageProps = {
  userService: UserService,
}

export default class ProfilePage extends React.Component<ProfilePageProps> {

  state : {userProfile?: UserProfile } = {
    userProfile: undefined
  };

  constructor(props: ProfilePageProps) {
    super(props);
    this.loadUserProfile();
  }

  render() {
    return (
      <div className="Profile-page">
        <div className="form-container">
          {this.state.userProfile
            ? <ProfileEditForm userProfile={this.state.userProfile} onSubmit={this.handleSubmit} />
            : <div className="text-center"><ClipLoader /></div>
          }
        </div>
      </div>
    );
  }

  private handleSubmit = (onSuccess?: SubmissionSuccessHandler, onFailure?: SubmissionFailureHandler) => {
    const _onSuccess = () => {
      this.forceUpdate();
      if (onSuccess) {
        onSuccess();
      }
    };
    this.props.userService.updateProfileForCurrentUser((this.state.userProfile as UserProfile), _onSuccess, onFailure);
  };

  private loadUserProfile() {
    this.props.userService.loadProfileForCurrentUser()
      .then(userProfile => {
        this.setState(state => ({
          ...state,
          userProfile
        }))
      })
  }

}