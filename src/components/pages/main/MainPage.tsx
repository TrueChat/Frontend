import React from "react";
import {Redirect} from "react-router-dom";
import UserService from "../../../services/UserService";
import "./MainPage.scss";

import "bootstrap/dist/css/bootstrap.min.css";
import GroupService from "../../../services/GroupService";
import {Switch, Route, RouteComponentProps} from "react-router-dom";
import ModalView from "../../views/modal-view/ModalView";
import UserProfileModalView from "./modals/UserProfileModal";
import GroupProfileModalView from "./modals/GroupProfileModal";
import AbsoluteHeader from "../layout/AbsoluteHeader";
import GroupList from "./left-bar/group-list/GroupList";
import Header from "./left-bar/header/Header";
import GroupCreationView from "../../views/group/create/GroupCreationView";

type Props = {
  userService: UserService,
  groupService: GroupService,
  location: any
}

export default class MainPage extends React.Component<Props> {

  prevLocation = this.props.location;

  componentWillUpdate() {
    const { location } = this.props;
    if (!(location.state && location.state.modal)) {
      this.prevLocation = this.props.location;
    }
  }

  render() {
    const { userService, location } = this.props;
    if (!userService.userIsPresent()) {
      return <Redirect to="/auth" />
    }

    const isModal = (
      location.state &&
      location.state.modal &&
      this.prevLocation !== location
    );

    return (
      <React.Fragment>
        <AbsoluteHeader/>
        <Switch location={isModal ? this.prevLocation : location}>
          <Route path="/">
            {this.modalRoutes()}

            <div className="Main-page">
              <div className="left-bar">
                <Header />
                <div>
                  <GroupList groupService={this.props.groupService} />
                </div>
              </div>
              <div className="right-bar">
                <Switch>
                  <Route path="/group/:groupId" component={(props: RouteComponentProps) => (
                    <div>Group View</div>
                  )}/>
                  <Route path="/">
                    <div>Empty</div>
                  </Route>
                </Switch>
              </div>
            </div>

          </Route>
        </Switch>
        {this.modalComponent()}
      </React.Fragment>
    );
  }

  modalRoutes() {
    return (
      <React.Fragment>
        <Route exact path="/modal/currentUserProfile/" component={this.CurrentUserProfileModal}/>
        <Route exact path="/modal/userProfile/:username" component={this.UserProfileModal}/>
        <Route exact path="/modal/groupProfile/:groupId" component={this.GroupProfileModal}/>
      </React.Fragment>
    );
  }

  modalComponent() {
    const { location } = this.props;

    const isModal = (
      location.state &&
      location.state.modal &&
      this.prevLocation !== location
    );

    const isActiveModal = (modalName: string) => {
      return isModal && location.state.modal.name === modalName;
    };

    return (

      <React.Fragment>
        {isActiveModal("userProfile")
          ? <Route exact path="/modal/userProfile/:username" component={this.UserProfileModal}/>
          : null
        }
        {isActiveModal("currentUserProfile")
          ? <Route exact path="/modal/currentUserProfile" component={this.CurrentUserProfileModal}/>
          : null
        }
        {isActiveModal("groupProfile")
          ? <Route exact path="/modal/groupProfile/:groupId" component={this.GroupProfileModal}/>
          : null
        }
      </React.Fragment>
    )
  }

  GroupProfileModal = (props: RouteComponentProps) => {
    return (
      <ModalView history={props.history}>
        <GroupProfileModalView
          userService={this.props.userService}
          groupService={this.props.groupService}
          groupId={(props.match as any)["groupId"]}
        />
      </ModalView>
    )
  };

  CurrentUserProfileModal = (props: RouteComponentProps) => {
    return (
      <ModalView history={props.history}>
        <UserProfileModalView
          username={this.props.userService.getCurrentUser()}
          userService={this.props.userService}
        />
      </ModalView>
    );
  };

  UserProfileModal = (props: RouteComponentProps) => {
    return (
      <ModalView history={props.history}>
        <UserProfileModalView
          username={(props.match.params as any)["username"]}
          userService={this.props.userService}
        />
      </ModalView>
    )
  };
}