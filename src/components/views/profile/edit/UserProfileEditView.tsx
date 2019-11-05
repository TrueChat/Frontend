import React from "react";
import UserProfileEditForm from "./UserProfileEditForm";
import {ClipLoader} from "react-spinners";
import { Redirect } from "react-router-dom";
import UserService, {
  SubmissionFailureHandler,
  SubmissionSuccessHandler,
  UserProfile
} from "../../../../services/UserService";

type Props = {
  userService: UserService,
  userProfile?: UserProfile
}

type State = {
  userProfile?: UserProfile
}

export default class UserProfileEditView extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      userProfile: props.userProfile
    }
  }

  componentDidMount(): void {
    if (!this.state.userProfile) {
      this.loadUserProfile();
    }
  }

  render() {
    if (!this.props.userService.userIsPresent()) {
      return <Redirect to="/auth" />
    }
    return (
      <div className="Profile-page">
        <div className="form-container">
          {this.state.userProfile
            ? <UserProfileEditForm userProfile={this.state.userProfile} onSubmit={this.handleSubmit} />
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