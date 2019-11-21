import PrivateChatService from "../PrivateChatService";
import UserService from "../UserService";
import { Response } from "../types";
import {ok} from "assert";

export default class RemotePrivateChatService implements PrivateChatService {
  private readonly userService: UserService;
  private readonly baseUrl: string;

  public constructor(baseUrl: string, userService: UserService) {
    this.userService = userService;
    this.baseUrl = baseUrl;
  }

  createChat(username: string, responseHandler: (response: Response<string>) => void): void {
    this.userService.sendAuthorizedRequest({
      url: `${this.baseUrl}/chats/private_chats/${username}/`,
      method: "POST"
    }, response => {
      responseHandler({
        status: response.status,
        headers: response.headers,
        data: (response.data.id as string)
      })
    }, response => {
      /* fuck off */
    })
  }

  exists(username: string, responseHandler: (response: Response<string|undefined>) => void): void {
    this.userService.sendAuthorizedRequest({
      url: `${this.baseUrl}/chats/private_chats/${username}/`,
      method: "GET"
    }, response => {
      responseHandler({
        status: 200,
        headers: response.headers,
        data: response.data[0].id
      });
    }, response => {
      responseHandler({
        status: 404,
        headers: response.headers,
        data: undefined
      });
    })
  }



}