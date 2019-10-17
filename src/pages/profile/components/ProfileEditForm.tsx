import React from "react";
import FormInput from "./form-inputs/FormInput";
import "./ProfileEditForm.scss";
import SubmitButton from "../../common/SubmitButton";
import {UserProfile} from "../../../services/UserService";
import {SubmissionFailureHandler, SubmissionSuccessHandler} from "../../../services/UserService";
require("bootstrap/dist/css/bootstrap.css");

type ProfileEditFormProps = {
  userProfile: UserProfile,
  onSubmit: (
    onSuccess?: SubmissionSuccessHandler,
    onFailure?: SubmissionFailureHandler
  ) => void
}

export default class ProfileEditForm extends React.Component<ProfileEditFormProps> {

  render() {
    const { userProfile, onSubmit } = this.props;

    return (
      <div className="Profile-edit-form">
        <div className="header">
          Your Profile
        </div>
        <div className="row info-row align-center">
          <div className="col-3">
            <div className="user-image-container">
              <i className="user-image" />
            </div>
          </div>
          <div className="col-9">
            <div className="row">
              <div className="w-100">
                <div className="row-title">First Name</div>
                <div>
                  <FormInput value={userProfile.first_name} onChange={this.updateFirstName} />
                </div>
              </div>
              <div className="w-100">
                <div className="row-title">Last Name</div>
                <div>
                  <FormInput value={userProfile.last_name} onChange={this.updateLastName} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row info-row">
          <div className="col-12">
            <div className="row-title">Username</div>
            <div>
              <FormInput value={userProfile.username} onChange={this.updateUsername} />
            </div>
          </div>
        </div>
        <div className="row info-row">
          <div className="col-12">
            <div className="row-title">Bio</div>
            <div>
              <FormInput value={userProfile.about} onChange={this.updateBio} />
            </div>
          </div>
        </div>
        <div className="row submit-container text-right">
          <SubmitButton onClick={() => {
            onSubmit();
          }}/>
        </div>
      </div>
    );
  }

  private updateUsername = (value: string) => {
    this.props.userProfile.username = value;
    this.forceUpdate();
  };

  private updateFirstName = (value: string) => {
    this.props.userProfile.first_name = value;
    this.forceUpdate();
  };

  private updateBio = (value: string) => {
    this.props.userProfile.about = value;
    this.forceUpdate();
  };

  private updateLastName = (value: string) => {
    this.props.userProfile.last_name = value;
    this.forceUpdate();
  }
}