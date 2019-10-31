import React from "react";
import "./GroupInfoTab.scss";
import {StackController} from "../../GroupEditingPage";
import {GroupInitialsAvatar} from "../../../../../widgets/Widgets";
import Input from "../../../common/Input";
import {GroupData} from "../../../../../services/GroupService";

export default class GroupInfoTab extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      groupData: {
        name: props.groupData.name,
        description: props.groupData.description
      }
    }
  }

  render() {
    const { groupData } = this.state;
    return (
      <div className="Group-info-tab">
        <div className="data-section">
          <div className="row">
            <div className="col-3">
              <GroupInitialsAvatar groupData={groupData}/>
            </div>
            <div className="col-9">
              <div>
                <div className="input-label">
                  Name
                </div>
              </div>
              <div>
                <Input value={groupData.name} onChange={this.updateGroupName}/>
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
              <Input value={groupData.description} onChange={this.updateGroupDescription}/>
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
      groupData: {
        ...state.groupData,
        name: name
      }
    }));
  };

  updateGroupDescription = (description: string) => {
    this.setState(state => ({
      ...state,
      groupData: {
        ...state.groupData,
        description: description
      }
    }))
  }
}

type Props = {
  stackController: StackController,
  groupData: GroupData
}

type State = {
  groupData: GroupData
}