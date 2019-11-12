import React from "react";
import "./GroupSearchMembersTab.scss";
import UserService, {UserProfile} from "../../../../../../services/UserService";
import GroupService, {GroupDetails} from "../../../../../../services/GroupService";
import {Spinner, UserInitialsAvatar} from "../../../../../widgets/Widgets";
import Input from "../../../common/Input";
require("bootstrap/dist/css/bootstrap.css");

export default class GroupSearchMembersTab extends React.Component<Props, State> {

  state: State = {
    searchString: "",
    searchResults: [],
    loading: false
  };

  render() {
    const { searchString, loading } = this.state;

    return (
      <div className="Group-add-members-tab">
        <div className="row search-section">
          <div className="col-10">
            <Input
              value={searchString}
              onChange={this.updateSearchString}
              placeholder="Add people"
              onEnter={this.doSearch}
            />
          </div>
          <div className="col-2">
            <div className="search-icon" onClick={this.doSearch}>
              <i className="fas fa-search" />
            </div>
          </div>
        </div>
        {loading ? this.showSpinner() : this.showSearchResults()}
      </div>
    );
  }

  private showSearchResults = () => {
    return this.state.searchResults.map((user, i) => {
      const { profile, isMember } = user;
      return (
        <div className="row user-section" key={`user-section-${profile.username}-${i}`}>
          <div className="col-2">
            <UserInitialsAvatar profile={profile}/>
          </div>
          <div className="col-8">
            <div className="user-full-name">
              {profile.first_name} {profile.last_name}
            </div>
            <div className="user-username">
              @{profile.username}
            </div>
          </div>
          <div className="col-2">
            {isMember
              ? <div onClick={_ => this.removeFromGroup(user)}><i className="action-icon fas fa-check"/></div>
              : <div onClick={_ => this.addToGroup(user)} ><i className="action-icon fas fa-plus" /></div>
            }
          </div>
        </div>
      )
    })
  };

  private addToGroup = (user: GroupUser) => {
    this.setState(state => {
      user.isMember = true;
      return state;
    }, () => {
      this.props.groupService.addUser(
        this.props.groupId,
        user.profile.username
      );
    });
  };

  private removeFromGroup = (user: GroupUser) => {
    this.setState(state => {
      user.isMember = false;
      return state;
    }, () => {
      this.props.groupService.removeUser(
        this.props.groupId,
        user.profile.username
      )
    });
  };

  private updateSearchString = (newValue: string) => {
    this.setState(state => ({
      ...state,
      searchString: newValue
    }));
  };

  private showSpinner = () => (
    <div className="text-center">
      <Spinner />
    </div>
  );

  private doSearch = () => {
    this.setState(state => ({
      ...state,
      loading: true
    }), () => {
      this.props.userService
        .searchUsers(this.state.searchString)
        .then(result => {
          this.setState(state => ({
            ...state,
            loading: false,
            searchResults: result
              .filter(this.isNotMember)
              .map(user => ({profile: user, isMember: false}))
          }));
        })
    });
  };

  private isNotMember = (user: UserProfile) => {
    const details = this.props.groupDetails;

    return(
      details.creator.username !== user.username &&
      details.members
        .findIndex(member => member.username === user.username) === -1
    );
  }
}

type GroupUser = {
  profile: UserProfile,
  isMember: boolean
}

type Props = {
  userService: UserService,
  groupService: GroupService,
  groupId: string,
  groupDetails: GroupDetails
}

type State = {
  searchResults: GroupUser[],
  searchString: string,
  loading: boolean
}