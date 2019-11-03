import {
  GroupCreationData
} from "../../../../services/GroupService";
import React from "react";
import SubmitButton from "../../../common/SubmitButton";
import {GroupInitialsAvatar, Spinner} from "../../../../widgets/Widgets";
import Input from "../../common/Input";
import {ResponseHandler} from "../../../../services/types";
require("bootstrap/dist/css/bootstrap.min.css");

type Props = {
  onSubmit: (
    data: GroupCreationData,
    onSuccess: ResponseHandler,
    onFailure: ResponseHandler
  ) => void
}

type State = {
  data: GroupCreationData
}

export default class GroupCreationForm extends React.Component<Props, State> {

  state = {
    data: {
      name: "",
      description: ""
    },
    loading: false
  };

  render() {
    const { data } = this.state;
    return (
      <div className="Group-creation-form">
        <div className="header">
          Create Group
        </div>
        <div className="body">
          <div className="row">
            <div className="col-3">
              <GroupInitialsAvatar groupData={data} />
            </div>
            <div className="col-9">
              <div>
                <div className="input-label">Name</div>
              </div>
              <div>
                <Input value={data.name} onChange={this.updateName}/>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="input-label">Description</div>
            </div>
            <div className="col-12">
              <Input value={data.description} onChange={this.updateDescription}/>
            </div>
          </div>
        </div>
        <div className="footer">
          <div className="row">
            <div className="col-12">
              {this.state.loading ? this.showSpinner() : this.showSubmitButton()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  showSubmitButton = () => (
    <div className="text-right">
      <SubmitButton onClick={this.handleSubmit} />
    </div>
  );

  showSpinner = () => (
    <div className="text-center"><Spinner /></div>
  );

  handleSubmit = () => {
    this.setState(state => ({
      ...state,
      loading: true
    }), () => {
      this.props.onSubmit(this.state.data, this.handleSubmitSuccess, this.handleSubmitFail);
    });
  };

  handleSubmitFail = () => {
    this.setState(state => ({
      ...state,
      loading: false
    }));
  };

  handleSubmitSuccess = () => {
    this.setState(state => ({
      ...state,
      loading: false
    }));
  };

  updateName = (name: string) => {
    this.setState(state => ({
      ...state,
      data: {
        ...state.data,
        name: name
      }
    }));
  };

  updateDescription = (description: string) => {
    this.setState(state => ({
      ...state,
      data: {
        ...state.data,
        description: description
      }
    }));
  }
}