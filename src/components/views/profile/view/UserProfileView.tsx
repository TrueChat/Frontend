import React from "react";
import {UserInitialsAvatar} from "../../../widgets/Widgets";
import {UserProfile} from "../../../../services/UserService";
import "./UserProfileView.scss";
import "bootstrap/dist/css/bootstrap.min.css"

export default class UserProfileView extends React.Component<Props> {

  render() {
    const { userProfile } = this.props;
    return (
      <div className="User-profile-view">
        <div className="header">
          Profile
        </div>
        <div className="body">
          <div className="row info-row align-center">
            <div className="col-3">
              <div className="user-image-container">
                <UserInitialsAvatar profile={userProfile}/>
              </div>
            </div>
            <div className="col-9">
              <div className="row">
                <div className="w-100">
                  <div className="row-title">First Name</div>
                  <div className="row-value">
                    {userProfile.first_name}
                  </div>
                </div>
                <div className="w-100">
                  <div className="row-title">Last Name</div>
                  <div className="row-value">
                    {userProfile.last_name}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row info-row">
            <div className="col-12">
              <div className="row-title">Username</div>
              <div className="row-value">
                {userProfile.username}
              </div>
            </div>
          </div>
          <div className="row info-row">
            <div className="col-12">
              <div className="row-title">Bio</div>
              <div className="row-value">
                {userProfile.about}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

type Props = {
  userProfile: UserProfile
}