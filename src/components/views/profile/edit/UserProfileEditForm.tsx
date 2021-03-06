import React from "react";
import FormInput from "./form-inputs/FormInput";
import "./UserProfileEditForm.scss";
import {SubmissionFailureHandler, SubmissionSuccessHandler, UserProfile} from "../../../../services/UserService";
import {Spinner, UserInitialsAvatar} from "../../../widgets/Widgets";
import SubmitButton from "../../../widgets/SubmitButton";
import AttachmentControl from "../../../pages/main/right-bar/chat-view/attachment/AttachmentControl";

export default class UserProfileEditForm extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    const userProfile = props.userProfile;
    this.state = {
      loading: false,
      submissionResult: undefined,
      userProfile: {
        first_name: userProfile.first_name || "",
        last_name: userProfile.last_name || "",
        username: userProfile.username || "",
        about: userProfile.about || "",
        images: userProfile.images || []
      }
    }
  }

  render() {
    const { loading, submissionResult, userProfile, imageToSendUrl } = this.state;
    const SubmissionMessage = ({message} : {message: string}) => (
      <div className="text-center m-1 c-attention">
        {message}
      </div>
    );

    return (
      <div className="User-profile-edit-view">
        <div className="header">
          Your Profile
        </div>
        <div className="body">
          <div className="row info-row align-center">
            <div className="col-4">
              <div className="user-image-container">
                <div className="avatar-editor">
                  <div className="avatar">
                    <UserInitialsAvatar profile={{
                      ...userProfile,
                      images: imageToSendUrl ? [{imageURL: imageToSendUrl}] : userProfile.images
                    }}/>
                  </div>
                  <div className="avatar-attachment-control">
                    <AttachmentControl
                      icon="fas fa-upload"
                      onSelect={this.selectImage}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-8">
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
              <div className="font-weight-bold color-white-70">
                @{userProfile.username}
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
            ? <div className="text-center"><Spinner /></div>
            : null
          }
          {/* TODO should remove message on input focus?? */}
          {submissionResult !== undefined
            ? !submissionResult
              ? <SubmissionMessage message="Error: something went wrong" />
              : <SubmissionMessage message="Successfully updated" />
            : null
          }
        </div>
      </div>
    );
  }

  private handleSubmit = () => {
    const onSuccess = () => {
      this.setState(state => ({
        ...state,
        loading: false,
        submissionResult: true,
        imageToSend: undefined,
      }));
    };
    const onFail = () => {
      this.setState(state => ({
        ...state,
        loading: false,
        submissionResult: false,
        imageToSend: undefined,
      }));
    };
    this.setState(state => ({
      ...state,
      loading: true
    }), () => {
      this.props.onSubmit(this.state.userProfile, onSuccess, onFail, this.state.imageToSend);
    });
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

  private selectImage = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      this.setState(state => ({
        ...state, imageToSend: file, imageToSendUrl: reader.result as string
      }))
    }
  }
}

type Props = {
  userProfile: UserProfile,
  onSubmit: (
    userProfile: UserProfile,
    onSuccess?: SubmissionSuccessHandler,
    onFailure?: SubmissionFailureHandler,
    imageToSend?: File
  ) => void
}

type State = {
  userProfile: UserProfile,
  submissionResult?: boolean,
  loading: boolean,
  imageToSend?: File
  imageToSendUrl?: string
}