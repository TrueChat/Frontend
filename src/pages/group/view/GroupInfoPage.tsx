import React from "react";
import "./GroupInfoPage.scss";
import GroupService, {GroupDetails, GroupMember} from "../../../services/GroupService";
import UserService from "../../../services/UserService";
import {GroupInitialsAvatar, Initials, Spinner} from "../../../widgets/Widgets";
require("bootstrap/dist/css/bootstrap.css");

export default class GroupInfoPage extends React.Component<Props, State> {

  state = {
    groupDetails: undefined
  };

  componentDidMount(): void {
    this.loadDetails();
  }

  private loadDetails = () => {
    const { groupService, groupId } = this.props;
    groupService.loadDetails(
      groupId,
      details => {
        this.setState(state => ({
          ...state,
          groupDetails: details
        }))
      },
      () => {
      }
    );
  };

  render() {
    const groupDetails = this.state.groupDetails as GroupDetails|undefined;

    return (
      <div className="Group-page-layout">
        <div className="header">
          <div className="header-text">
            Group Info
          </div>
        </div>
        <div className="body">
          {groupDetails
            ? this.renderGroupDetails(groupDetails)
            : <div className="text-center"><Spinner /></div>
          }
        </div>
      </div>
    );
  }

  renderGroupDetails(groupDetails: GroupDetails) {
    return (
      <div className="Group-info-page">
        <div className="data-section">
          <div className="row">
            <div className="col-3">
              <GroupInitialsAvatar groupData={groupDetails}/>
            </div>
            <div className="col-9">
              <div>
                <div className="label">
                  Name
                </div>
              </div>
              <div className="label-value">
                {groupDetails.name}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="label">
                Description
              </div>
              <div className="label-value">
                {groupDetails.description}
              </div>
            </div>
          </div>
        </div>
        <div className="group-members">
          <div className="row actions-row">
            <div className="col-12">
              {groupDetails.members.length} members
            </div>
          </div>
          <div className="members">
            {groupDetails.members.map(member => (
              <MemberDetails
                key={`${groupDetails.groupId}-member-${member.id}-details`}
                member={member}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

}

type MemberDetailsProps = {  member: GroupMember }

const MemberDetails = (props: MemberDetailsProps) => (
  <div className="row member-details">
    <div className="col-2 member-initials">
      <Initials initials={`${props.member.firstName[0]}${props.member.lastName[0]}`}/>
    </div>
    <div className="col-10">
      <div className="member-full-name">
        {props.member.firstName} {props.member.lastName}
      </div>
      <div className="member-username">
        @{props.member.username}
      </div>
    </div>
  </div>
);

type Props = {
  groupService: GroupService,
  userService: UserService
  groupId: string
}

type State = {
  groupDetails?: GroupDetails,
}