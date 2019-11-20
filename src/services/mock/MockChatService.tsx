import ChatService from "../ChatService";
import ChatSession, {Message, Page, Sender} from "../ChatSession";
import {ResponseHandler} from "../types";

class MockChatSession implements ChatSession {

  private listeners: ResponseHandler<Message[]>[] = [];
  private interval: number = 300;
  private intervalId: any;
  private messages: Message[];

  constructor(interval?: number) {
    if (interval) {
      this.interval = interval;
    }
    // this.intervalId = setInterval(() => {
    //   this.listeners.forEach(listener => {
    //     listener({
    //       status: 200, headers: { },
    //       data: [ this.mockMessage(), this.mockMessage(), this.mockMessage(), this.mockMessage() ]
    //     })
    //   });
    // }, this.interval)

    this.messages = [
      this.mockMessage(1, 1, this.time(20, 40)),
      this.mockMessage(2, 1, this.time(20, 40)),
      this.mockMessage(3, 1, this.time(20, 45)),
      this.mockMessage(4, 1, this.time(20, 45)),
      this.mockMessage(5, 2, this.time(20, 55))
    ]
  }

  addListener(listener: ResponseHandler<Message[]>): void {
    this.listeners.push(listener);
  }

  close(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  loadMessagesPage(page: number, handler: ResponseHandler<Page<Message>>): void {
    handler({
      status: 200,
      headers: { },
      data: {
        size: 5,
        next: null,
        previous: null,
        content: this.messages
      }
    })
  }

  time(hour: number, minute: number) : Date {
    return new Date(2019, 11, 12, hour, minute);
  }

  mockMessage(number?: number, senderId?: number, date?: Date) : Message {
    return {
      id: number ? number : 0,
      sender: {
        firstName: "User",
        lastName: "Mock",
        id: senderId ? senderId : 0,
        username: "mock_user"
      },
      content: "mock long chat message",
      dateCreated: date ? date : new Date()
    }
  }

  loadAllMessages(handler: ResponseHandler<Message[]>) : void {
    handler({
      status: 200, headers: { },
      data: this.messages
    })
  }

  editMessage(message: Message): void {

  }

  sendMessage(message: Message): void {
    this.messages.push(message);
  }

}

export default class MockChatService implements ChatService {

  constructor(private interval: number) {
  }

  connect(chatId: string): ChatSession {
    return new MockChatSession(this.interval);
  }

}