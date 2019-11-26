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

export interface UserGroupStatistics {
  username: string,
  meanNumberOfCharacters: number,
  meanNumberOfWords: number,
  numberOfMessages: number,
  numberOfWords: number,
  numberOfCharacters: number,
  percentOfMessages: number,
  daysIn: number
}

export interface GroupStatistics {
  numberOfMessages: number,
  numberOfUsers: number,
  daysExist: number,
  meanMessageChars: number,
  meanMessageWords: number,
  numberOfActiveUsers: number,
  numberOfAfkUsers: number,
  membersStatistics: UserGroupStatistics[]
}

export default interface StatisticsService {

  loadForCurrentUser(responseHandler: ResponseHandler<UserStatistics>, errorResponseHandler?: ResponseHandler<any>) : void;

  /**
   * Returns image in DataURL format
   */
  loadStatisticsPlot(responseHandler: ResponseHandler<string>, errorResponseHandler?: ResponseHandler<any>) : void;

  loadGroupStatistics(
      groupId: string,
      responseHandler: ResponseHandler<GroupStatistics>,
      errorHandler?: ResponseHandler<any>) : void;

  loadGroupStatisticsPlot(
      groupId: string,
      responseHandler: ResponseHandler<string>,
      errorResponseHandler?: ResponseHandler<any>) : void;


}