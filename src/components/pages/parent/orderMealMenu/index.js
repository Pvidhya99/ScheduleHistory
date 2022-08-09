import React, { createContext, useContext, useEffect, useState } from 'react'
import CardWithLegend from '../../../common/CardWithLegend'
import { useLocation } from 'react-router-dom'
import {  Col,  Form,  FormGroup, Input, Label, Row } from 'reactstrap'
import Notifications from '../../../common/Notifications'
import ContainerHeader from '../../../common/ContainerHeader'


import TabCmponent from './tabComponent'
import OrderMealProvider from '../../../../reducers/orderMealProvider'
import { ParentContext } from '../../../../context/Context'
import { getSchoolGrades, groupBy } from '../../../../server/util'
import AmountSummary from '../../../common/AmountSummary'
import { currency_symbol } from '../../../../server/constants'

const OrderMealMenu = ({title})=>{
    const {parentStateData : {studentsListData},parentDispatch} = useContext(ParentContext)
 
   useEffect(()=>{
    parentDispatch({ 
        type: 'UPDATE_TITLE',
        payload: title
    }) 
   },[title])
    
   //console.log("index file rendered.....")
   const {state:{index,schoolId,studentID,schoolName}} = useLocation()
   const studentData = studentsListData.find(item=>item.id === parseInt(studentID)) || {}
   const isParent = sessionStorage.getItem('ROLE') == 'ROLE_PARENT'
   const gradeList=getSchoolGrades(isParent? schoolId:0,false);
   const currencySymbol = currency_symbol(isParent?schoolId:0)
   const gradeGroup=groupBy(gradeList||[],'value');   
   let dot = {
        backgroundColor: '#b2e87a',
        height: '20px',
        width: '20px',
        borderRadius: '50%',
        display: 'inline-block',
        margin: '0px 10px',
        verticalAlign: 'middle'

    }
    let dot2 = {
        backgroundColor: 'orange',
        height: '20px',
        width: '20px',
        borderRadius: '50%',
        display: 'inline-block',
        margin: '0px 10px',
        verticalAlign: 'middle'

    }
    //const [tabValue,setTabValue] = useState("Breakfast")
    return(
        <>
        <OrderMealProvider>
        <ContainerHeader title={""}/>
        <Row >
        
        <Col xs="12" md="8">
         
                <CardWithLegend  title={schoolName}> 
                <Row>
                   <Col xs={"6"}>
                       Name : <b>{studentData.firstName} {studentData.lastName}</b>
    </Col>
                    <Col xs={"3"}>
                        Grade :  <b>{ ((gradeGroup[studentData.gradeName]||[])[0]||{}).label||''}</b>
                    </Col>
                    <Col xs={"3"} className='d-flex justify-content-end'>
                    <Form>
                        
                        <Input type="select" name="select"  bsSize="sm" id="exampleSelect">
                            <option>Month</option>
                            <option>Jan</option>
                            <option>Feb</option>
                            <option>Mar</option>
                            <option>Apr</option>
                        </Input>
                        </Form>
                    </Col>
                    <hr />
                    <Col xs={'12'} className="d-flex justify-content-center">
                    <span style={dot}>&nbsp;</span><span>Available Meals.&nbsp;&nbsp;</span>
                    <span style={dot2}>&nbsp;&nbsp;</span><span>Selected Meals &nbsp;&nbsp;</span>
                    </Col>
                </Row>
                <TabCmponent />
                    
                </CardWithLegend>
           
        </Col>
        <Col xs="12" md="4" className='fixed-col'>
        <CardWithLegend title="Amount Summary"> 
            <AmountSummary studentData={studentData} currencySymbol={currencySymbol}/>
        </CardWithLegend>
        </Col>
        </Row>
        </OrderMealProvider>
     </>
    )

}
export default OrderMealMenu