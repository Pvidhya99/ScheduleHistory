import React from "react"
import { Col, Row } from "reactstrap"

const Notifications = ()=>{
    console.log("Notifications component rendered......")
return (
    <>
    <Row >
        
        <Col xs="3" sm="4"  lg="3">
           01/01/2022-
        </Col>
        <Col xs="9" sm="8"   lg="9">
         Jan menu published
        </Col>
        <Col xs="3" sm="4"   lg="3">
           01/02/2022-
        </Col>
        <Col xs="9" sm="8"   lg="9">
         Jan menu Deadline is on 01/05/2022
        </Col>
    </Row>
   
    </>
)

}

export default Notifications