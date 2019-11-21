import ChatService from "../../../../../services/ChatService";
import React from "react";
import ChatSession, {Message} from "../../../../../services/ChatSession";
import GroupService from "../../../../../services/GroupService";
import Header from "./header/Header";
import "./ChatView.scss"
import {Spinner} from "../../../../widgets/Widgets";
import MessageInput from "./input/MessageInput";
import { Response } from "../../../../../services/types";
import MessageGroupView, {mergeMessages} from "../message-group/MessageGroupView";
import UserService from "../../../../../services/UserService";

export default class ChatView extends React.Component<Props, State> {

  chatSession?: ChatSession;

  state = {
    messages: ([] as Message[]),
    mode: Mode.WRITE_NEW,
    messageInput: "",
    loading: true,
    selectedMessage: undefined
  };

  componentDidMount(): void {
    if (!this.chatSession) {
      this.connectToChat();
    }
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    if (prevProps.chatId !== this.props.chatId) {
      this.reloadSession();
    }
  }

  reloadSession() {
    if (this.chatSession) {
      this.chatSession.close();
      this.connectToChat();
    }
  }

  chatSessionListener(chatId: string) {

    return (response: Response<Message[]>) => {
      if (chatId !== this.props.chatId) {
        return;
      }

      this.setState(state => ({
        ...state, messages: response.data, loading: false
      }));
    }
  }

  connectToChat() {
    this.chatSession = this.props.chatService.connect(this.props.chatId);
    this.setState(state => ({
      ...state, loading: true
    }), () => {
      this.chatSession && this.chatSession.addListener(this.chatSessionListener(this.props.chatId));
    });
  }

  componentWillUnmount(): void {
    if (this.chatSession) {
      this.chatSession.close();
    }
  }

  render() {
    const { loading, messageInput, mode } = this.state;
    if (loading) {
      return (
        <div className="Chat-view">
          <div className="d-flex flex-column align-items-center">
            <Spinner/>
          </div>
        </div>
      );
    }

    return (
      <div className="Chat-view">
        <Header groupService={this.props.groupService} groupId={this.props.chatId}/>
        <div className="body">
          {mode === Mode.EDIT
            ? <div className="overlay"/>
            : null
          }
          <div className="messages">
            {mergeMessages(this.state.messages).map(messageGroup => {
              return (
                <MessageGroupView
                  key={`Message-group-${messageGroup.messages[0].id}`}
                  messageGroup={messageGroup}
                  onActionSelected={this.handleMessageActionSelected}
                  currentUser={this.props.userService.getCurrentUser()}
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
                {mode === Mode.EDIT
                  ? this.renderUndoEditButton()
                  : null
                }
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

  renderUndoEditButton = () => {
    return (
      <div className="undo-edit-button-container">
        <div className="undo-edit-button" onClick={this.undoEditMessage}>
          Editing <i className="fas fa-times"/>
        </div>
      </div>
    )
  };

  undoEditMessage = () => {
    this.setState(state => ({
      ...state, messageInput: "", mode: Mode.WRITE_NEW, selectedMessage: undefined
    }));
  };

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
      if (mode === Mode.WRITE_NEW) {
        this.sendNewMessage(message);
      } else if (mode === Mode.EDIT) {
        this.sendEditedMessage(message);
      }
    });
  };

  sendEditedMessage = (message: string) => {
    const selectedMessage = this.state.selectedMessage as Message|undefined;
    if (selectedMessage) {
      selectedMessage.content = message;
      this.chatSession && this.chatSession.editMessage(selectedMessage);
      this.setState(state => ({
        ...state, mode: Mode.WRITE_NEW, selectedMessage: undefined
      }));
    }
  };

  sendNewMessage = (message: string) => {
    this.chatSession && this.chatSession.sendMessage(message, (message) => {
      this.setState(state => ({
        ...state, messages: [...state.messages, message]
      }));
    });
  };

  handleMessageActionSelected = (action: string, message: Message) => {
    switch (action) {
      case "Remove":
        this.deleteMessage(message);
        break;
      case "Edit":
        this.editMessage(message);
        break;
    }
  };

  editMessage = (message: Message) => {
    this.setState(state => ({
      ...state,
      messageInput: message.content,
      mode: Mode.EDIT,
      selectedMessage: message
    }));
  };

  deleteMessage = (message: Message) => {
    this.setState(state => ({
      ...state,
      messages: this.removeMessage(message, state.messages)
    }), () => {
      this.chatSession && this.chatSession.deleteMessage(message, () => { });
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

}

type Props = {
  chatService: ChatService,
  groupService: GroupService,
  userService: UserService,
  chatId: string
}

type State = {
  messages: Message[],
  mode: Mode,
  messageInput: string,
  selectedMessage: Message|undefined
}

enum Mode {
  EDIT, WRITE_NEW
}
