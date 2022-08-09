import React, { Component } from 'react';
import { Col, Row, Card, CardBody, Form, FormGroup, Input, Label, CustomInput, Button } from 'reactstrap';
import Cookies from 'universal-cookie'
import { toast } from 'react-toastify';
import { withRouter } from "react-router";
import { Link  } from 'react-router-dom';
import moment from 'moment';
import Section from '../components/common/Section';
import Logo from '../components/navbar/Logo';
import {get, getAccessToken} from "../server/actions";
import {domains, catererDomains,districtDomains} from "../server/constants";
let loggedUserInfo = {"access": {token: '12343'}, "user": {name: "vikas"}};
class Login extends Component {
  constructor(props) {
      super(props);
      //this.cookies = new Cookies();
      // this.Auth = new AuthService();
      this.state = {
          userName: "",
          password: "",
          cookies: new Cookies(),
          isCookie: false,
          isSuperAdmin: false,
          parentEmail: '',
          parentRegMsg: '',
          isParentError: false
      }
      this.isSuperAdmin = this.isSuperAdmin.bind(this);
      this.selfRegParent = this.selfRegParent.bind(this);
  }

  componentDidMount() {
      if (this.state.cookies.get('userName')) {
          this.setState({userName: this.state.cookies.get('userName')});
      }
      this.isSuperAdmin();
  }

  handleUserNameChanged(event) {
      this.setState({userName: event.target.value});
  }

  handlePasswordChanged(event) {
      this.setState({password: event.target.value});
  }

  handleParentEmailChanged(event) {
      this.setState({parentEmail: event.target.value});
  }

  setCookie(event) {
      const target = event.target;
      const value = target.checked;
      if (value) {
          this.state.cookies.set('userName', this.state.userName, {path: '/', maxAge: 31536000});
      }
  }

  isSuperAdmin() {
      let url = window.location.href;
      domains.forEach(domain => {
          url = url.replace(domain, '');
      })
      let splitArray = url.split('.');
      if (splitArray.length === 1) {//Super Admin or parent
          this.setState({isSuperAdmin: true});
      }
      else {
          this.setState({isSuperAdmin: false});
      }
  }

  selfRegParent(event) {
      event.preventDefault();
      get('/selfRegParent?emailId=' + this.state.parentEmail, false).then((response) => {
          if (!response.ok) {
              throw Error(response.statusText);
          }
          console.log('response', response);
          return response.json();
      }).then(data => {
      }).catch(
          (error) => {
          }
      );
      this.setState({parentRegMsg: 'Request submitted successfully. If your email id is registered, you will receive an access link soon.'});
      this.setState({isParentError: false});
      event.preventDefault();
  }

