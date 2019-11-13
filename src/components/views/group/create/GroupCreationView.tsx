import {
  GroupCreationData
} from "../../../../services/GroupService";
import React from "react";
import SubmitButton from "../../../widgets/SubmitButton";
import {GroupInitialsAvatar, Spinner} from "../../../widgets/Widgets";
import Input from "../common/Input";
import {ConstraintViolation, ResponseHandler} from "../../../../services/types";
import {Response} from "../../../../services/types";
import "./GroupCreationView.scss";
import "bootstrap/dist/css/bootstrap.css";
import {findConstraintViolation} from "../../../../services/utils";
import ErrorMessage from "../../../pages/auth/components/common/ErrorMessage";

type Props = {
  onSubmit: (
    data: GroupCreationData,
    onSuccess: ResponseHandler,
    onFailure: ResponseHandler
  ) => void
}

type State = {
  data: GroupCreationData,
  violations: ConstraintViolation[]
}

export default class GroupCreationView extends React.Component<Props, State> {

  state = {
    data: {
      name: "",
      description: ""
    },
    loading: false,
    violations: []
  };

  render() {
    const { data } = this.state;
    return (
      <div className="Group-creation-view">
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
              {this.renderViolationIfPresent("name")}
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="input-label">Description</div>
            </div>
            <div className="col-12">
              <Input value={data.description} onChange={this.updateDescription}/>
            </div>
            {this.renderViolationIfPresent("description")}
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

  handleSubmitFail = (response: Response<ConstraintViolation[]>) => {
    this.setState(state => ({
      ...state,
      loading: false,
      violations: response.data
    }));
  };

  handleSubmitSuccess = () => {
    this.setState(state => ({
      ...state,
      loading: false,
      violations: []
    }));
  };

  renderViolationIfPresent(property: string) {
    let violation = findConstraintViolation(property, this.state.violations);
    if (violation) {
      return <ErrorMessage message={violation.message}/>
    }
  }

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