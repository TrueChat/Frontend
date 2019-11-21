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
import GroupCreationModalView from "./modals/GroupCreationModal";
import AbsoluteHeader from "../layout/AbsoluteHeader";
import GroupList from "./left-bar/group-list/GroupList";
import Header from "./left-bar/header/Header";
import SearchView from "../../views/search/SearchView";
import ChatService from "../../../services/ChatService";
import ChatView from "./right-bar/chat-view/ChatView";
import PrivateChatService from "../../../services/PrivateChatService";

type Props = {
  userService: UserService,
  groupService: GroupService,
  chatService: ChatService,
  privateChatService: PrivateChatService,
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
                <GroupList
                  groupService={this.props.groupService}
                  userService={this.props.userService}
                />
              </div>
              <div className="right-bar h-100">
                <Switch>
                  <Route path="/group/:groupId" component={this.ChatViewRoute}/>
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

  ChatViewRoute = (props: RouteComponentProps) => {
    return (
      <ChatView
        chatService={this.props.chatService}
        userService={this.props.userService}
        chatId={(props.match.params as any).groupId}
        groupService={this.props.groupService}
      />
    );
  };

  modalRoutes() {
    // TODO when restoring modals after page reload they do overlap each other
    return (
      <React.Fragment>
        <Route exact path="/modal/currentUserProfile/" component={this.CurrentUserProfileModal}/>
        <Route exact path="/modal/userProfile/:username" component={this.UserProfileModal}/>
        <Route exact path="/modal/groupProfile/:groupId" component={this.GroupProfileModal}/>
        <Route exact path="/modal/groupCreation" component={this.GroupCreationModal}/>
        <Route exact path="/modal/search" component={this.SearchModal}/>
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
      return !!(isModal && location.state.modal.name === modalName);
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
        {isActiveModal("groupCreation")
          ? <Route exact path="/modal/groupCreation" component={this.GroupCreationModal}/>
          : null
        }
        {isActiveModal("search")
          ? <Route exact path="/modal/search" component={this.SearchModal} />
          : null
        }
      </React.Fragment>
    )
  }

  SearchModal = (props: RouteComponentProps) => {
    return (
      <ModalView history={props.history}>
        <SearchView userService={this.props.userService}/>
      </ModalView>
    );
  };


  GroupCreationModal = (props: RouteComponentProps) => {
    return (
      <ModalView history={props.history}>
        <GroupCreationModalView groupService={this.props.groupService}/>
      </ModalView>
    )
  };

  GroupProfileModal = (props: RouteComponentProps) => {
    return (
      <ModalView history={props.history}>
        <GroupProfileModalView
          userService={this.props.userService}
          groupService={this.props.groupService}
          groupId={(props.match.params as any)["groupId"]}
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
          privateChatService={this.props.privateChatService}
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
          privateChatService={this.props.privateChatService}
        />
      </ModalView>
    )
  };
}