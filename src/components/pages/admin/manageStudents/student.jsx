import React, { Component } from 'react';
import { AvForm, AvField, AvGroup, AvInput, AvFeedback, AvRadioGroup, AvRadio, AvCheckboxGroup, AvCheckbox } from 'availity-reactstrap-validation';
import { Button, Label, FormGroup, CustomInput, Row,Col } from 'reactstrap';
const EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
class Student extends Component {
    render() {
        return (
          <>
          <Row>
              <Col><AvField name={"fName_"+this.props.fid} label="First Name" errorMessage="Please enter first name" required /></Col>
              <Col><AvField name={"lName_"+this.props.fid} label="Last Name" errorMessage="Please enter last name" required /></Col>
              <Col><AvField name={"sId_"+this.props.fid} label="Student Id" errorMessage="Please enter student id" required /></Col>
              <Col>
                <AvField type="select" name={"grade_"+this.props.fid} label="Grade" errorMessage="Please select grade" required>
                    <option></option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                </AvField>
            </Col>
          </Row>
          <Row>
              <Col><AvField type="email" name={"pEmail_"+this.props.fid} label="Parent Email" 
              validate={{
                required: {value: true, errorMessage: 'Please enter parent email id'},
                pattern: {value: EMAIL_REGEXP, errorMessage: 'Invalid parent email id'}
              }} /></Col>
              <Col><AvField type="email" name={"aEmail_"+this.props.fid} label="Alt. Email"
              validate={{
                pattern: {value: EMAIL_REGEXP, errorMessage: 'Invalid alt. email id'},
              }}
              /></Col>
              <Col><AvField name={"mobile_"+this.props.fid} label="Mobile" errorMessage="Please enter mobile" required /></Col>
              <Col> 
            </Col>
          </Row>
          <Row>
              <Col>
                    <AvField name={"street_"+this.props.fid} label="Street, Apt." />
              </Col>
              <Col>
                    <AvField name={"city_"+this.props.fid} label="City, State, Zip." />
              </Col>
          
          </Row>
                        
          </>
        );
      }
    }

export default Student;