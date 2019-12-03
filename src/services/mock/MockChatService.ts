import ChatService from "../ChatService";
import ChatSession, {ChatEventListener, Message, Page, Sender} from "../ChatSession";
import {ResponseHandler} from "../types";
import {listeners} from "cluster";

class MockChatSession implements ChatSession {

  private lastId: number = 0;
  private interval: number = 300;
  private intervalId: any;
  private messages: Message[];

  private messagesAddingListeners: ChatEventListener[] = [];
  private messagesDeletionListeners: ChatEventListener[] = [];
  private messagesEditingListeners: ChatEventListener[] = [];

  constructor(interval?: number) {
    if (interval) {
      this.interval = interval;
    }

    this.intervalId = setInterval(() => {
      const messages: Message[] = [];
      for (let i = 1; i < 5; i++) {
        messages.push(this.mockMessage(this.lastId++, 1 % 5, this.time(20, i)));
        this.messagesAddingListeners.forEach(listener => listener(messages));
      }

    }, this.interval);

    this.messages = [
      this.mockMessage(this.lastId++, 1, this.time(20, 40)),
      this.mockMessage(this.lastId++, 1, this.time(20, 40)),
      this.mockMessage(this.lastId++, 1, this.time(20, 45)),
      this.mockMessage(this.lastId++, 1, this.time(20, 45)),
      this.mockMessage(this.lastId++, 2, this.time(20, 55))
    ]
  }

  close(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  time(hour: number, minute: number) : Date {
    return new Date(2019, 11, 12, hour, minute);
  }

  mockMessage(number?: number, senderId?: number, date?: Date, content?: string) : Message {
    return {
      id: number ? number : 0,
      sender: {
        firstName: "User",
        lastName: "Mock",
        id: senderId ? senderId : 0,
        username: "mock_user"
      },
      content: content ? content : "mock long chat message",
      dateCreated: date ? date : new Date(),
      images: []
    };
  }

  loadAllMessages(handler: ResponseHandler<Message[]>) : void {
    handler({
      status: 200, headers: { },
      data: this.messages
    });
  }

  editMessage(message: Message): void {
    setTimeout(() => {
      this.messagesEditingListeners.forEach(listener => listener([message]));
    }, 500);
  }

  sendMessage(messageContent: string, onSuccess: (message: Message) => void): void {
    const message = this.mockMessage(this.lastId++, 1, this.time(20, 55), messageContent);
    onSuccess(message);
  }

  deleteMessage(message: Message): void {
    setTimeout(() => {
      this.messagesDeletionListeners.forEach(listener => listener([message]));
    }, 500);
  }

  addMessagesAddingListener(listener: (messages: Message[]) => void): void {
    this.messagesAddingListeners.push(listener);
  }

  addMessagesDeletionListener(listener: (messages: Message[]) => void): void {
    this.messagesDeletionListeners.push(listener);
  }

  addMessagesEditingListener(listener: (messages: Message[]) => void): void {
    this.messagesEditingListeners.push(listener);
  }

  sendMessageWithAttachment(message: string, attachment: File, onSuccess: (message: Message) => void): void {
    this.sendMessage(message, () => { });
  }

}

export default class MockChatService implements ChatService {

  constructor(private interval: number) {
  }

  connect(chatId: string): ChatSession {
    return new MockChatSession(this.interval);
  }

}