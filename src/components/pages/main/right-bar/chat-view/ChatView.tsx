import ChatService from "../../../../../services/ChatService";
import React from "react";
import ChatSession, {Message, Sender} from "../../../../../services/ChatSession";
import GroupService from "../../../../../services/GroupService";
import Header from "./header/Header";
import "./ChatView.scss"
import {Dropdown, UserInitialsAvatar} from "../../../../widgets/Widgets";
import ModalLink from "../../modals/ModalLink";
import MessageInput from "./input/MessageInput";

export default class ChatView extends React.Component<Props, State> {

  chatSession?: ChatSession;

  state = {
    messages: ([] as Message[]),
    mode: Mode.NONE,
    messageInput: ""
  };

  componentDidMount(): void {
    this.chatSession = this.props.chatService.connect(this.props.chatId);
    this.chatSession.addListener(response => {
      this.setState(state => ({
        ...state, messages: response.data
      }));
    });
    // this.chatSession.loadAllMessages(response => {
    //   this.setState(state => ({
    //     ...state, messages: [...state.messages, ...response.data]
    //   }))
    // })
  }

  componentWillUnmount(): void {
    if (this.chatSession) {
      this.chatSession.close();
    }
  }

  render() {
    const { messageInput } = this.state;
    return (
      <div className="Chat-view">
        <Header groupService={this.props.groupService} groupId={this.props.chatId}/>
        <div className="body">
          <div className="messages">
            {this.mergeMessages(this.state.messages).map(messageGroup => {
              return (
                <this.MessageView
                  key={`Message-group-${messageGroup.messages[0].id}`}
                  messageGroup={messageGroup}
                />
              )
            })}
          </div>
        </div>
        <div className="message-input-container">
          <div className="container">
            <div className="row">
              <div className="col-2">

              </div>
              <div className="col-8">
                <MessageInput
                  value={messageInput}
                  onEnter={this.onMessageEnter}
                  onChange={this.updateMessageInput}
                  placeholder="Write a message"
                />
              </div>
              <div className="col-2">
                <i
                  className="fas fa-angle-double-right send-message-icon"
                  onClick={this.onMessageEnter}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  updateMessageInput = (value: string) => {
    this.setState(state => ({
      ...state, messageInput: value
    }));
  };

  onMessageEnter = () => {
    if (this.state.messageInput.length === 0) {
      return;
    }

    const mode = this.state.mode;
    const message = this.state.messageInput;
    this.setState(state => ({
      ...state, messageInput: ""
    }), () => {
      if (mode === Mode.NONE) {
        this.chatSession && this.chatSession.sendMessage(message, (message) => {
          this.setState(state => ({
            ...state, messages: [...state.messages, message]
          }));
        });
      }
    });
  };

  MessageView = ({messageGroup}: { messageGroup: MessageGroup }) => {
    return (
      <div className="Message-group-view">
        <div className="row">
          <div className="col-1">
            <UserInitialsAvatar profile={{
              first_name: messageGroup.sender.username,
              last_name: messageGroup.sender.lastName,
              username: messageGroup.sender.firstName,
              about: ""
            }}/>
          </div>
          <div className="col-11">
            <div className="row">
              <div className="col-10 message-sender">
                <ModalLink
                  modalName="userProfile"
                  relativePath={`${messageGroup.sender.id}`}
                  className="a-none"
                >
                  {this.displaySenderName(messageGroup.sender)}
                </ModalLink>
              </div>
              <div className="col-2 text-right">
                {`${messageGroup.date.getHours()}:${messageGroup.date.getMinutes()}`}
              </div>
            </div>
            <div className="message-contents">
              {messageGroup.messages.map(message => (
                <div key={`message-${message.id}`} className="row mt-1 message">
                  <div className="col-10">
                    {message.content}
                  </div>
                  <div className="col-2 text-right message-dropdown">
                    <Dropdown
                      toggle={<i className="fas fa-ellipsis-h message-actions"/>}
                      options={["Edit", "Remove"]}
                      onSelect={action => this.handleMessageActionSelected(message, action)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  handleMessageActionSelected = (message: Message, action: string) => {
    switch (action) {
      case "Remove":
        this.deleteMessage(message);
        break;
    }
  };

  deleteMessage = (message: Message) => {
    this.setState(state => ({
      ...state, messages: this.removeMessage(message, state.messages)
    }), () => {
      this.chatSession && this.chatSession.deleteMessage(message);
    });
  };

  removeMessage(message: Message, messages: Message[]) : Message[] {
    const index = messages.findIndex(m => m.id === message.id);
    if (index === -1) {
      return messages;
    }
    messages = messages.slice(0);
    messages.splice(index, 1);
    return messages;
  };

  displaySenderName = (sender: Sender) => {
    if (sender.firstName) {
      if (sender.lastName) {
        return `${sender.firstName} ${sender.lastName}`;
      }
      return sender.firstName;
    }
    return sender.username;
  };

  mergeMessages = (messages: Message[]) => {
    const groups: MessageGroup[] = [];

    if (messages.length === 0) {
      return groups;
    }

    groups.push(this.messageGroup(messages[0]));

    for (let i = 1; i < messages.length; i++) {
      let currentGroup = groups[groups.length - 1];
      let currentMessage = messages[i];

      if (this.canMerge(currentGroup, currentMessage)) {
        currentGroup.messages.push(currentMessage);
      } else {
        groups.push(this.messageGroup(currentMessage));
      }
    }

    return groups;
  };

  canMerge(group: MessageGroup, lastMessage: Message): boolean {
    if (group.sender.id !== lastMessage.sender.id) {
      return false;
    }
    if (group.messages.length === 5) {
      return false;
    }

    const firstMessage = group.messages[0];
    const acceptableTimeDifference = 60 * 1000;
    const difference = lastMessage.dateCreated.getTime() - firstMessage.dateCreated.getTime();

    return difference <= acceptableTimeDifference;
  }

  messageGroup(firstMessage: Message) : MessageGroup {
    return {
      messages: [firstMessage],
      date: firstMessage.dateCreated,
      sender: firstMessage.sender
    };
  }

}

type MessageGroup = {
  messages: Message[],
  sender: Sender,
  date: Date
}

type Props = {
  chatService: ChatService,
  groupService: GroupService,
  chatId: string
}

type State = {
  messages: Message[],
  mode: Mode,
  messageInput: string
}

enum Mode {
  EDIT, NONE
}
