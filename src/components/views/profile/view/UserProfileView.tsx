import React from "react";
import {UserInitialsAvatar} from "../../../widgets/Widgets";
import {UserProfile} from "../../../../services/UserService";
import "./UserProfileView.scss";
import "bootstrap/dist/css/bootstrap.min.css"
import { Redirect } from "react-router";
import PrivateChatService from "../../../../services/PrivateChatService";

export default class UserProfileView extends React.Component<Props, State> {

  state = {
    redirect: undefined
  };

  render() {
    const { userProfile } = this.props;
    const redirect  = this.state.redirect;

    if (redirect) {
      return <Redirect to={(redirect as string)} />
    }

    return (
      <div className="User-profile-view">
        <div className="header">
          Profile
        </div>
        <div className="body">
          <div className="row info-row align-center">
            <div className="col-3">
              <div className="user-image-container" onClick={() => this.redirectToUserChat(userProfile.username)}>
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
          <div className="row info-row text-light font-weight-bold cursor-pointer" onClick={() => {
            this.redirectToUserChat(userProfile.username);
          }}>
            <div className="col-12">
              <i className="fas fa-envelope"/> Send a message
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

  redirectToUserChat = (username: string) => {
    this.props.privateChatService.exists(username, response => {
      if (response.data) {
        this.setState(state => ({
          ...state, redirect: `/group/${response.data}`
        }))
      } else {
        this.props.privateChatService.createChat(username, response => {
          this.setState(state => ({
            ...state, redirect: `/group/${response.data}`
          }));
        });
      }
    });
  }
}

type State = {
  redirect?: string
}

type Props = {
  userProfile: UserProfile,
  privateChatService: PrivateChatService
}