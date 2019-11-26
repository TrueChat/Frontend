import StatisticsService, {GroupStatistics} from "../../../../services/StatisticsService";
import React from "react";
import GroupStatisticsView from "../../../views/statistics/group/GroupStatisticsView";
import {Spinner} from "../../../widgets/Widgets";

type Props = {
  statisticsService: StatisticsService,
  groupId: string
}

type State = {
  stats: GroupStatistics|undefined
}

export default class GroupStatisticsModal extends React.Component<Props>{

  state = {
    stats: undefined as GroupStatistics|undefined
  };

  componentDidMount(): void {
    this.props.statisticsService
      .loadGroupStatistics(this.props.groupId,
        response => {
          this.setState(state => ({
            ...state, stats: response.data
          }))
        }
      )
  }

  render() {
    const { statisticsService, groupId } = this.props;
    const { stats } = this.state;
    if (!stats) {
      return <div className="text-center"><Spinner /></div>
    }

    return (
      <GroupStatisticsView stats={stats} statisticsService={statisticsService} groupId={groupId} />
    );
  }

}