import React from "react";
import GroupService, {GroupDetails} from "../../../../../services/GroupService";
import {GroupInitialsAvatar, Spinner} from "../../../../widgets/Widgets";
import "bootstrap/dist/css/bootstrap.min.css";
import "./GroupList.scss"
import {Link} from "react-router-dom";

export default class GroupList extends React.Component<Props, State> {

  state = {
    groups: undefined
  };

  componentDidMount(): void {
    this.props.groupService
      .findAll(result => this.setState(state => ({
        ...state, groups: result.data
      })));
  }

  render() {
    const groups = (this.state.groups as GroupDetails[]|undefined);

    if (!groups) {
      return <div className="text-center"><Spinner /></div>
    }

    return (
      <div className="Group-list">
        {groups.map((details, i) => (
          <div className="group-details" key={details.groupId + i}>
            <div className="row">
              <div className="col-2">
                <GroupInitialsAvatar groupData={details} />
              </div>
              <div className="col-10">
                <div className="row">
                  <div className="col-12 group-name">
                    <Link to={`/group/${details.groupId}`} className="a-none">
                      {details.name}
                    </Link>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 group-first-message">
                    Mock text
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }
}

type State = {
  groups: GroupDetails[]|undefined
}

type Props = {
  groupService: GroupService
}