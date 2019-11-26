import StatisticsService, {GroupStatistics, UserGroupStatistics} from "../../../../services/StatisticsService";
import React from "react";
import {Spinner} from "../../../widgets/Widgets";
import "./GroupStatisticsView.scss";

type Props = {
  stats: GroupStatistics,
  statisticsService: StatisticsService,
  groupId: string
}

type State = {
  plot: string|undefined
}

export default class GroupStatisticsView extends React.Component<Props, State> {

  state = {
    plot: (undefined as string|undefined)
  };

  componentDidMount(): void {
    const { statisticsService, groupId } = this.props;

    statisticsService
      .loadGroupStatisticsPlot(groupId, plot => {
        this.setState(state => ({
          ...state, plot: plot.data
        }))
      })
  }

  render() {
    const { stats } = this.props;

    return (
      <div className="Group-statistics-view">
        <div className="header">
          Group Statistics
        </div>
        <div className="body">
          <div className="statistics-section">
            <div className="statistics-section-header">
              Activity
            </div>
            <div className="statistics-section-body">
              <div className="d-flex flex-row justify-content-between">
                <div className="font-weight-bold">
                  Days since creation:
                </div>
                <div>{stats.daysExist}</div>
              </div>
              <div className="d-flex flex-row justify-content-between">
                <div className="font-weight-bold">
                  Total number of messages:
                </div>
                <div>
                  {stats.numberOfMessages}
                </div>
              </div>
              <div className="d-flex flex-row justify-content-between">
                <div>Mean number of words:</div><div>{stats.meanMessageWords}</div>
              </div>
              <div className="d-flex flex-row justify-content-between">
                <div>Mean number of characters:</div><div>{stats.meanMessageChars}</div>
              </div>
            </div>
          </div>
          <div className="statistics-section">
            <div className="statistics-section-header">
              Most used words
            </div>
            <div className="statistics-section-body">
              {this.state.plot
                ? <img src={this.state.plot} alt="plot" width="100%" height="100%"/>
                : <div className="text-center"><Spinner /></div>
              }
            </div>
          </div>
          <div className="statistics-section">
            <div className="statistics-section-header">
              Users
            </div>
            <div className="statistics-section-body">
              <div className="d-flex flex-row justify-content-between">
                <div>Total number of users:</div><div>{stats.numberOfUsers}</div>
              </div>
              <div className="d-flex flex-row justify-content-between">
                <div>Active users:</div><div>{stats.numberOfActiveUsers}</div>
              </div>
              <div className="d-flex flex-row justify-content-between">
                <div>Inactive users:</div><div>{stats.numberOfAfkUsers}</div>
              </div>
            </div>
          </div>
          {stats.membersStatistics.map(memberStats => (
            <MemberStatisticsSection stats={memberStats} />
          ))}
        </div>
      </div>
    )
  }
};

type MemberStatisticsSectionProps = {
  stats: UserGroupStatistics
}

type MemberStatisticsSectionState = {
  expand: boolean
}

class MemberStatisticsSection extends React.Component<MemberStatisticsSectionProps, MemberStatisticsSectionState> {

  state = {
    expand: false
  };

  render() {
    const { stats } = this.props;
    const { expand } = this.state;

    return (
      <div className="statistics-section">
        <div
          className="statistics-section-header d-flex flex-row justify-content-between cursor-pointer"
          onClick={this.toggleStats}
        >
          <div>{stats.username}</div>
          <div>
            <i className={`fas fa-${expand ? "caret-up" : "caret-down"}`}/>
          </div>
        </div>
        <div className={`statistics-section-body ${!expand ? "d-none" : ""}`}>
          <div className="d-flex flex-row justify-content-between">
            <div>Days in chat:</div><div>{stats.daysIn}</div>
          </div>
          <div className="d-flex flex-row justify-content-between">
            <div>Activity percentage:</div><div>{stats.percentOfMessages}</div>
          </div>
          <div className="d-flex flex-row justify-content-between">
            <div>Total number of messages:</div><div>{stats.numberOfMessages}</div>
          </div>
          <div className="d-flex flex-row justify-content-between">
            <div>Words:</div><div>{stats.numberOfWords}</div>
          </div>
          <div className="d-flex flex-row justify-content-between">
            <div>Characters:</div><div>{stats.numberOfCharacters}</div>
          </div>
          <div className="d-flex flex-row justify-content-between">
            <div>Average number of words in message:</div><div>{stats.meanNumberOfWords}</div>
          </div>
          <div className="d-flex flex-row justify-content-between">
            <div>Average number of characters in message:</div><div>{stats.meanNumberOfCharacters}</div>
          </div>
        </div>
      </div>
    );
  }

  toggleStats = () => {
    this.setState(state => ({
      ...state, expand: !state.expand
    }))
  }

}