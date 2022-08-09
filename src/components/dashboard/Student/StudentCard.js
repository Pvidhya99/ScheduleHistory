import React from "react"
import { Button, Card, CardBody, Col, Row } from "reactstrap"
import { currency_symbol } from "../../../server/constants";
import { convertTwoDecimalPoint, getAccessLevelByModule, getModuleEnum, getSchoolGrades, groupBy } from "../../../server/util";
import Avatar from '../../common/Avatar';
import { useHistory } from "react-router-dom";

const StudentCard = ({data,index,schoolName})=>{
    const gradeGroup=groupBy(getSchoolGrades(data.mealSchoolId),'value');
    const label=((gradeGroup[data.gradeName]||[])[0]||{}).label;
    const navigate = useHistory()
    const GoToAlergies= (index,schoolId)=>{
        navigate.push("/parent/allergies",{index,schoolId})
    }
    const GoToMealMenus= (index,schoolId)=>{
        navigate.push("/parent/mealMenus",{index,schoolId,studentID:data.displayRecId,schoolName})
        //navigate.push("/parent/mealMenus",{index : 0 ,schoolId : 900,studentID:6201})
    }
    const GoToHistory=(index,schoolId)=>{
        navigate.push("/parent/studenthistory",{ schoolId,index,gradeGroup,schoolName,})
    }
    
    const modEnum=getModuleEnum();
return (
    <Card>
        <CardBody>
        <Row>
            <Col xs="3" md="3" className="img-padding">
            <Avatar size="x2" rounded='false' src={data.image} />
                {/* <FontAwesomeIcon icon="user" size="lg" transform="right-6 grow-4" /> */}
            </Col>
            <Col xs="9" md="6" >
                <Row>
                   
                    <Col xs="12" >
                        <span class="student-name">{[data.firstName,' ',data.lastName]}</span>
                    </Col>
                </Row>
                <Row>
                    <Col xs="5" md="6" className="studentTitle">
                        Grade 
                    </Col>
                    <Col xs="7"  md="6" className="studentValue">
                        : {label} 
                    </Col>
                </Row>
                <Row>
                    <Col xs="5"  md="6" className="studentTitle">
                        Eligibility 
                    </Col>
                    <Col xs="7"  md="6" className="studentValue" >
                        : {data.isFreeMealEligible ? "Free" : (data.isReducePriceEligible ? "Reduced" : "Regular")} 
                    </Col>
                </Row>
                <Row>
                    <Col xs="5" md="6" className="studentTitle">
                        A/C Balance 
                    </Col>
                    <Col xs="7"  md="6" className="studentValue">
                        : {currency_symbol(data.mealSchoolId)+' '+convertTwoDecimalPoint(data.accBalance,)} 
                    </Col>
                </Row>
            </Col>
            
            <Col md="3" className="no-padding" >
                <Row className="student-divider justify-content-center no-margin">
                <Col  xs="6" md="12" className="justify-content-center row no-padding">
                <Button className="text-primary btn-size" color="link" onClick={()=>{GoToAlergies(index,data.mealSchoolId)}}>Alergeis</Button>
                </Col>
                <Col xs="6" md="12" className="justify-content-center row no-padding">
                {(getAccessLevelByModule(modEnum.BOM,data.mealSchoolId) ||
                            getAccessLevelByModule(modEnum.LOM,data.mealSchoolId) ||
                            getAccessLevelByModule(modEnum.SOM,data.mealSchoolId)) && 
                        <Button className="text-primary btn-size" color="link" onClick={()=>{GoToMealMenus(index,data.mealSchoolId)}}>Order Menu</Button>
                }
                {((!getAccessLevelByModule(modEnum.BOM,data.mealSchoolId) ||
                       !getAccessLevelByModule(modEnum.LOM,data.mealSchoolId) ||
                       !getAccessLevelByModule(modEnum.SOM,data.mealSchoolId)) && 
                       (getAccessLevelByModule(modEnum.VBM,data.mealSchoolId)||
                       getAccessLevelByModule(modEnum.VSM,data.mealSchoolId)||
                       getAccessLevelByModule(modEnum.VLM,data.mealSchoolId))) && 
                        <Button className="text-primary btn-size" color="link" >View Menu</Button>
                }
                </Col>
                <Col xs="6" md="12" className="justify-content-center row no-padding">
                <Button className="text-primary btn-size"  color="link">View Orders</Button>
                </Col>
                <Col xs="6" md="12" className="justify-content-center row no-padding">
                <Button className="text-primary btn-size" color="link" onClick={()=>{GoToHistory(index,data.mealSchoolId)}}>Tx History</Button>
                </Col>
                </Row>
            
            
            </Col>
        </Row>
        </CardBody>
    </Card>
)

}

export default StudentCard