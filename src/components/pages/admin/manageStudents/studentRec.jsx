import React, { Component } from 'react';
import { withRouter } from "react-router";
import { Alert, Card, CardBody, Col, CustomInput, Form, FormGroup, Input, Label, Row, Button } from 'reactstrap';
import { AvForm, AvField, AvGroup, AvInput, AvFeedback, AvRadioGroup, AvRadio, AvCheckboxGroup, AvCheckbox } from 'availity-reactstrap-validation';
import { toast } from 'react-toastify';
import FalconCardHeader from '../../../common/FalconCardHeader'
import { get, postWithHeaders, patch } from '../../../../server/actions';
import Student from './student'
class StudentRec extends Component {
    constructor(props){
        super(props);
        this.state={
            studentsList:[]
        }
    }
    componentDidMount=()=>{
        let _students=[...this.state.studentsList];
        if(_students.length===0){
            _students.push({});
        }
        this.setState({studentsList:_students})
    }
    onValidSubmit = (event, values) => {
        alert('valid')
      };
      onInvalidSubmit = (event, errors, values) => {
          alert('invalid')
      };
    render() {
        const {id}=this.props
        return (<>
        <Card className="mb-3">
            <FalconCardHeader title={id<=0?'New School':'Edit School'}>                
            </FalconCardHeader>
            <CardBody>
            <button onClick={()=>{
                    let _students=[...this.state.studentsList];
                        _students.push({});
                    this.setState({studentsList:_students})
                }}>Add</button>
                <AvForm onValidSubmit={this.onValidSubmit} onInvalidSubmit={this.onInvalidSubmit}>
                    {
                        this.state.studentsList.map((student,i)=>{
                            return <> <Student fid={i} /><button onClick={()=>{
                                let _students=[...this.state.studentsList];
                                    _students.splice(i,1);
                                this.setState({studentsList:_students})

                            }}>X</button> </>
                        })
                    }
                    <Button>Submit</Button>

                </AvForm>

            </CardBody>
        </Card>
        </>
        );
    }
}

export default withRouter(StudentRec);