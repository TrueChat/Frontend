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
import AttachmentControl from "./attachment/AttachmentControl";

export default class ChatView<P extends Props, S extends State> extends React.Component<P, S> {

  chatSession?: ChatSession;

  body = React.createRef<HTMLDivElement>();

  constructor(props: P) {
    super(props);

    //@ts-ignore
    this.state = {
      messages: ([] as Message[]),
      mode: Mode.WRITE_NEW,
      messageInput: "",
      loading: true,
      selectedMessage: undefined,
      attachments: [] as Attachment[],
      displayEmptyCaptionWarning: false
    }
  }

  /*
   * All code responsible for connecting lies in
   * componentDidMount and componentDidUpdate componentWillUnmount
   */
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

  componentWillUnmount(): void {
    if (this.chatSession) {
      this.chatSession.close();
    }
  }

  reloadSession() {
    if (this.chatSession) {
      this.chatSession.close();
      this.connectToChat();
    }
  }

  chatMessagesAddingListener(chatId: string) {

    return (messagesAdded: Message[]) => {
      if (chatId !== this.props.chatId) {
        return;
      }

      this.setState(state => ({
        ...state, messages: [...state.messages, ...messagesAdded]
      }));
    }
  }

  private chatMessagesDeletionListener(chatId: string) {
    return (messagesDeleted: Message[]) => {
      if (chatId !== this.props.chatId) {
        return;
      }

      this.setState(state => {
        const messages = state.messages.slice(0);
        this.removeMessages(messages, messagesDeleted);
        return {
          ...state, messages: messages
        }
      })
    }
  }

  private chatMessagesEditingListener(chatId: string) {
    return (messagesEdited: Message[]) => {
      if (chatId !== this.props.chatId) {
        return;
      }

      this.setState(state => {
        const messages = state.messages.slice(0);
        for (let messageEdited of messagesEdited) {
          let i = messages.findIndex(message => message.id === messageEdited.id);
          if (i !== -1) {
            messages.splice(i, 1, messageEdited);
          }
        }
        return {
          ...state, messages: messages
        }
      })
    }
  }

  private removeMessages(targetArray: Message[], messagesToRemove: Message[]) {
    for (let messageToRemove of messagesToRemove) {
      let i = targetArray.findIndex(message => message.id === messageToRemove.id);
      if (i !== - 1) {
        targetArray.splice(i, 1);
      }
    }
  }

  private allMessagesLoadingHandler = (chatId: string) => {

    return (response: Response<Message[]>) => {
      if (chatId !== this.props.chatId) {
        return;
      }

      this.setState(state => ({
        ...state, messages: [...response.data, ...state.messages], loading: false
      }), () => {
        if (this.body.current) {
          this.body.current.scrollTo({
            top: this.body.current.scrollHeight
          })
        }
      });
    }
  };

  private connectToChat() {
    this.chatSession = this.props.chatService.connect(this.props.chatId);
    this.setState(state => ({
      ...state, messages: [], loading: true, attachments: []
    }), () => {
      if (this.chatSession) {
        const chatId = this.props.chatId;
        const chatSession = this.chatSession;

        chatSession.loadAllMessages(this.allMessagesLoadingHandler(chatId));
        chatSession.addMessagesAddingListener(this.chatMessagesAddingListener(chatId));
        chatSession.addMessagesDeletionListener(this.chatMessagesDeletionListener(chatId));
        chatSession.addMessagesEditingListener(this.chatMessagesEditingListener(chatId));
      }
    });
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
        <Header
          groupService={this.props.groupService}
          userService={this.props.userService}
          groupId={this.props.chatId}
        />
        {mode === Mode.SEND_IMAGE
          ? this.sendImageOverlay()
          : null
        }
        <div className="body" ref={this.body}>
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
        {this.messageInputContainer()}
      </div>
    );
  }

  messageInputContainer() {
    const { loading, messageInput, mode } = this.state;

    return (
      <div className="message-input-container">
        <div className="container">
          <div className="row">
            <div className="col-2 text-right">
              <AttachmentControl onSelect={this.addAttachment}/>
            </div>
            <div className="col-8">
              {mode === Mode.EDIT
                ? this.renderUndoEditButton()
                : null
              }
              <div>
                <MessageInput
                  value={messageInput}
                  onEnter={this.onMessageEnter}
                  onChange={this.updateMessageInput}
                  placeholder="Write a message"
                />
              </div>
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
    )
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
    this.chatSession && this.chatSession.sendMessage(message, () => { });
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

  addAttachment = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      this.setState(state => ({
        ...state,
        mode: Mode.SEND_IMAGE,
        attachments: [...state.attachments, { file: file, image: reader.result }]
      }));
    }
  };

  sendImageOverlay() {
    const { attachments, messageInput, displayEmptyCaptionWarning } = this.state;
    return (
      <div className="send-image-overlay" onClick={(e) => {
        this.setState({mode: Mode.WRITE_NEW, attachments: []});
      }}>
        <div className="send-image-dialog" onClick={e => {
          e.stopPropagation();
        }}>
          <div className="header font-weight-bold mb-2">
            Send an image
          </div>
          <div className="image">
            <img src={attachments[0].image} width="100%" />
          </div>
          <div className="caption mt-3">
            <div className="caption-text mb-2">Caption</div>
            {displayEmptyCaptionWarning &&
              <div className="text-warning">caption may not be blank</div>
            }
            <div className="row">
              <div className="col-10">
                <div>
                  <MessageInput
                    value={messageInput}
                    onEnter={this.sendMessageWithImage}
                    onChange={this.updateMessageInput}
                    placeholder="Write a message"
                  />
                </div>
              </div>
              <div className="col-2">
                <i
                  className="fas fa-angle-double-right send-message-icon"
                  onClick={this.sendMessageWithImage}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  sendMessageWithImage = () => {
    const { messageInput, attachments } = this.state;
    if (messageInput.length === 0) {
      this.setState({ displayEmptyCaptionWarning: true });
      return;
    }
    this.setState({mode: Mode.WRITE_NEW, messageInput: "", attachments: [], displayEmptyCaptionWarning: false}, () => {
      this.chatSession && this.chatSession
        .sendMessageWithAttachment(messageInput, attachments[0].file, () => { })
    });
  }
}

export interface Attachment {
  file: File,
  image: string
}

export interface Props {
  chatService: ChatService,
  groupService: GroupService,
  userService: UserService,
  chatId: string
}

export interface State {
  messages: Message[],
  mode: Mode,
  loading: boolean,
  messageInput: string,
  displayEmptyCaptionWarning: boolean,
  selectedMessage: Message|undefined,
  attachments: Attachment[]
}

enum Mode {
  EDIT, WRITE_NEW, SEND_IMAGE
}
