import React, { useContext, useReducer } from "react"
import { Col, Row } from "reactstrap"
import CardWithLegend from "../../../common/CardWithLegend"
import Notifications from "../../../common/Notifications"
import SchoolDashboardNav from "../../../dashboard/Student/SchoolDashboardNav"
import StudentCard from "../../../dashboard/Student/StudentCard"
import useParentDashboard from "../../../../hooks/useParentDashboard"
import ContainerHeader from "../../../common/ContainerHeader"
import { useEffect } from "react"
import { parentReducer } from "../../../../reducers/parentReducer"
import { ParentContext } from "../../../../context/Context"


const ParentDashboard = ({title})=>{
    const {parentDispatch} = useContext(ParentContext)
    const {studentsListBySchool} = useParentDashboard()
 
   useEffect(()=>{
    parentDispatch({ 
        type: 'UPDATE_TITLE',
        payload: title
    }) 
   },[title])
    const renderStudents = (val) =>{
        return studentsListBySchool[val].map((item,index)=>{
            
            return (
                <Col xs="12" lg="4" className="pb-2">
                    <StudentCard data={item} index={index} schoolName= {item.schoolName}/>
                </Col>
                
           )
        })
        
    }
    return (
    <>
    <ContainerHeader title={""} backButton={false}/>
    <Row >
        
        <Col xs="12" md="12">
            {Object.keys(studentsListBySchool).map(value=>(
                <CardWithLegend title={studentsListBySchool[value][0].schoolName}> 
                    <Row >
                        <Col xs="12" className="d-flex justify-content-end card-menu-style">
                            <SchoolDashboardNav mealSchoolId = {value}/>
                        </Col>
                        { renderStudents(value)}
                    </Row>
            
                </CardWithLegend>

            ))}
            
            
        </Col>
        
    </Row>
   
    </>
)

}

export default ParentDashboard