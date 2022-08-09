import React from "react"
import Section from '../components/common/Section';
import { Col, Row, Card, CardBody, FormGroup, Input, Label, Button } from 'reactstrap';
import Logo from '../components/navbar/Logo';
import { Link } from "react-router-dom";
import useDeviceRegister from "../hooks/useDeviceRegister";

const ParentDeviceRegister = ()=>{
    const {
        sendOTP,
        onChangeHandler,
        stateData,
        showRequestForm,
        onValidateOTP
    }  = useDeviceRegister()

    return (
        <Section className="py-0">
        <Row className="flex-center min-vh-75 py-6"> 
        <Col sm={12} md={12} lg={12} xl={12}><Logo /></Col>            
        <Col sm={10} md={7} lg={5} xl={4} className="col-xxl-4">                
            <Card>
            <CardBody className="fs--1 font-weight-normal p-5">
                { showRequestForm ? 

                <Row className="text-left justify-content-between">
                    <Col xs="auto">
                    <h4 className="pb-2">Send Verification Code</h4>
                    </Col>
                    <Col
                        sm={{
                            size: 12
                        }}
                        >
                        <FormGroup check>
                            <Input
                            id="email"
                            type="checkbox"
                            checked = {stateData.isEmailChecked}
                            onChange={(e)=>{onChangeHandler(e,"isEmailChecked")}}
                            />
                            {' '}
                            <Label check for="email">
                            <h5 className="pb-2">Email</h5>
                            </Label>
                        </FormGroup>
                        </Col>
                        <Col
                        sm={{
                            size: 12
                        }}
                        >
                        <FormGroup check>
                            <Input
                            id="mobile"
                            type="checkbox"
                            checked = {stateData.isMobileChecked}
                            onChange={(e)=>{onChangeHandler(e,"isMobileChecked")}}
                            />
                            {' '}
                            <Label check for="mobile">
                            <h5 className="pb-2">Mobile</h5>
                            </Label>
                        </FormGroup>
                        </Col>
                        <FormGroup>
                        <Button color="primary" block className="mt-3 ml-3"  
                        onClick={sendOTP}
                        disabled={!(stateData.isEmailChecked || stateData.isMobileChecked) }
                        >
                            Request Code
                        </Button>
                        </FormGroup>
                </Row>
                :
                <Row className="text-left justify-content-between">
                    <Col xs="auto">
                    <h4 className="pb-2">Enter Verification Code</h4>
                    </Col>
                    <Col
                        sm={{
                            size: 12
                        }}
                        >
                        <FormGroup >
                            
                            <Input
                            id="email"
                            type="text"
                            placeholder="Enter Verification Code"
                            value = {stateData.otp}
                            onChange={(e)=>{onChangeHandler(e,"otp")}}
                            />
                            
                        </FormGroup>
                        </Col>
                        <FormGroup >
                        <Col xs="auto">
                            <Link className="fs--1" onClick={sendOTP}> 
                            Resend Code
                            </Link>
                        </Col>
                        </FormGroup>
                        <FormGroup>
                        <Button color="primary"  className="mt-3 mr-3"  
                        onClick={onValidateOTP}
                        >
                            Validate
                        </Button>
                        </FormGroup>
                </Row>
            }
                                    
            </CardBody>
            </Card>                                
        </Col>

        
        </Row>
    </Section>
    )

}

export default ParentDeviceRegister