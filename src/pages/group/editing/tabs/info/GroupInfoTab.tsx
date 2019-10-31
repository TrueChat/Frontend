import React from "react";
import "./GroupInfoTab.scss";
import {StackController} from "../../GroupEditingPage";
import {GroupInitialsAvatar, Spinner} from "../../../../../widgets/Widgets";
import Input from "../../../common/Input";
import GroupService, {GroupDetails} from "../../../../../services/GroupService";

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
        <div className="group-users">

        </div>
      </div>
    );
  }

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

type Props = {
  stackController: StackController,
  groupService: GroupService,
  groupId: string
}

type State = {
  groupDetails?: GroupDetails,
  detailsAreLoaded: boolean
}