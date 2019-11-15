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

type Props = {
  userService: UserService,
  groupService: GroupService,
  location: any
}
type State = {
  previousLocation: any
}

export default class MainPage extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      previousLocation: this.props.location
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
      this.state.previousLocation !== location
    );

    return (
      <React.Fragment>
        <Switch location={isModal ? this.state.previousLocation : location}>
          <Route exact path="/">
            <ul>
              <li>
                <Link to={{
                  pathname: "/modal/userProfile/123",
                  state: {
                    modal: { name: "userProfile"}
                  }
                }}>User Profile</Link>
              </li>
              <li>
                <Link to={{
                  pathname: "/modal/groupProfile/123",
                  state: {
                    modal: { name: "groupProfile"}
                  }
                }}>Group Profile</Link>
              </li>
            </ul>
          </Route>
          <Route exact path="/modal/userProfile/:username" component={(props: RouteComponentProps) => (
            <this.UserProfileModal props={props}/>
          )}/>
          <Route exact path="/modal/groupProfile/:groupId" component={(props: RouteComponentProps) => (
            <this.GroupProfileModal props={props}/>
          )}/>
        </Switch>
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
    );
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