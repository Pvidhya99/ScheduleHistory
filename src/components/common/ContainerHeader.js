import React from 'react'
import { useHistory } from 'react-router-dom'
import { Button, Col, Row } from 'reactstrap'
const ContainerHeader =({title,backButton = true,fullWidth=false})=>{
    const navigate = useHistory()
    const goToBack = ()=>{
        navigate.goBack()
    }
    return (
        <Row>
        <Col xs="6"  md={ "6"}><h4 style={{color:"#ea7066"}}>{title}</h4> </Col>
        {backButton && 
        <Col xs="6"  md={ "6"} className='d-flex justify-content-end'><Button onClick={goToBack} style={{backgroundColor:"#ea7066",color:"white"}}>Back</Button> </Col>
        
        }
        </Row>
    )
}

export default ContainerHeader