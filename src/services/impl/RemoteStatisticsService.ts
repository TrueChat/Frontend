import StatisticsService, {GroupStatistics, UserStatistics} from "../StatisticsService";
import {ResponseHandler} from "../types";
import UserService from "../UserService";

export default class RemoteStatisticsService implements StatisticsService {

  constructor(
      private baseUrl: string,
      private userService: UserService) {
  }

  loadForCurrentUser(responseHandler: ResponseHandler<UserStatistics>, errorHandler?: ResponseHandler<any>): void {
    this.userService.sendAuthorizedRequest({
      method: "GET",
      url: `${this.baseUrl}/api/user/`,
    }, response => {
      const data = response.data;

      responseHandler({
        status: response.status,
        headers: response.headers,
        data: {
          activePeriod: (data.active_period as string),
          numberOfCharacters: (data.chars_num as number),
          numberOfWords: (data.words_num as number),
          numberOfMessages: (data.mess_num as number),
          numberOfChats: (data.chats_num as number),
          daysWith: (data.days_with as number),
          numberOfDialogs: (data.dialogs_num as number),
          activeNumberOfCharacters: (data.act_chars_num as number),
          activeNumberOfMessages: (data.act_mess_num as number),
          activeNumberOfWords: (data.act_words_num as number)
        }
      })
    }, response => {
      if (errorHandler) {
        errorHandler(response);
      }
    });
  }

  loadStatisticsPlot(responseHandler: ResponseHandler<string>): void {
    this.userService.sendAuthorizedRequest({
      method: "GET",
      url: `${this.baseUrl}/api/user/plot/`,
      responseType: "blob",
    }, response => {
      const reader = new FileReader();
      reader.readAsDataURL(response.data);
      reader.onload = () => {
        responseHandler({
          status: response.status,
          headers: response.headers,
          data: (reader.result as string)
        });
      };
    }, () => {
    })
  }

  loadGroupStatistics(
      groupId: string,
      responseHandler: ResponseHandler<GroupStatistics>,
      errorHandler?: ResponseHandler<any>): void {
  }

  loadGroupStatisticsPlot(
      groupId: string,
      responseHandler: ResponseHandler<string>,
      errorResponseHandler?: ResponseHandler<any>): void {
  }

}