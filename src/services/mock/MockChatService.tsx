import ChatService from "../ChatService";
import ChatSession, {Message, Page} from "../ChatSession";
import {ResponseHandler} from "../types";

class MockChatSession implements ChatSession {

  private listeners: ResponseHandler<Message[]>[] = [];
  private interval: number = 300;
  private intervalId: any;

  constructor(interval?: number) {
    if (interval) {
      this.interval = interval;
    }
    this.intervalId = setInterval(() => {
      this.listeners.forEach(listener => {
        listener({
          status: 200, headers: { },
          data: [ this.mockMessage(), this.mockMessage(), this.mockMessage(), this.mockMessage() ]
        })
      });
    }, this.interval)
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
        content: [
          this.mockMessage(1),
          this.mockMessage(2),
          this.mockMessage(3),
          this.mockMessage(4),
          this.mockMessage()
        ]
      }
    })
  }

  mockMessage(number?: number) : Message {
    return {
      sender: {
        firstName: "User",
        lastName: "Mock",
        id: 1,
        username: "mock_user"
      },
      content: "mock message" + number,
      dateCreated: new Date()
    }
  }

  loadAllMessages(handler: ResponseHandler<Message[]>) : void {
    handler({
      status: 200, headers: { },
      data: [ this.mockMessage(1), this.mockMessage(2), this.mockMessage(3), this.mockMessage() ]
    })
  }

}

export default class MockChatService implements ChatService {

  constructor(private interval: number) {
  }

  connect(chatId: string): ChatSession {
    return new MockChatSession(this.interval);
  }

}