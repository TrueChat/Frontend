import React from "react";
import UserService from "../../services/UserService";
import ProfileEditingForm from "./components/ProfileEditingForm";
import "./ProfilePage.scss";

type ProfilePageProps = {
  userService: UserService
}

export default class ProfilePage extends React.Component<ProfilePageProps> {


  render() {
    return (
      <div className="Profile-page">
        <div className="form-container">
          <ProfileEditingForm />
        </div>
      </div>
    )
  }
}