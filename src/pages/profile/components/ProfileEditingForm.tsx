import React from "react";
import FormInput from "./form-inputs/FormInput";
import "./ProfileEditingForm.scss";
import SubmitButton from "../../common/SubmitButton";
require("bootstrap/dist/css/bootstrap.css");

export default class ProfileEditingForm extends React.Component {

  render() {
    return (
      <div className="Profile-editing-form">
        <div className="header">
          Your Profile
        </div>
        <div className="row info-row align-baseline">
          <div className="col-3">
            <div className="user-image-container">
              <i className="user-image" />
            </div>
          </div>
          <div className="col-9">
            <FormInput value={"Name Surname"} onChange={() => {}}/>
          </div>
        </div>
        <div className="row info-row">
          <div className="col-12">
            <div className="row-title">Username</div>
            <div>
              <FormInput onChange={() => {}} value={"Username"} />
            </div>
          </div>
        </div>
        <div className="row info-row">
          <div className="col-12">
            <div className="row-title">Bio</div>
            <div>
              <FormInput onChange={() => {}} value={"Bio"} />
            </div>
          </div>
        </div>
        <div className="row submit-container text-right">
          <SubmitButton onClick={() => {}}/>
        </div>
      </div>
    )
  }
}