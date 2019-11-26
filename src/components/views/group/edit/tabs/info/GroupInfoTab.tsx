import React from "react";
import "bootstrap/dist/css/bootstrap.css"
import "./GroupInfoTab.scss";
import {StackController} from "../../GroupEditView";
import {Dropdown, GroupInitialsAvatar, Spinner, UserInitialsAvatar} from "../../../../../widgets/Widgets";
import GroupService, {GroupDetails, GroupMember} from "../../../../../../services/GroupService";
import GroupSearchMembersTab from "../members/GroupSearchMembersTab";
import UserService from "../../../../../../services/UserService";
import {Link} from "react-router-dom";
import Input from "../../../common/Input";
import SubmitButton from "../../../../../widgets/SubmitButton";
import {Response} from "../../../../../../services/types";

import {ConstraintViolation} from "../../../../../../services/types";
import {findConstraintViolation, hasViolation} from "../../../../../../services/utils";
import ErrorMessage from "../../../../../pages/auth/components/common/ErrorMessage";
import ModalLink from "../../../../../pages/main/modals/ModalLink";

export default class GroupInfoTab extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      groupDetails: props.groupDetails,
      loading: true,
      violations: []
    };

  };

  componentDidMount(): void {
    if (!this.state.groupDetails) {
      this.loadDetails();
    }
  }

  private loadDetails = () => {
    const { groupService, groupId } = this.props;
    this.setState(state => ({
      ...state,
      loading: true,
    }), () => {
      groupService.loadDetails(
        groupId,
        details => {
          this.setState(state => ({
            ...state,
            loading: false,
            groupDetails: details
          }))
        },
        () => { }
      )
    });
  };

  render() {
    if (this.state.loading) {
      return this.renderSpinner()
    } else {
      return this.renderTab();
    }
  }

  private renderSpinner() {
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
              {this.renderViolationIfPresent("name")}
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
            {this.renderViolationIfPresent("description")}
          </div>
          <div className="row">
            <div className="col-12">
              <ModalLink
                modalName="groupStatistics"
                relativePath={`${groupDetails.groupId}`}
                className="a-none text-white font-weight-bold"
              >
                <i className="fas fa-chart-bar"/> Show statistics
              </ModalLink>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="text-white font-weight-bold cursor-pointer" onClick={() => {
                this.props.groupService
                  .leaveGroup(this.props.groupId, () => {
                    window.location.href = "/";
                  })
              }}>
                <i className="fas fa-sign-out-alt"/> Leave chat
              </div>
            </div>
          </div>
        </div>
        <div className="group-members">
          <div className="row actions-row">
            <div className="col-4">
              {groupDetails.members.length} members
            </div>
            <div className="col-8 text-right">
              <span onClick={this.showMembersSearchTab} className="cursor-pointer">Add</span>
            </div>
          </div>
          <div className="members">
            {groupDetails.members.map(member => (
              <MemberDetails
                key={`${groupDetails.groupId}-member-${member.id}-details`}
                member={member}
                onActionSelected={action => this.doActionOnMember(member, action)}
              />
            ))}
          </div>
        </div>
        <div className="row">
          <div className="col-12 text-right">
            <SubmitButton onClick={() => this.updateDetails(groupDetails)}/>
          </div>
        </div>
      </div>
    );
  }

  renderViolationIfPresent(property: string) {
    let violation = findConstraintViolation(property, this.state.violations);
    if (violation) {
      return <ErrorMessage message={violation.message}/>
    }
  }

  private updateDetails = (details: GroupDetails) => {
    this.setState(state => ({
      ...state, loading: true
    }), () => {
      this.props.groupService.update(
        details, this.handleUpdateSuccess, this.handleUpdateFailure);
    });
  };

  private handleUpdateSuccess = () => {
    this.setState(state => ({
      ...state, loading: false, violations: []
    }))
  };

  private handleUpdateFailure = (response: Response<ConstraintViolation[]>) => {
    this.setState(state => ({
      ...state, loading: false, violations: response.data
    }))
  };

  private doActionOnMember = (member: GroupMember, action: string) => {
    switch (action) {
      case "Kick":
        this.kickMember(member);
        break;
      case "Ban":
        this.banMember(member);
        break;
    }
  };

  private kickMember = (member: GroupMember) => {
    const { groupService, groupId } = this.props;
    groupService.kickUser(groupId, member.username, this.reload);
  };

  private banMember = (member: GroupMember) => {
    const { groupService, groupId } = this.props;
    groupService.banUser(groupId, member.username, this.reload)
  };

  private reload = () => {
    this.loadDetails()
  };

  private showMembersSearchTab = () => {
    this.props.stackController.push({
      body: (
        <GroupSearchMembersTab
          groupService={this.props.groupService}
          userService={this.props.userService}
          groupId={this.props.groupId}
          groupDetails={this.state.groupDetails as GroupDetails}
        />
      ),
      header: "Add members"
    });
  };

  private updateGroupName = (name: string) => {
    this.setState(state => ({
      ...state,
      groupDetails: {
        ...state.groupDetails as GroupDetails,
        name: name
      }
    }));
  };

  private updateGroupDescription = (description: string) => {
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
      <UserInitialsAvatar
        profile={{
          first_name: props.member.firstName,
          last_name: props.member.lastName,
          about: "",
          username: props.member.username
        }}/>
    </div>
    <div className="col-8">
      <div className="member-full-name">
        {props.member.firstName} {props.member.lastName}
      </div>
      <div className="member-username">
        <Link to={{
          pathname:`/modal/userProfile/${props.member.username}`,
          state: {
            modal: { name: "userProfile" }
          }
        }} className="link">
          @{props.member.username}
        </Link>
      </div>
    </div>
    <div className="col-2">
      <div className="actions-dropdown">
        <Dropdown
          toggle={(<i className="fas fa-ellipsis-v"/>)}
          options={["Kick", "Ban"]}
          onSelect={option => props.onActionSelected(option)}
        />
      </div>
    </div>
  </div>
);

type Props = {
  stackController: StackController,
  groupService: GroupService,
  userService: UserService
  groupId: string,
  groupDetails?: GroupDetails
}

type State = {
  groupDetails?: GroupDetails,
  loading: boolean,
  violations: ConstraintViolation[]
}