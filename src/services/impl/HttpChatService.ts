import ChatService from "../ChatService";
import ChatSession, {Message} from "../ChatSession";
import {ResponseHandler} from "../types";
import UserService from "../UserService";


class HttpChatSession implements ChatSession {

  private intervalId: any;
  private userService: UserService;
  private chatId: string;
  private listeners: ResponseHandler<Message[]>[] = [];
  private baseUrl: string;

  constructor(baseUrl: string, interval: number, userService: UserService, chatId: string) {
    this.userService = userService;
    this.chatId = chatId;
    this.baseUrl = baseUrl;

    this.intervalId = setInterval(() => {
      this.loadAllMessages(response => {
        this.listeners.forEach(listener => listener(response));
      })
    }, interval)
  }

  addListener(listener: ResponseHandler<Message[]>) {
    this.listeners.push(listener);
  }

  close(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  deleteMessage(message: Message): void {
    this.userService.sendAuthorizedRequest({
      url: `${this.baseUrl}/chats/message/${message.id}/`,
      method: "DELETE",
    }, () => { }, () => { })
  }

  editMessage(message: Message): void {
    this.userService.sendAuthorizedRequest({
      url: `${this.baseUrl}/chats/message/${message.id}/`,
      method: "PATCH",
      body: {
        content: message.content
      }
    }, () => { }, () => { });
  }

  loadAllMessages(handler: ResponseHandler<Message[]>) : void {
    this.userService.sendAuthorizedRequest({
      url: `${this.baseUrl}/chats/${this.chatId}/messages/`,
      method: "GET",
    }, response => {
      const messages: Message[] = [];

      for (let i = response.data.length - 1; i >= 0; i--) {
        messages.push(this.mapResponseMessageToMessage(response.data[i]))
      }

      handler({
        status: response.status,
        headers: { },
        data: messages
      });
    }, response => {

    })
  };

  mapResponseMessageToMessage(message: any) : Message {
    return {
      id: message.id as number,
      sender: {
        id: message.user.id as number,
        firstName: message.user.first_name as string,
        lastName: message.user.last_name as string,
        username: message.user.username as string
      },
      content: message.content as string,
      dateCreated: new Date(message.date_created)
    };
  }

  sendMessage(message: string, onSuccess: (message: Message) => void): void {
    this.userService.sendAuthorizedRequest({
      url: `${this.baseUrl}/chats/${this.chatId}/add_message/`,
      method: "POST",
      body: {
        content: message
      }
    }, (response) => {
      onSuccess(this.mapResponseMessageToMessage(response.data));
    }, () => { });
  }

}

export default class HttpChatService implements ChatService {
  private userService: UserService;
  private interval: number;
  private baseUrl: string;

  constructor(
      userService: UserService,
      interval: number,
      baseUrl: string) {
    this.userService = userService;
    this.interval = interval;
    this.baseUrl = baseUrl;
  }

  connect(chatId: string): ChatSession {
    return new HttpChatSession(this.baseUrl, this.interval, this.userService, chatId);
  }

}