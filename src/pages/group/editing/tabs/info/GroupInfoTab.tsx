import React from "react";
import "./GroupInfoTab.scss";
import {StackController} from "../../GroupEditingPage";
import {Dropdown, GroupInitialsAvatar, Initials, Spinner} from "../../../../../widgets/Widgets";
import Input from "../../../common/Input";
import GroupService, {GroupDetails, GroupMember} from "../../../../../services/GroupService";
import GroupAddMembersTab from "../members/GroupAddMembersTab";
import UserService from "../../../../../services/UserService";
require("bootstrap/dist/css/bootstrap.css");

export default class GroupInfoTab extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      groupDetails: undefined,
      detailsAreLoaded: false
    };

    props.groupService
      .loadDetails(
        props.groupId,
        details => {
          this.setState(state => ({
            ...state,
            detailsAreLoaded: true,
            groupDetails: details
          }));
        },
        () => { }
      )
  };

  render() {
    if (!this.state.detailsAreLoaded) {
      return this.renderSpinner()
    } else {
      return this.renderTab();
    }
  }

  renderSpinner() {
    return <div className="text-center"><Spinner /></div>
  }

  renderTab() {
    const groupDetails = (this.state.groupDetails as GroupDetails);

    return (
      <div className="Group-info-tab">
        <div className="data-section">
          <div className="row">
            <div className="col-3">
              <GroupInitialsAvatar groupData={groupDetails}/>
            </div>
            <div className="col-9">
              <div>
                <div className="input-label">
                  Name
                </div>
              </div>
              <div>
                <Input value={groupDetails.name} onChange={this.updateGroupName}/>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="input-label">
                Description
              </div>
            </div>
            <div className="col-12">
              <Input value={groupDetails.description} onChange={this.updateGroupDescription}/>
            </div>
          </div>
        </div>
        <div className="group-members">
          <div className="row actions-row">
            <div className="col-4">
              {groupDetails.members.length} members
            </div>
            <div className="col-8 text-right">
              <span onClick={this.showMembersSearchTab}>Add</span>
            </div>
          </div>
          <div className="members">
            {groupDetails.members.map(member => (
              <MemberDetails
                key={`${groupDetails.groupId}-member-${member.id}-details`}
                member={member}
                onActionSelected={() => { }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  showMembersSearchTab = () => {
    this.props.stackController.push({
      body: (
        <GroupAddMembersTab
          groupService={this.props.groupService}
          userService={this.props.userService}
        />
      ),
      header: "Add members"

    })
  };

  updateGroupName = (name: string) => {
    this.setState(state => ({
      ...state,
      groupDetails: {
        ...state.groupDetails as GroupDetails,
        name: name
      }
    }));
  };

  updateGroupDescription = (description: string) => {
    this.setState(state => ({
      ...state,
      groupDetails: {
        ...state.groupDetails as GroupDetails,
        description: description
      }
    }))
  }
}

type MemberDetailsProps = {
  member: GroupMember,
  onActionSelected: (action: string) => void
}

const MemberDetails = (props: MemberDetailsProps) => (
  <div className="row member-details">
    <div className="col-2 member-initials">
      <Initials initials={`${props.member.firstName[0]}${props.member.lastName[0]}`}/>
    </div>
    <div className="col-8">
      <div className="member-full-name">
        {props.member.firstName} {props.member.lastName}
      </div>
      <div className="member-username">
        @{props.member.name}
      </div>
    </div>
    <div className="col-2">
      <div className="actions-dropdown">
        <Dropdown
          toggle={(<i className="fas fa-bars"/>)}
          options={["Profile", "Kick", "Ban"]}
          onSelect={option => console.log(option)}
        />
      </div>
    </div>
  </div>
);

type Props = {
  stackController: StackController,
  groupService: GroupService,
  userService: UserService
  groupId: string
}

type State = {
  groupDetails?: GroupDetails,
  detailsAreLoaded: boolean
}