  onSignInClick=(event)=> {
      let uname=this.state.userName;
      getAccessToken(this.state.userName, this.state.password).then((response) => {
          if (!response.ok) {
              throw Error(response.statusText);
          }
          return response.json();
      }).then(data => {
          sessionStorage.setItem('access_token', data.access_token)
          sessionStorage.setItem('refresh_token', data.refresh_token)
          sessionStorage.setItem('expires_in', (data.expires_in) * 1000 + 1)
          loggedUserInfo.access = data;
          console.log('access login', loggedUserInfo);
          console.log('access_token', data.access_token);
          console.log("Validating Domain");
          let url = window.location.href;
          domains.forEach(domain => {
              url = url.replace(domain, '');
          });
          catererDomains.forEach(cdomain=>{
              url = url.replace(cdomain, '');
          })
          districtDomains.forEach(ddomain=>{
              url = url.replace(ddomain, '');
          })
          let splitArray = url.split('.');
          console.log(splitArray);
          if (splitArray.length === 1) {//Super Admin or parent
              if (splitArray[0]) {
                  sessionStorage.setItem('isSAdmin', 'true');
                  sessionStorage.setItem('isAdmin', 'false');                    
                  get(`/login/${0}?currentDate=${moment().format('YYYY-MM-DD')}&access_token=`).then((response) => {
                      if (!response.ok) {
                          throw Error(response.statusText);
                      }
                      console.log('response', response);
                      return response.json();
                  }).then(data => {
                      sessionStorage.setItem('loggedInUserDetails', JSON.stringify(data));
                      sessionStorage.setItem('loggedInUserInfo', data.username);
                      sessionStorage.setItem('ROLE', data.role);
                      loggedUserInfo.user = data;
                      if (data.role === "ROLE_SUPERADMIN") {
                          this.props.history.push('/SuperAdmin');
                      } else if (data.role === "ROLE_PARENT") {
                        this.props.history.push('/Parent');
                      }else if(data.role === "ROLE_CATERER"){
                          sessionStorage.setItem('catererId',data.catererId);
                          sessionStorage.setItem('countryCode', data.countryCode);
                          sessionStorage.setItem('pageSize', JSON.stringify(data.pageSize||{}));
                          const _schools={};
                          (data.schools||[]).map(school=>{
                              _schools[school.schoolId]=data.gradesMap;
                              return school
                          });
                          sessionStorage.setItem('gradesMap',JSON.stringify(_schools))
                          this.props.history.push('/caterer');
                      }else if(data.role === "ROLE_DISTRICT"){
                          sessionStorage.setItem('districtId',data.districtId);  
                          this.props.history.push('/district');
                      }
                  }).catch(
                      (error) => {
                        toast.error('Invalid User ID or password.');
                      })
              }
          }
          else if (splitArray.length === 2) {//School Admin

              get('/mealSchools/search/findBySubdomain?subdomain=' + splitArray[0] + '&access_token=').then((response) => {
                  if (!response.ok) {
                      throw Error(response.statusText);
                  }
                  console.log('response', response);
                  return response.json();
              }).then(data => {
                  console.log('schoolsubdomaindata', data);
                  let isPaymentEnable=data.isPaymentEnabled||false;
                  let pri_users=data.schoolUsers.filter(itm=>{
                    return itm.isPrimaryUser===true && (itm.username||'').toLowerCase()===(uname||'').toLowerCase()
                  })
                  let isPrimaryAdmin=(pri_users.length>0)===true?true:false;
                  let stripeAccountId=data.stripeAccountId;
                  let stripeAcceptance=data.stripeAcceptance;


                  if (data !== null || data !== '') {
                      let schoolId = data._links.self.href.split("/").pop();
                      get('/login/' + schoolId + '?currentDate='+moment().format('YYYY-MM-DD')+'&access_token=').then((response) => {
                          if (!response.ok) {
                              throw Error(response.statusText);
                          }
                          return response.json();
                      }).then(data => {
                          sessionStorage.setItem('SchoolId', schoolId);
                          sessionStorage.setItem('ROLE', data.role)
                          sessionStorage.setItem('loggedInUserInfo', JSON.stringify(data));
                          sessionStorage.setItem('loggedUserName', data.username); 
                          sessionStorage.setItem('loggedUserId', data.userId);
                          sessionStorage.setItem('currency_symbol', data.currencySymbol);
                          sessionStorage.setItem('date_format', data.dateFormat);
                          sessionStorage.setItem('countryCode', data.countryCode);
                          sessionStorage.setItem('pageSize', JSON.stringify(data.pageSize||{}));
                          sessionStorage.setItem('date_format', data.dateFormat);
                          sessionStorage.setItem('ISD_code', data.isdCode);
                          sessionStorage.setItem('phoneValidation',data.phoneValidation||10)
                          loggedUserInfo.user = data;
                          //let logInfo = JSON.parse(sessionStorage.getItem('loggedInUserInfo'));
                          //alert(logInfo["username"]);
                          if (data.role === "ROLE_ADMIN") {
                              let sessionUserInfoData=JSON.parse(sessionStorage.getItem('loggedInUserInfo'))
                              sessionUserInfoData.isPaymentEnable=isPaymentEnable;
                              sessionUserInfoData.isPrimaryAdmin=isPrimaryAdmin;
                              sessionUserInfoData.stripeAccountId=stripeAccountId;
                              sessionUserInfoData.stripeAcceptance=stripeAcceptance;
                              sessionStorage.setItem('loggedInUserInfo',JSON.stringify(sessionUserInfoData));
                              sessionStorage.setItem('schoolYearValue',data.schoolYear)
                              sessionStorage.setItem('activeMonth',data.latestActiveMonth)
                              this.props.history.push('/schoolAdmin');
                          }
                          else {
                            toast.error('Invalid User ID or password.');
                          }
                      }).catch(
                          (error) => {
                            toast.error('Invalid Sub Domain Please Check the URL.');
                          }
                      )

                  }
                  else {
                    this.props.history.push('/404');
                  }
              }).catch(
                  (error) => {
                    toast.error('Invalid Sub Domain Please Check the URL.');
                  }
              )

          } else {
            this.props.history.push('/404');

          }
      }).catch(
          (error) => {
            toast.error('Invalid UserId or Password.');
          }
      );
      event.preventDefault();
  }

