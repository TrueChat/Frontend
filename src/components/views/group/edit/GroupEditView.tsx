import React from "react";
import "./GroupEditView.scss";
import GroupInfoTab from "./tabs/info/GroupInfoTab";
import GroupService, {GroupDetails} from "../../../../services/GroupService";
import UserService from "../../../../services/UserService";
require("bootstrap/dist/css/bootstrap.css");

export default class GroupEditView
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
          groupId={props.groupId}
          groupDetails={props.groupDetails}
        />
    });
  }

  render() {
    const currentTab = this.currentTab();
    return (
      <div className="Group-edit-view">
        <div className="header">
          {this.state.tabStack.length > 1
            ? this.renderShowPreviousTabControl()
            : null
          }
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

  renderShowPreviousTabControl() {
    return (
      <div className="previous-tab-control" onClick={_ => this.pop()}>
        <i className="fas fa-arrow-left"/>
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
  userService: UserService,
  groupId: string,
  groupDetails?: GroupDetails
}

type State = {
  tabStack: Tab[]
}

type Tab = {
  header: string,
  body: React.ReactElement,
}
