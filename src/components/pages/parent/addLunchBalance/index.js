import React, { useContext, useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Button, Col, Form, FormGroup, Input, InputGroup, InputGroupAddon, Label, Row, Table } from 'reactstrap'
import useAddBalance from '../../../../hooks/useAddbalance'
import CardWithLegend from '../../../common/CardWithLegend'
import ContainerHeader from '../../../common/ContainerHeader'
import PaymentModule from '../../../../Misc/PaymentModule'
import {_addNotificationError,
    allowNumericWithdecimal,
    _addNotification,
    getPaymentGatewayCharges, 
    getPaymentGateway,
    convertTwoDecimalPoint, 
    getLoginParent,
    getMurchantPayChargesStatus} from "../../../../server/util";
    import {transaction_Charge,transaction_Other_Charge,application_free,currency_symbol, paymentGatewayOptions, paymentOptionValues} from '../../../../server/constants'
import { ParentContext } from '../../../../context/Context'

const AddLunchBalance = ({title})=>{
    const {state} = useLocation()
    const {parentDispatch} = useContext(ParentContext)
 
   useEffect(()=>{
    parentDispatch({ 
        type: 'UPDATE_TITLE',
        payload: title
    }) 
   },[title])
    
    const {stateData,handleMainAmount,computAmount,handleEqualDistribute,handleStudentAmount,validatePayment,charges} = useAddBalance({state})
    const [mainAmount,setMainAmount] = useState(0)
    const navigate = useHistory()
    if(!state){
        navigate.push("/parent")
        return false
    }
   console.log(stateData)
   console.log(state)
   const tableRow = ( data,index ) => (
    <tr className="align-middle" key={index}>
      <th className="text-nowrap" >
        {data.firstName}{" "}{data.lastName}
      </th>
      <td className="checkout-amount text-nowrap"  >{currency_symbol(state?.schoolId) +" "+ convertTwoDecimalPoint(data.balAmt)}</td>
      <td className="checkout-input checkout-amount text-nowrap"> <InputGroup  className='checkout-inputGroup'>
         <InputGroupAddon addonType="prepend" style={{display : "block"}}>$</InputGroupAddon>
                            <Input 
                             key={`${index}-${data.id}`}
                            className='checkout-amount' 
                            placeholder="Amount" 
                            disabled = {stateData.isEqualDistSelected}
                            value={data.transactionAmount || 0}
                            onKeyPress={handleOnlyNumber}
                            onChange={(e)=>{handleStudentAmount(e,index)}}
                            />
                        </InputGroup></td>
  
      
    </tr>
  );

  const handleOnlyNumber=(event)=>{
    var ASCIICode = (event.which) ? event.which : event.keyCode
    if((event?.key === '-' || event?.key === '+'  || event?.key.toLowerCase() === 'e' || ASCIICode===47  ||  (ASCIICode > 31 && (ASCIICode < 45 || ASCIICode > 57)))) {
      event.preventDefault();
    }
  
}
    return ( <>
        <ContainerHeader title="" fullWidth={true}/>
        <Row >
        
        <Col xs="12">
        <CardWithLegend  title={stateData?.selectedStudents?.length > 0 ? stateData?.selectedStudents[0].schoolName : ""}> 
        
                
                    <Row>
                    <Col xs="6" md="4">
                        <InputGroup >
                            <InputGroupAddon addonType="prepend">$</InputGroupAddon>
                            <Input min={0} className='checkout-amount' value={isNaN(stateData.totalTransactionAmount)?0.00: stateData.totalTransactionAmount} placeholder="Amount"  onKeyPress={handleOnlyNumber} onChange={handleMainAmount}/>
                        </InputGroup>
                    </Col>
                    { (stateData?.selectedStudents && stateData?.selectedStudents?.length > 1) && 
                        <Col xs="6" md="4" style={{marginTop:3}}>
                            <FormGroup check>
                                <Label check>
                                    <Input type="checkbox" checked={stateData.isEqualDistSelected} onChange={handleEqualDistribute}/>{' '}
                                    Equally distribute
                                </Label>
                            </FormGroup>
                        </Col>
                    }
                    
                    </Row>
                    <br/>
                    <Table responsive striped hover>
                        <thead>
                            <tr>
                            <th className='checkout-name'  scope="col" >Name</th>
                            <th className='checkout-amount' scope="col">Available Balance</th>
                            <th className='checkout-amount' scope="col" >Amount</th>
                           
                            </tr>
                        </thead>
                        <tbody>
                            { stateData?.selectedStudents?.map((data,i) => (
                                    tableRow(data,i)
                               
                            ))}
                            <tr>
                                <th className='checkout-amount' colSpan={2}>Transaction charges:</th>
                                <td className='checkout-amount' >{currency_symbol(state?.schoolId)+' '+(charges).toFixed(2)}</td>
                            </tr>
                            <tr>
                                <th className='checkout-amount' colSpan={2}>Total Amount:</th>
                                <td className='checkout-amount' >{currency_symbol(state?.schoolId)+' '+(computAmount()+charges).toFixed(2)}</td>
                            </tr>
                        </tbody>
                        </Table>
                                <Row className='justify-content-end'>
                                    <Col xs="2" >
                            {
                                validatePayment() === false ? <Button color="primary">Pay With Card</Button> 
                                :
                                <PaymentModule
                                                    paymentDesc={"LUNCH_BAL"}
                                                    schoolId={stateData.mealSchoolId}
                                                    userInfo={{
                                                        parent:getLoginParent()
                                                        }}
                                                    paymentObj={stateData} 
                                                    excludeCharges={"fasle"}
                                                    onToken={(token)=>{                                                          
                                                        let selectedStudents=[];
                                                        stateData.selectedStudents.map((s)=>{  
                                                        if(s.transactionAmount>0) {
                                                            selectedStudents.push({
                                                                "studentRecId":s.studentRecId,
                                                                "transactionAmount":s.transactionAmount
                                                                });
                                                            }           
                                                        });
                                                        let payObj={
                                                        "mealSchoolId":stateData.mealSchoolId,
                                                        "transactionType":"Deposit",
                                                        "paymentType":"Online",
                                                        "transactionDescription":stateData.transactionDescription,
                                                        "totalTransactionAmount":stateData.totalTransactionAmount,
                                                        "transactionFees":getPaymentGatewayCharges(stateData.mealSchoolId,parseFloat(stateData.totalTransactionAmount),false),
                                                        "appFeeAmount":application_free,
                                                        "studentWiseTransactions":selectedStudents
                                                        };
                                                        if(typeof(token)==='string'){
                                                            payObj["transactionToken"]=token;
                                                        }
                                                        else{
                                                            payObj["transferId"]=token.transferId;
                                                            payObj["chargeId"]=token.chargeId;
                                                        }
                                                        this.onToken(payObj);
                                                    }}
                                                   
                                                   
                                                     />
                            }
                            </Col>
                            </Row>
            </CardWithLegend>
        </Col>
        
        </Row>
        </>)
}

export default AddLunchBalance