  renderLogin=()=>{
    return <Form onSubmit={this.onSignInClick.bind(this)}>
    <FormGroup>
      <Label>Email</Label>
      <Input
        placeholder={'Email'}
        value={this.state.userName}
        onChange={this.handleUserNameChanged.bind(this)}
        type="email" required
      />
    </FormGroup>
    <FormGroup>
      <Label>Password</Label>
      <Input
        placeholder={'Password'}
        value={this.state.password}
        onChange={this.handlePasswordChanged.bind(this)}
        type="password" required
      />
    </FormGroup>
    <Row className="justify-content-between align-items-center">
      <Col xs="auto">
        <CustomInput
          id="customCheckRemember"
          label="Remember me"
          checked={this.isCookie || this.state.isCookie}
          onChange={this.setCookie.bind(this)}
          type="checkbox"
        />
      </Col>
      <Col xs="auto">
        <Link className="fs--1" to={`/forgotPassword`}> 
          Forget Password?
        </Link>
      </Col>
    </Row>
    <FormGroup>
      <Button color="primary" block className="mt-3" 
      //disabled={isDisabled}
      >
        Login
      </Button>
    </FormGroup>
  </Form>
  }
  renderParent=()=>{
    return(
    <Form onSubmit={this.selfRegParent}>
      <FormGroup>
        <Label>Parent Email</Label>
        <Input
          placeholder={'Email'}
          value={this.state.parentEmail}
          onChange={this.handleParentEmailChanged.bind(this)}
          type="email"
        required/>
      </FormGroup>
      <span className={this.state.isParentError ? 'text-danger' : 'text-success'}>
        {this.state.parentRegMsg}
      </span>
      <FormGroup>
      <Button color="primary" block className="mt-3" 
      //disabled={isDisabled}
      >
        Get access link
      </Button>
    </FormGroup>
    </Form>)
  }

  render() {
      return (
          <Section className="py-0">
            <Row className="flex-center min-vh-75 py-6"> 
              <Col sm={12} md={12} lg={12} xl={12}><Logo /></Col>            
              <Col sm={10} md={8} lg={6} xl={5} className="col-xxl-4">                
                <Card>
                  <CardBody className="fs--1 font-weight-normal p-5">
                    <>
                      <Row className="text-left justify-content-between">
                        <Col xs="auto">
                          <h5 className="pb-2">Login</h5>
                        </Col>
                      </Row>
                        {
                          this.renderLogin()
                        }                 
                    </>
                  </CardBody>
                </Card>                                
              </Col>
              {
                this.state.isSuperAdmin ?
                <Col sm={10} md={8} lg={6} xl={5} className="col-xxl-4">
                  <Card>
                    <CardBody className="fs--1 font-weight-normal p-5">
                      <>
                        <Row className="text-left justify-content-between">
                          <Col xs="auto">
                            <h5 className="pb-2">Are you a parent?</h5>
                          </Col>
                        </Row>
                        {
                          this.renderParent()
                        }
                      </>
                    </CardBody>
                  </Card>
                </Col>
                :null
              }
            </Row>
          </Section>
          )
  }
}
export default withRouter(Login)