import React from "react";
import StatisticsService, {UserStatistics} from "../../../../services/StatisticsService";
import "bootstrap/dist/css/bootstrap.min.css";
import {Spinner} from "../../../widgets/Widgets";
import UserStatisticsView from "../../../views/statistics/user/UserStatisticsView";

export default class UserStatisticsModal extends React.Component<Props, State> {

  state = {
    stats: undefined,
    errorMessage: undefined
  };

  componentDidMount(): void {
    this.props.statisticsService.loadForCurrentUser(response => {
      this.setState(state => ({
        ...state, stats: response.data
      }))
    }, response => {
      this.setState(state => ({
        ...state, errorMessage: "Sorry, we cannot currently load statistics"
      }))
    });
  }

  render() {
    const stats = this.state.stats as UserStatistics|undefined;
    const errorMessage = this.state.errorMessage as string|undefined;

    if (!stats) {
      return <div className="text-center"><Spinner/></div>
    }

    if (errorMessage) {
      return <div className="p-2 text-center">{errorMessage}</div>
    }

    return (
      <UserStatisticsView stats={stats} statisticsService={this.props.statisticsService}/>
    )
  }
}

type Props = {
  statisticsService: StatisticsService
}

type State = {
  stats: UserStatistics|undefined,
  errorMessage: string|undefined
}