import React from "react";
import "./GroupEditingPage.scss";
import GroupInfoTab from "./tabs/info/GroupInfoTab";
import GroupService from "../../../services/GroupService";
import UserService from "../../../services/UserService";
require("bootstrap/dist/css/bootstrap.css");

export default class GroupEditingPage
    extends React.Component<Props, State>
    implements StackController {

  constructor(props: Props) {
    super(props);
    this.state = {
      tabStack: []
    };
    this.state.tabStack.push({
      header: "Group Info",
      body:
        <GroupInfoTab
          stackController={this}
          groupService={props.groupService}
          userService={props.userService}
          groupId={""} // TODO retrieve group id form url
        />
    });
  }

  render() {
    const currentTab = this.currentTab();
    return (
      <div className="Group-editing-page">
        <div className="header">
          <div className="previous-tab-control" onClick={_ => this.pop()}>
            <i className="fas fa-arrow-left"/>
          </div>
          <div className="header-text">
            {currentTab.header}
          </div>
        </div>
        <div className="body">
          {currentTab.body}
        </div>
      </div>
    );
  }

  currentTab() : Tab {
    const { tabStack } = this.state;
    return tabStack[tabStack.length - 1];
  }

  pop() {
    this.setState(state => {
      if (state.tabStack.length > 1) {
        state.tabStack.pop();
      }
      return state;
    })
  }

  push(tab: Tab) {
    this.setState(state => {
      state.tabStack.push(tab);
      return state;
    })
  }

}

export interface StackController {
  push(tab: Tab) : void
  pop() : void;
}

type Props = {
  groupService: GroupService,
  userService: UserService
}

type State = {
  tabStack: Tab[]
}

type Tab = {
  header: string,
  body: React.ReactElement,
}
