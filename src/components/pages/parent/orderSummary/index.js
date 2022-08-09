import React, { useContext, useEffect } from 'react'
import { Button, Col, Row, Table } from 'reactstrap'
import { ParentContext } from '../../../../context/Context'
import ContainerHeader from '../../../common/ContainerHeader'

const OrderSummary = ({title})=>{
    const {parentDispatch} = useContext(ParentContext)

    useEffect(()=>{
        parentDispatch({ 
            type: 'UPDATE_TITLE',
            payload: title
        }) 
       },[title])

    return (<>
            <ContainerHeader title={""}/>
            <br/>
            <Row >
                <Col xs={7}>
                    <Table responsive striped hover>
                    <thead>
                        <tr>
                            <th className='checkout-name'  scope="col" >Month Year</th>
                            <th className='checkout-amount' scope="col" >Amount</th>
                        
                        </tr>
                    </thead>
                    <tbody>
                    
                        <tr>
                            <td className='checkout-name' >Mar -22</td>
                            <td className='checkout-amount' >$ 16</td>
                        </tr>
                        <tr>
                            <td className='checkout-name' >Total Amount:</td>
                            <td className='checkout-amount' >$ 16</td>
                        </tr>
                    </tbody>
                    </Table>
                </Col>
                <Col xs={4} className="order-summary-boxStyle">
                    <Row >
                        <Col xs={6}>
                        Total order amount
                        </Col>
                        <Col xs={6} className="text-right">
                        $16
                        </Col>
                    </Row>
                    <hr/>
                    <Row  style={{marginBottom:15}}>
                        <Col xs={6}>
                        Meal Acount Balance
                        </Col>
                        <Col xs={6}  className="text-right">
                        $50
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                        Online Payment
                        </Col>
                        
                    </Row>
                    <hr/>
                    <Row style={{marginBottom:15}}>
                        <Col xs={6} >
                        Amount to Pay
                        </Col>
                        <Col xs={6}  className="text-right">
                        $0
                        </Col>
                        
                    </Row>
                    <Row >
                        <Col xs={6}>
                        Stripe Transaction charges
                        </Col>
                        <Col xs={6}  className="text-right">
                        $0
                        </Col>
                        
                    </Row>
                    <hr/>
                    <Row >
                        <Col xs={6}>
                        Total Payment Amount
                        </Col>
                        <Col xs={6}  className="text-right">
                        $0
                        </Col>
                        
                    </Row>
                </Col>
               
                <Col xs={11} style={{marginTop:15}} className="text-right">
                    <Button className="cust-btn-third" >Pay</Button>
                </Col>
            </Row>
    </>)
}

export default OrderSummary