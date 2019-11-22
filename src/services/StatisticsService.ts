import {ResponseHandler} from "./types";

export interface UserStatistics {
  numberOfChats: number,
  numberOfDialogs: number,
  daysWith: number,
  numberOfMessages: number,
  numberOfWords: number,
  numberOfCharacters: number,
  activePeriod: string,
  activeNumberOfMessages: number,
  activeNumberOfWords: number,
  activeNumberOfCharacters: number
}

export default interface StatisticsService {

  loadForCurrentUser(responseHandler: ResponseHandler<UserStatistics>) : void;

  /**
   * Returns image in base64 format
   */
  loadStatisticsPlot(responseHandler: ResponseHandler<string>) : void;

}