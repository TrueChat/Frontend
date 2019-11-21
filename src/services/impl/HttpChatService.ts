import ChatService from "../ChatService";
import ChatSession, {ChatEventListener, Message} from "../ChatSession";
import {ResponseHandler} from "../types";
import UserService from "../UserService";
import {listeners} from "cluster";


class HttpChatSession implements ChatSession {
  // workaround to prevent stack overflow exceptions
  private readonly maxCallStackSize = 100;
  private intervalId: any;

  private userService: UserService;
  private chatId: string;

  private messagesDeletionListeners: ChatEventListener[] = [];
  private messagesEditingListeners: ChatEventListener[] = [];
  private messagesAddingListeners: ChatEventListener[] = [];

  private baseUrl: string;
  private closed: boolean =  false;
  private callStackSize: number = 0;
  private messagesLoadedLastTime?: Message[] = undefined;

  constructor(baseUrl: string, interval: number, userService: UserService, chatId: string) {
    this.userService = userService;
    this.chatId = chatId;
    this.baseUrl = baseUrl;

    this.intervalId = setInterval(() => {
      // check call stack
      if (this.callStackSize === 0) {
        this.callStackSize = this.maxCallStackSize;
        this.load();
      }
    }, 500);
  }

  load() {
    this.loadAllMessages(response => {
      if (this.callStackSize === 0) {
        return;
      }
      this.callStackSize--;
      this.notifyListeners(response.data)
      if (!this.closed) {
        this.load();
      }
    });
  }

  private notifyListeners(recentMessages: Message[]) {
    if (!this.messagesLoadedLastTime) {
      this.messagesLoadedLastTime = recentMessages;
    }
    const messagesEdited = this.findEditedMessages(this.messagesLoadedLastTime, recentMessages);
    const messagesAdded = this.findNewMessages(this.messagesLoadedLastTime, recentMessages);
    const messagesDeleted = this.findDeletedMessages(this.messagesLoadedLastTime, recentMessages);

    this.messagesAddingListeners.forEach(listener => listener(messagesAdded));
    this.messagesDeletionListeners.forEach(listener => listener(messagesDeleted));
    this.messagesEditingListeners.forEach(listener => listener(messagesEdited));

    this.messagesLoadedLastTime = recentMessages;
  }

  private findNewMessages(prevMessages: Message[], recentMessages: Message[]) : Message[] {
    const result = [];

    for (let recentMessage of recentMessages) {
      let found = false;
      for (let prevMessage of prevMessages) {
        if (prevMessage.id === recentMessage.id) {
          found = true;
          break;
        }
      }
      if (!found) {
        result.push(recentMessage);
      }
    }

    return result;
  }

  private findEditedMessages(prevMessages: Message[], recentMessages: Message[]) : Message[] {
    const result = [];

    for (let recentMessage of recentMessages) {
      let found = false;
      for (let prevMessage of prevMessages) {
        if (prevMessage.id === recentMessage.id && prevMessage.content !== recentMessage.content) {
          found = true;
          break;
        }
      }
      if (!found) {
        result.push(recentMessage);
      }
    }

    return result;
  }

  private findDeletedMessages(prevMessages: Message[], recentMessages: Message[]) : Message[] {
    const result: Message[] = [];

    for (let prevMessage of prevMessages) {
      let found = false;
      for (let recentMessage of recentMessages) {
        if (prevMessage.id === recentMessage.id) {
          found = true;
          break;
        }
      }
      if (!found) {
        result.push(prevMessage);
      }
    }

    return result;
  }

  close(): void {
    this.closed = true;
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  deleteMessage(message: Message, onSuccess: () => void ): void {
    this.userService.sendAuthorizedRequest({
      url: `${this.baseUrl}/chats/message/${message.id}/`,
      method: "DELETE",
    }, onSuccess, () => { })
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

  addMessagesAddingListener(listener: ChatEventListener): void {
    this.messagesAddingListeners.push(listener);
  }

  addMessagesDeletionListener(listener: ChatEventListener): void {
    this.messagesDeletionListeners.push(listener);
  }

  addMessagesEditingListener(listener: ChatEventListener): void {
    this.messagesEditingListeners.push(listener);
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