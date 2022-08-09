import React, { useContext, useEffect, useState } from "react"
import { Button, Col, Row } from "reactstrap"
import useAmountSummary from "../../hooks/useAmountSummary"


const AmountSummary = ({studentData,currencySymbol})=>{
    const {
        orderAmount, 
        previewOrder,
        PreviewOrder,
        paidAmount,
        gotoOrderSummary
    } = useAmountSummary({studentData})
   
return (
    <>
    <Row >
        
        <Col xs="9" className="d-flex justify-content-end">
           Paid Amount
        </Col>
        <Col xs="3" className="d-flex justify-content-end">
         {currencySymbol} {paidAmount}
        </Col>
        <Col xs="9" className="d-flex justify-content-end">
           Order Amount
        </Col>
        <Col xs="3" className="d-flex justify-content-end">
        {currencySymbol} {orderAmount}
        </Col>
        <br/>
        <br/>
        <Col xs="6" className="d-flex justify-content-start">
           <Button className="cust-btn-primary" onClick={PreviewOrder}>{ !previewOrder ? "Preview Order" : "Back to Order"}</Button>
        </Col>
        <Col xs="6" className="d-flex justify-content-end">
            <Button className="cust-btn-fourth"  onClick={gotoOrderSummary}>Order Summary</Button>
        </Col>
    </Row>
   
    </>
)

}

export default AmountSummary