import { useContext, useEffect, useState } from "react"
import { ParentContext } from "../context/Context"
import {transaction_Charge,transaction_Other_Charge,application_free,currency_symbol, paymentGatewayOptions, paymentOptionValues} from '../server/constants'
import {getMurchantPayChargesStatus, getPaymentGateway, getPaymentGatewayCharges} from '../server/util'
const useAddBalance = ({state})=>{
    let murchantPayChargeStatus=false;
    const [charges,setCharges] = useState(0)
    const [stateData,setStateData] = useState({
        mealSchoolId:0,
        schoolName:'',
        logoUrl:'',
        transactionType:'',
        transactionDescription:'',
        checkNumb:'',
        isEqualDistSelected:false,
        totalTransactionAmount:0.00,
        balAmount:0.00,
        transactionFees:0.00,
        selectedStudents : [],
        charges : 0})
    const {parentStateData : {studentsListData}} = useContext(ParentContext)
    
    useEffect(()=>{
        murchantPayChargeStatus=getMurchantPayChargesStatus(state.schoolId || 0);
        let charges=murchantPayChargeStatus?0: (getPaymentGatewayCharges(state.schoolId ,computAmount(),true));
        setStateData({...stateData,charges})
    },[])
    useEffect(()=>{
        let charges=murchantPayChargeStatus?0: (getPaymentGatewayCharges(state.schoolId ,computAmount(),true));
        setCharges(charges)
    },[stateData])
    useEffect(()=>{
        if(state){
            const selectedStudents = studentsListData.filter(item=>item.mealSchoolId === parseInt(state.schoolId))
            setStateData({...stateData,selectedStudents:JSON.parse(JSON.stringify(selectedStudents)),mealSchoolId : parseInt(state.schoolId)})
         }
    },[state,studentsListData])
    useEffect(()=>{
        if(stateData.isEqualDistSelected)
        equalDistribute(stateData.totalTransactionAmount)
    },[stateData.isEqualDistSelected])
    const equalDistribute=(amount)=>{
        amount= isNaN(amount)?0:amount
        let payObj=stateData;
        if(amount!=0){
            let distAmt=parseFloat((amount/payObj.selectedStudents.length).toFixed(2))
            let balAmt=amount-(distAmt*payObj.selectedStudents.length);
            payObj.selectedStudents.map((stud)=>{
             stud.transactionAmount=(amount/payObj.selectedStudents.length).toFixed(2)
            })
            payObj.selectedStudents[payObj.selectedStudents.length-1].transactionAmount=(distAmt+balAmt).toFixed(2);
         }
         else{
          payObj.selectedStudents.map((stud)=>{
              stud.transactionAmount=0
             })
         }
         setStateData({...stateData})
    }
    const handleMainAmount = (e)=>{
        let payObj=stateData;
        payObj.totalTransactionAmount=e.target.value;
        payObj.balAmount=e.target.value;
        payObj.transactionFees=((payObj.totalTransactionAmount * transaction_Charge)+ (payObj.totalTransactionAmount===0?0.00:transaction_Other_Charge))
        if(payObj.selectedStudents.length===1){
            payObj.selectedStudents[0].transactionAmount=payObj.totalTransactionAmount;                                                        
        }
        else{
            if(stateData.isEqualDistSelected){
                equalDistribute(parseFloat(payObj.totalTransactionAmount) );
            }
        }                                                    
        setStateData({...stateData})
       }
       const computAmount = () => {
        let payObj=stateData;
        let _computeAmount=0.0;
        payObj.selectedStudents?.map((s)=>{
            _computeAmount=_computeAmount+ parseFloat(!s.transactionAmount ?0.00:s.transactionAmount) 
        });
        return isNaN(_computeAmount)?0.00:_computeAmount;
    }
 
    const handleEqualDistribute =(e)=>{
        setStateData({...stateData,isEqualDistSelected:e.target.checked})
    }
    const handleStudentAmount =(e,index)=>{
        stateData.selectedStudents[index].transactionAmount = e.target.value || 0
        let totalTransactionAmount  = 0
        stateData.selectedStudents.forEach(item=>{
            totalTransactionAmount = parseFloat(item.transactionAmount || 0) + totalTransactionAmount
        })
        setStateData({...stateData,totalTransactionAmount})
    }
    const validatePayment=()=>{
        let isValid=false;
        let payObj=stateData;
        let _computAmount=computAmount()
        if(_computAmount>0){
            if(parseFloat(_computAmount.toFixed(2))== parseFloat(payObj?.totalTransactionAmount)){
                isValid=true;
            }
        }
        return isValid
    }
    return{
        stateData,
        handleMainAmount,
        computAmount,
        charges,
        handleEqualDistribute,
        handleStudentAmount,
        validatePayment
    }
}

export default useAddBalance