import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { withRouter } from "react-router";
import NavbarTop from '../components/navbar/NavbarTop';
import Footer from '../components/footer/Footer';
import AppContext from '../context/Context';
import ParentDashboard from '../components/pages/parent/dashboard';
import AllergiesComponent from '../components/pages/parent/allergies';
import DailySpendLimitComponent from '../components/pages/parent/dailySpendLimit';
import OrderMealMenu from '../components/pages/parent/orderMealMenu';
import AddLunchBalance from '../components/pages/parent/addLunchBalance';
import useParentHome from '../hooks/useParentHome';
import { ParentContext } from '../context/Context';
import { parentReducer } from '../reducers/parentReducer';
import { useReducer } from 'react';
import OrderSummary from '../components/pages/parent/orderSummary';
import StudentHistory from '../components/pages/parent/history';
const ParentLayout = ({ location, history }) => {
  const { isFluid } = useContext(AppContext);
  const [parentStateData, parentDispatch] = useReducer(parentReducer,{studentsListData : [],pageTitle : ""});
  const {stateData : parentMainData } = useParentHome()
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  useEffect(()=>{
    //console.log(parentMainData)
    parentDispatch({ 
              type: 'SET_STUDENTS_LIST',
              payload: parentMainData.studentsList
          }) 
  },[parentMainData])
  return (
    <ParentContext.Provider value={{ parentStateData, parentDispatch }}>
    <div className={isFluid? 'container-fluid' : 'container'}>
        <div className="content">
          <NavbarTop parent={true} onRightSideNavItemClick={(action)=>{
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
            <Route path="/parent" exact  render={props=> <ParentDashboard {...props} title="Dashboard"/>} />
            <Route path="/parent/allergies" exact  render={props=> <AllergiesComponent {...props} title="Allergies"/>}  />
            <Route path="/parent/studenthistory" exact  render={props=> <StudentHistory {...props} title="Student History"/>}  />
            <Route path="/parent/studentorder" exact  render={props=> <StudentHistory {...props} title="Student Order"/>}  />
            <Route path="/parent/addlunchbalance" exact  render={props=> <AddLunchBalance {...props} title="Add Lunch Balance"/>}  />
            <Route path="/parent/dailyspendlimit" exact render={props=> <DailySpendLimitComponent {...props} title="Daily Spending Limit"/>} />
            <Route path="/parent/ordersummary" exact render={props=> <OrderSummary {...props} title="Order Summary"/>}  />
          
          </Switch>
          <Footer />
        </div>
    </div>
    </ParentContext.Provider>
  );
};

ParentLayout.propTypes = { location: PropTypes.object.isRequired };

export default withRouter(ParentLayout);