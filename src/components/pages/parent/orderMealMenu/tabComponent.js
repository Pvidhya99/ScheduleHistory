import React, { useContext, useState } from 'react'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import OrderMealComponent from './OrderMealComponent';
import {  ParentContext } from '../../../../context/Context';
import { useLocation } from 'react-router-dom';
import { getNotWorkingDays, getSchoolGrades, groupBy } from '../../../../server/util';
import { currency_symbol } from '../../../../server/constants';

const TabComponent = () => {
  console.log("tab component rendered......")
 
  const {parentStateData : {studentsListData}} = useContext(ParentContext)
  const {state:{index,schoolId,studentID}} = useLocation()
  const studentData = studentsListData.find(item=>item.id === parseInt(studentID))
  const isParent = sessionStorage.getItem('ROLE') == 'ROLE_PARENT'
  const holidaysArray = getNotWorkingDays( isParent? schoolId :0) 
  const currencySymbol = currency_symbol(isParent?schoolId:0)
  const [activeKey,setActiveKey] = useState("Breakfast")
    return (
      <Tabs
        id="controlled-tab-example"
        activeKey={activeKey}
        onSelect={(k) => {
          setActiveKey(k)
        }}
        className="tabStyle"
      >
        <Tab eventKey="Breakfast" title="Breakfast" className='border-bottom border-x p-3'>
          <OrderMealComponent key="breakfast" breakfast={true} isParent={isParent} hiddenDays={holidaysArray} currency_symbol={currencySymbol} studentData={studentData}/>
        </Tab>
        <Tab eventKey="Lunch" title="Lunch" className='border-bottom border-x p-3'>
            <OrderMealComponent key="lunch" lunch={true} isParent={isParent} hiddenDays={holidaysArray} currency_symbol={currencySymbol} studentData={studentData}/>   
        </Tab>
       
      </Tabs>
    );
  }

  export default TabComponent