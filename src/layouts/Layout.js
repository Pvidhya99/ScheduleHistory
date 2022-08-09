import React, {useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { CloseButton, Fade } from '../components/common/Toast';
import {getCookie} from "../server/util";
import loadable from '@loadable/component';
import ParentDeviceRegister from './ParentDeviceRegister';
import Error404 from '../components/errors/Error404';

const Login=loadable(()=>import('./login'))
const PrivacyPolicy = loadable(() => import('./PrivacyPolicy'));

const ActivateParent=loadable(()=> import('./ActiveParent'))
const ParentLayout=loadable(()=> import('./ParentLayout'))
const Layout = () => {
   // let devRespData = {};
  useEffect(() => {
    Login.preload();
  }, []);
  let checkCookie  = (props, context) => {
    let cookieData = getCookie('parent');
    const cookieObj = cookieData == '' ? undefined : (JSON.parse(cookieData) || undefined);
    if (cookieObj == undefined) {
        sessionStorage.removeItem('bcacUrl')
        window.location.replace('/404')
        return false;
    }
    let token = cookieObj.token;
    let parentEmail = cookieObj.email;
    window.location.replace('/activateParentAccount?parentId=' + parentEmail + '&token=' + token)
}
  

const ParentRoute = ({component: Component, ...rest}) => (

  <Route
      {...rest}
      render={props =>

          ((sessionStorage.getItem("access_token")) && (sessionStorage.getItem("ROLE") === "ROLE_PARENT")) ? (
              <Component {...props} />
          ) : ((sessionStorage.getItem("access_token") === undefined) ? (
                  <Redirect to={{
                      pathname: "/activateParentAccount",
                      state: {from: props.location}
                  }}/>
              ) : (checkCookie())
          )
      }
  />
);


  return (
    <Router>
      <Switch>
        <Route path="/404" exact component={Error404}/>
        <Route path="/login" exact component={Login}/>
        <Route path="/privacy-policy" exact component={PrivacyPolicy} />
        <Route path="/forgotPassword" exact component={PrivacyPolicy} />         
       
        <Route path="/activateParentAccount"
                               render={() => <ActivateParent />} />
        <Route path="/deviceRegister"
                               render={() => <ParentDeviceRegister />} />
        <ParentRoute path="/parent" component={ParentLayout}/>
        <Route component={Login} /> 
      </Switch>
      <ToastContainer transition={Fade} closeButton={<CloseButton />} position={toast.POSITION.TOP_CENTER} />
    </Router>
  );
};

export default Layout;
