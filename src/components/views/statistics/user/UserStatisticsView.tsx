import React from "react";
import StatisticsService, {UserStatistics} from "../../../../services/StatisticsService";
import "bootstrap/dist/css/bootstrap.min.css";
import "./UserStatisticsView.scss"
import {Spinner} from "../../../widgets/Widgets";

export default class UserStatisticsView extends React.Component<Props, State> {

  state = {
    plot: undefined
  };

  componentDidMount(): void {
    this.props.statisticsService.loadStatisticsPlot(response => {
      this.setState(state => ({
        ...state, plot: response.data
      }))
    })
  }

  render() {
    const { stats } = this.props;
    return (
      <div className="User-statistics-view">
        <div className="header">
          User Statistics
        </div>
        <div className="body">
          <div className="statistics-section">
            <div className="statistics-section-header">
              Chats
            </div>
            <div className="statistics-section-body">
              <div className="d-flex flex-row justify-content-between">
                <div className="font-weight-bold">
                  Number of chats
                </div>
                <div>{stats.numberOfChats}</div>
              </div>
              <div className="d-flex flex-row justify-content-between">
                <div>Dialogue:</div><div>{stats.numberOfDialogs}</div>
              </div>
              <div className="d-flex flex-row justify-content-between">
                <div>Groups:</div><div>{stats.numberOfChats - stats.numberOfDialogs}</div>
              </div>
            </div>
          </div>
          <div className="statistics-section">
            <div className="statistics-section-header">
              Activity
            </div>
            <div className="statistics-section-body">
              <div className="d-flex flex-row justify-content-between">
                <div className="font-weight-bold">Days since registration:</div><div>{stats.daysWith}</div>
              </div>
              <div className="d-flex flex-row justify-content-between">
                <div className="font-weight-bold">Total number of messages:</div><div>{stats.numberOfChats}</div>
              </div>
              <div className="d-flex flex-row justify-content-between">
                <div>Words:</div><div>{stats.numberOfWords}</div>
              </div>
              <div className="d-flex flex-row justify-content-between">
                <div>Characters:</div><div>{stats.numberOfCharacters}</div>
              </div>
            </div>
          </div>
          <div className="statistics-section">
            <div className="statistics-section-header">
              Active period
            </div>
            <div className="statistics-section-body">
              <div className="d-flex flex-row justify-content-between">
                <div className="font-weight-bold">Most active period:</div>
                <div>{stats.activePeriod}</div>
              </div>
              <div className="d-flex flex-row justify-content-between">
                <div className="font-weight-bold">Messages this period:</div>
                <div>{stats.activeNumberOfMessages}</div>
              </div>
              <div className="d-flex flex-row justify-content-between">
                <div>Words:</div><div>{stats.activeNumberOfWords}</div>
              </div>
              <div className="d-flex flex-row justify-content-between">
                <div>Characters</div><div>{stats.activeNumberOfCharacters}</div>
              </div>
            </div>
          </div>
          <div className="statistics-section">
            <div className="statistics-section-header">
                Most used words
            </div>
            <div className="statistics-section-body">
              {this.state.plot
                ? <img src={`data:image/png;base64,${this.state.plot}`} alt="plot" width="100%" height="100%"/>
                : <div className="text-center"><Spinner /></div>
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

type Props = {
  stats: UserStatistics,
  statisticsService: StatisticsService
}

type State = {
  plot: string|undefined
}