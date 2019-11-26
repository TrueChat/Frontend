import React from "react";
import "bootstrap/dist/css/bootstrap.min.css"
import "./Header.scss"
import ModalLink from "../../modals/ModalLink";
import UserService from "../../../../../services/UserService";


export default class Header extends React.Component<Props, State> {

  state = {
    isDropdownOpened: false,
  };

  render() {
    const { isDropdownOpened } = this.state;

    return (
      <div className="Header">
        <div className="header-dropdown-control">
          {
            isDropdownOpened
              ? <i className="fas fa-times" onClick={this.toggleDropdown}/>
              : <i className="fas fa-bars" onClick={this.toggleDropdown}/>
          }
        </div>
        True Chat
        <div className={`${isDropdownOpened ? "" : "d-none"} header-dropdown`}>
          <div className="header-dropdown-item">
            <ModalLink modalName="currentUserProfile" className="a-none w-100 text-left">
              <div className="row">
                <div className="col-1">
                  <i className="fas fa-user"/>
                </div>
                <div className="col-11">
                  Profile
                </div>
              </div>
            </ModalLink>
          </div>
          <div className="header-dropdown-item">
            <ModalLink modalName="groupCreation" className="a-none w-100 text-left">
              <div className="row">
                <div className="col-1">
                  <i className="fas fa-user-friends"/>
                </div>
                <div className="col-11">
                  Create group chat
                </div>
              </div>
            </ModalLink>
          </div>
          <div className="header-dropdown-item">
            <ModalLink modalName="search" className="a-none w-100 text-left">
              <div className="row">
                <div className="col-1">
                  <i className="fas fa-search"/>
                </div>
                <div className="col-11">
                  Search for users
                </div>
              </div>
            </ModalLink>
          </div>
          <div className="header-dropdown-item">
            <ModalLink modalName="userStatistics" className="a-none w-100 text-left">
              <div className="row">
                <div className="col-1">
                  <i className="fas fa-chart-bar"/>
                </div>
                <div className="col-11">
                  View statistics
                </div>
              </div>
            </ModalLink>
          </div>
          <div className="header-dropdown-item">
            <div className="a-none w-100 text-left cursor-pointer" onClick={this.logout}>
              <div className="row">
                <div className="col-1">
                  <i className="fas fa-sign-out-alt"/>
                </div>
                <div className="col-11">
                  Logout
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  toggleDropdown = () => {
    this.setState(state => ({
      ...state, isDropdownOpened: !state.isDropdownOpened
    }));
  };

  logout = () => {
    this.props.userService
      .logout(() => {
        window.location.href = "/";
      });
  }

}

type State = {
  isDropdownOpened: boolean
}

type Props = {
  userService: UserService
}