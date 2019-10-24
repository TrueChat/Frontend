import React from "react";
import FormInput from "./form-inputs/FormInput";
import "./ProfileEditForm.scss";
import SubmitButton from "../../common/SubmitButton";
import {UserProfile} from "../../../services/UserService";
import {SubmissionFailureHandler, SubmissionSuccessHandler} from "../../../services/UserService";
import {ClipLoader} from "react-spinners";
require("bootstrap/dist/css/bootstrap.css");

type ProfileEditFormProps = {
  userProfile: UserProfile,
  onSubmit: (
    userProfile: UserProfile,
    onSuccess?: SubmissionSuccessHandler,
    onFailure?: SubmissionFailureHandler
  ) => void
}

type ProfileEditFormState = {
  userProfile: UserProfile,
  submissionResult?: boolean,
  loading: boolean
}

export default class ProfileEditForm extends React.Component<ProfileEditFormProps, ProfileEditFormState> {

  constructor(props: ProfileEditFormProps) {
    super(props);
    const userProfile = props.userProfile;

    this.state = {
      loading: false,
      submissionResult: undefined,
      userProfile: {
        first_name: userProfile.last_name || "",
        last_name: userProfile.last_name || "",
        username: userProfile.username || "",
        about: userProfile.about || ""
      }
    }
  }

  render() {
    const { loading, submissionResult, userProfile } = this.state;

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
          <SubmitButton onClick={this.handleSubmit}/>
        </div>
        {loading
          ? <div className="text-center"><ClipLoader/></div>
          : null
        }
        {submissionResult !== undefined
          // TODO render more app specific styled messages
          ? !submissionResult
            ? <div className="text-center text-danger">Something went wrong</div>
            : <div className="text-center text-success">Successfully updated</div>
          : null
        }
      </div>
    );
  }

  private handleSubmit = () => {
    const onSuccess = () => {
      this.setState(state => ({
        ...state,
        loading: false,
        submitResult: true
      }));
    };
    const onFail = () => {
      this.setState(state => ({
        ...state,
        loading: false,
        submitResult: false
      }));
    };
    this.setState(state => {
      this.setState(state => ({
        ...state,
        loading: true
      }));
      this.props.onSubmit(state.userProfile, onSuccess, onFail);
    });
  };


  private updateUsername = (value: string) => {
    this.updateProfileField("username", value);
  };

  private updateFirstName = (value: string) => {
    this.updateProfileField("first_name", value);
  };

  private updateBio = (value: string) => {
    this.updateProfileField("about", value);
  };

  private updateLastName = (value: string) => {
    this.updateProfileField("last_name", value);
  };

  private updateProfileField(field: string, value: string) {
    this.setState(state => ({
      ...state,
      userProfile: {
        ...state.userProfile,
        [field]: value
      }
    }));
  }
}