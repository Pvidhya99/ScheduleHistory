import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { withRouter } from "react-router";
import NavbarTop from '../components/navbar/NavbarTop';
import NavbarVertical from '../components/navbar/NavbarVertical';
import Footer from '../components/footer/Footer';
import loadable from '@loadable/component';
import AppContext from '../context/Context';
import Schools from '../components/pages/superAdmin/schools';
import SchoolRecord from '../components/pages/superAdmin/schools/schoolRec';
import ManageSchool from '../components/pages/superAdmin/manageSchools';
import OnboardSchool from '../components/pages/superAdmin/manageSchools/onboardSchool';
const SuperAdminLayout = ({ location, history }) => {
  const { isFluid, isVertical, navbarStyle } = useContext(AppContext);
  
  useEffect(() => {
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className={isFluid? 'container-fluid' : 'container'}>
      {isVertical && <NavbarVertical  navbarStyle={navbarStyle} />}      
        <div className="content">
          <NavbarTop onRightSideNavItemClick={(action)=>{
            switch(action){
              case 'LOGOUT':
                sessionStorage.clear();
                history.push('/login');
                break;
              case 'PROFILE':
                break;
              default:
                break;
            }
          }} />
          <Switch>            
            <Route path="/SuperAdmin" exact component={()=>('Super Admin Dashboard')} />
            <Route path="/SuperAdmin/manageSchool/schools" exact component={Schools} /> 
            <Route path="/SuperAdmin/manageSchool/schoolRecord/:id?" exact component={SchoolRecord} />    
            <Route path="/SuperAdmin/manageSchool/manageSchools" exact component={ManageSchool} />
            <Route path="/SuperAdmin/manageSchool/onboardSchool/:id?" exact component={OnboardSchool} />
            <Route path="/SuperAdmin/manageSchool/datasync" exact component={()=>{
              return 'Data sync'
            }} /> 
          </Switch>
          <Footer />
        </div>
    </div>
  );
};

SuperAdminLayout.propTypes = { location: PropTypes.object.isRequired };

export default withRouter(SuperAdminLayout);