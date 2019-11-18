import React from "react";
import {Link, Redirect} from "react-router-dom";
import UserService from "../../../services/UserService";
import "./MainPage.scss";

import "bootstrap/dist/css/bootstrap.min.css";
import GroupService from "../../../services/GroupService";
import {Switch, Route, RouteComponentProps} from "react-router-dom";
import ModalView from "../../views/modal-view/ModalView";
import UserProfileModalView from "./modals/UserProfileModal";
import GroupProfileModalView from "./modals/GroupProfileModal";
import AbsoluteHeader from "../layout/AbsoluteHeader";
import AuthenticationPage from "../auth/AuthenticationPage";

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
      <div className="Main-page">
        <AbsoluteHeader/>
        <Switch location={isModal ? this.prevLocation : location}>
          <Route exact path="/">
            <ul>
              <li>
                {this.modalLink("userProfile", "/modal/userProfile/123", "User Profile")}
              </li>
              <li>
                {this.modalLink("groupProfile", "/modal/groupProfile/123", "Group Profile")}
              </li>
            </ul>
          </Route>
          {this.modalRoutes()}
          <Route exact path="/auth">
            <AuthenticationPage userService={this.props.userService}/>
          </Route>
        </Switch>

        {this.modalComponents()}
      </div>
    );
  }

  modalLink(modalName: string, path: string, title: string) {
    return (
      <Link to={{
        pathname: path,
        state: {
          modal: { name: modalName}
        }
      }}>
        {title}
      </Link>
    );
  }

  modalRoutes() {
    return (
      <React.Fragment>
        <Route exact path="/modal/userProfile/:username" component={(props: RouteComponentProps) => (
          <this.UserProfileModal props={props}/>
        )}/>
        <Route exact path="/modal/groupProfile/:groupId" component={(props: RouteComponentProps) => (
          <this.GroupProfileModal props={props}/>
        )}/>
      </React.Fragment>
    );
  }

  modalComponents() {
    const { location } = this.props;

    const isModal = (
      location.state &&
      location.state.modal &&
      this.prevLocation !== location
    );
    return (
      <React.Fragment>
        {isModal && location.state.modal.name === "userProfile"
          ? <Route exact path="/modal/userProfile/:username" component={(props: RouteComponentProps) => (
            <this.UserProfileModal props={props}/>
          )}/>
          : null
        }
        {isModal && location.state.modal.name === "groupProfile"
          ? <Route exact path="/modal/groupProfile/:groupId" component={(props: RouteComponentProps) => (
            <this.GroupProfileModal props={props}/>
          )}/>
          : null
        }
      </React.Fragment>
    )
  }

  GroupProfileModal = ({props} : {props: RouteComponentProps}) => {
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

  UserProfileModal = ({props} : {props: RouteComponentProps}) => {
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