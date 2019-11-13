import "./SearchView.scss"
import React from "react";
import UserService, {UserProfile} from "../../../services/UserService";
import {Spinner, UserInitialsAvatar} from "../../widgets/Widgets";
import {NavLink} from "react-router-dom";
import Input from "../group/common/Input";
import "./SearchView.scss";

export default class SearchView extends React.Component<Props, State> {

  state = {
    searchResults: [],
    loading: false,
    searchString: ""
  };

  render() {
    const { loading, searchString } = this.state;

    return (
      <div className="Search-view">
        <div className="header">
          <div className="row">
            <div className="col-10">
              <Input
                value={searchString}
                onChange={this.updateSearchString}
                onEnter={this.doSearch}
                placeholder="Search"
              />
            </div>
            <div className="col-2">
              <div onClick={this.doSearch} className="icon-container">
                <i className="fas fa-search" />
              </div>
            </div>
          </div>
        </div>
        <div className="results">
          {loading ? this.renderSpinner() : this.renderResults()}
        </div>
      </div>
    )
  }

  renderResults() {
    return this.state.searchResults.map((profile: UserProfile) => (
      <div className="row">
        <div className="col-2">
          <UserInitialsAvatar profile={profile}/>
        </div>
        <div className="col-10">
          <div className="profile-full-name">
            {profile.first_name} {profile.last_name}
          </div>
          <div className="profile-username">
            <NavLink
              to={`/profile/${profile.username}`}
              className="profile-username-link">
              @{profile.username}
            </NavLink>
          </div>
        </div>
      </div>
    ))
  }

  renderSpinner = () => {
    return <div className="text-center"><Spinner /></div>
  };

  updateSearchString = (value: string) => {
    this.setState(state => ({
      ...state, searchString: value
    }));
  };

  doSearch = () => {
    this.setState(state => ({
      ...state, loading: true
    }), () => {
      this.props.userService
        .searchUsers(this.state.searchString)
        .then(response => {
          this.setState(state => ({
            ...state,
            loading: false,
            searchResults: response
          }));
        })
    })
  }

}

type Props = {
  userService: UserService
}

type State = {
  searchResults: UserProfile[],
  loading: boolean,
  searchString: string
}
