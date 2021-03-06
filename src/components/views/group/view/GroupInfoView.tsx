import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./GroupInfoView.scss";
import GroupService, {GroupDetails, GroupMember} from "../../../../services/GroupService";
import UserService from "../../../../services/UserService";
import {GroupInitialsAvatar, Spinner, UserInitialsAvatar} from "../../../widgets/Widgets";
import ModalLink from "../../../pages/main/modals/ModalLink";

export default class GroupInfoView extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      groupDetails: props.groupDetails
    }
  }

  componentDidMount(): void {
    if (!this.state.groupDetails) {
      this.loadDetails();
    }
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
      <div className="Group-info-view">
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
      <React.Fragment>
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
          <div className="row">
            <div className="col-12">
              <ModalLink
                className="a-none text-white font-weight-bold"
                modalName={"groupStatistics"}
                relativePath={`${groupDetails.groupId}`}
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
                Leave chat
              </div>
            </div>
          </div>
        </div>
        <div className="group-members">
          <div className="row actions-row">
            <div className="col-12">
              {groupDetails.members.length + 1} members
            </div>
          </div>
          <div className="members">
            <MemberDetails key="creator" member={groupDetails.creator} />
            {groupDetails.members.map(member => (
              <MemberDetails
                key={`${groupDetails.groupId}-member-${member.id}-details`}
                member={member}
              />
            ))}
          </div>
        </div>
      </React.Fragment>
    );
  }

}

type MemberDetailsProps = {  member: GroupMember }

const MemberDetails = (props: MemberDetailsProps) => (
  <div className="row member-details">
    <div className="col-2 member-initials">
      <UserInitialsAvatar profile={{
        username: props.member.username,
        last_name: props.member.lastName,
        first_name: props.member.firstName,
        images: props.member.images,
        about: ""
      }}/>
    </div>
    <div className="col-10">
      <div className="member-full-name">
        {props.member.firstName} {props.member.lastName}
      </div>
      <div className="member-username">
        <ModalLink modalName="userProfile" relativePath={props.member.username} className="link">
          @{props.member.username}
        </ModalLink>
      </div>
    </div>
  </div>
);

type Props = {
  groupService: GroupService,
  userService: UserService
  groupId: string,
  groupDetails?: GroupDetails
}

type State = {
  groupDetails?: GroupDetails,
}