import React, {ReactElement} from "react";
import { Redirect } from "react-router-dom";
import UserService from "../../../services/UserService";
import "./MainPage.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import ModalView from "../../views/modal-view/ModalView";
import UserProfileView from "../../views/profile/view/UserProfileView";
import UserProfileEditView from "../../views/profile/edit/UserProfileEditView";
import GroupService, {GroupDetails} from "../../../services/GroupService";
import GroupView from "../../views/group/GroupView";

type Props = {
  userService: UserService,
  groupService: GroupService
}

type State = {
  modal: ReactElement|null
}

export default class MainPage extends React.Component<Props, State> {

  state = {
    modal: null
  };

  render() {
    if (!this.props.userService.userIsPresent()) {
      return <Redirect to="/auth" />
    }

    return (
     <React.Fragment>
       {this.state.modal}
       <div className="container">
         <div className="text-light">
           <ul>
             <li onClick={this.showCurrentUserProfileModal}>Profile</li>
           </ul>
         </div>
       </div>
     </React.Fragment>
    )
  }

  showUserProfileModal = (username: string) => {
    this.props.userService
      .loadProfile(username)
      .then(profile => {
        this.showModal(
          <ModalView handleClose={this.closeModal}>
            <UserProfileView userProfile={profile}/>
          </ModalView>
        );
      });
  };

  showCurrentUserProfileModal = () => {
    this.props.userService
      .loadProfileForCurrentUser()
      .then(profile => {
        this.showModal(
          <ModalView handleClose={this.closeModal}>
            <UserProfileEditView userService={this.props.userService} userProfile={profile}/>
          </ModalView>
        );
      });
  };

  showGroupModal = (groupId: string) => {
    const showGroupInfo = (details: GroupDetails) => {
      this.showModal(
        <ModalView handleClose={this.closeModal}>
          <GroupView
            groupService={this.props.groupService}
            userService={this.props.userService}
            groupDetails={details}
          />
        </ModalView>
      );
    };

    this.props.groupService.loadDetails(groupId, showGroupInfo, () => { });
  };

  showModal = (modal: ReactElement) => {
    this.setState(state => ({
      ...state, modal: modal
    }));
  };

  closeModal = () => {
    this.setState(state => ({
      ...state, modal: null
    }));
  }
}