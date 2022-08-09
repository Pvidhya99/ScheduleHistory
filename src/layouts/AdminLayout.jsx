import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from "react-router";
import { Route, Switch } from 'react-router-dom';
import NavbarTop from '../components/navbar/NavbarTop';
import NavbarVertical from '../components/navbar/NavbarVertical';
import Footer from '../components/footer/Footer';
import {get} from '../server/actions';
import loadable from '@loadable/component';
import AppContext from '../context/Context';
import Dashboard from '../components/dashboard/Dashboard';
import SchoolYearHeader from '../components/navbar/SchoolYearHeader';
import moment from 'moment';
import ImportStudents from '../components/pages/admin/importStudents';
import ManageStudents from '../components/pages/admin/manageStudents';
import StudentRec from '../components/pages/admin/manageStudents/studentRec';


const AdminLayout = ({ location,history }) => {
  const { isFluid, isVertical, navbarStyle } = useContext(AppContext);
  const [modalIsOpen,setModalIsOpen]=useState(false);
  const [selectedSchoolYear,setSelectedSchoolYear]=useState({});
  const [schoolYearList,setSchoolYearList]=useState([]);
  
  useEffect(() => {
    validateSchoolYear();
    getSchoolGrade();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const validateSchoolYear=(isRebind=false)=>{
    get('/schoolYears/search/findByMealSchoolSchoolId?mealSchoolId=' + sessionStorage.getItem("SchoolId") + '&access_token=').then((response) => {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response.json();
    }).then(data => {
        if(data._embedded.schoolYears.length===0){
            if(!isRebind){
              setModalIsOpen(true);
            }                
        }
        else{
            sessionStorage.setItem('schoolYearsList',JSON.stringify(data._embedded.schoolYears))
            let rec= data._embedded.schoolYears.filter((o)=>{
                return moment(o.sessionStartDateTime).local()<= new Date() && moment(o.sessionEndDateTime).local() >=new Date()
            });
            if(rec.length===0 && (sessionStorage.getItem('schoolYear')||'')===''){
              setModalIsOpen(true);
            }else{
                const _selectedSchoolYear={...selectedSchoolYear};
                _selectedSchoolYear.name=rec[0].name;
                _selectedSchoolYear.schoolYear=rec[0].schoolYear
                sessionStorage.setItem('schoolYear',rec[0].name);
                sessionStorage.setItem('schoolYearValue',rec[0].schoolYear);
                setSelectedSchoolYear(_selectedSchoolYear)
            }
            setSchoolYearList(data._embedded.schoolYears)
        }
    }).catch(
        (error) => {
            console.log('Get School data response', error)
        }
    );
}
const getSchoolGrade=()=> {
  get('/mealSchools/' + sessionStorage.getItem("SchoolId") + '/school?access_token=').then((response) => {
      if (!response.ok) {
          throw Error(response.statusText);
      }
      return response.json();
  }).then(data => {
      sessionStorage.setItem('grades',JSON.stringify(Object.values(data.typeGrades),null, 2))
  }).catch(
      (error) => {
          console.log('Get School data response', error)
      }
  );
}

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
          <SchoolYearHeader schoolYears={schoolYearList} selectedSchoolYear={selectedSchoolYear} onSchoolYearChange={(item)=>{
            let _selectedSchoolYear={...selectedSchoolYear};
            _selectedSchoolYear.name=item.name;
            _selectedSchoolYear.schoolYear=item.schoolYear
            sessionStorage.setItem('schoolYear',item.name);
            sessionStorage.setItem('schoolYearValue',item.schoolYear);
            setSelectedSchoolYear(_selectedSchoolYear)
          }}  />
          <Switch>
            <Route path="/schoolAdmin" exact component={()=>'Dashboard'} />  
            <Route path="/schoolAdmin/manage/school/importStudent" exact render={() => <ImportStudents selectedSchoolYear={selectedSchoolYear} />} />
            <Route path="/schoolAdmin/manage/school/manageStudents" exact render={() => <ManageStudents selectedSchoolYear={selectedSchoolYear} />} />
            <Route path="/schoolAdmin/manage/school/studentRec" exact render={() => <StudentRec selectedSchoolYear={selectedSchoolYear} />} />
          </Switch>
          <Footer />
        </div>
    </div>
  );
};i

AdminLayout.propTypes = { location: PropTypes.object.isRequired };

export default withRouter(AdminLayout);