import React from "react";
import UserProfileEditForm from "./UserProfileEditForm";
import {ClipLoader} from "react-spinners";
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
    return (
      this.state.userProfile
        ? <UserProfileEditForm userProfile={this.state.userProfile} onSubmit={this.handleSubmit} />
        : <div className="text-center"><ClipLoader color="rgb(153, 153, 153)"/></div>
    );
  }

  private handleSubmit = (
      userProfile: UserProfile,
      onSuccess?: SubmissionSuccessHandler,
      onFailure?: SubmissionFailureHandler,
      imageToSend?: File
  ) => {

    // MESS
    const _onSuccess = () => {
      if (imageToSend) {
        this.props.userService.uploadImage(imageToSend,
          () => {
            this.setState({userProfile: userProfile}, () => {
              onSuccess && onSuccess()
            });
          },
          () => { }
        )
      } else {
        this.setState({userProfile: userProfile}, () => {
          if (onSuccess) {
            onSuccess();
          }
        });
      }
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