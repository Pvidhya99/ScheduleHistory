import React, { useCallback, useContext, useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { orderMealContext } from "../context/Context"
import { MealTypes } from "../server/constants"
import { convertTwoDecimalPoint } from "../server/util"

const useAmountSummary = ({studentData})=>{
    const [orderAmount,setOrderAmount] = useState(0)
    const [paidAmount,setPaidAmount] = useState(0)
    console.log("Notifications component rendered......")
    const navigate = useHistory()
    const {orderStateData:{selectedItems,previewOrder,count},orderDispatch } = useContext(orderMealContext)
    console.log(selectedItems)
    const PreviewOrder  =async ()=>{
      
        await orderDispatch({
            type: 'UPDATE_PREVIEW_ORDER_STATUS',
            payload: 'update'
          })
    }
    const gotoOrderSummary =()=>{
        navigate.push("/parent/ordersummary",{paidAmount,orderAmount,selectedItems})
    }
    const getOrderAmount = () =>{
        var orderAmountTotal = 0 
        var paidAmount = 0
        if(Object.keys(selectedItems).length > 0){
            Object.keys(selectedItems).forEach(type =>{
                selectedItems[type].forEach(item=>{
                    const studentIsFreeMeal=((studentData?.isFreeMealEligible||false)?true:((item.type === MealTypes.breakfast) && studentData?.beforeCare)?true:false);
                    const studentIsReducePrice=studentData?.isReducePriceEligible||false;
                    orderAmountTotal += studentIsFreeMeal? 0: (studentIsReducePrice)?item.reducedPrice:  (item.applyDiscount && item.isSelected?item.afterDiscountAmount:item.price)
                    if(item.type === MealTypes.extra){
                        paidAmount += parseFloat(convertTwoDecimalPoint(item.price,2));

                    }else if(item.type === MealTypes.side){
                        paidAmount += parseFloat(convertTwoDecimalPoint((studentIsFreeMeal? 0: (studentIsReducePrice)?item.reducedPrice:  item.price),2))
                    }else{
                        
                            if(studentIsFreeMeal){
                                paidAmount += 0;
                            }else if(studentIsReducePrice){
                                paidAmount+=parseFloat(convertTwoDecimalPoint(item.reducedPrice,2));
                            }else{
                                // item['applyDiscount']=applyDiscount;
                                // item['itemPriceDisForMonthlyOrder']=itemPriceDisForMonthlyOrder;
                                // item['afterDiscountAmount']=parseFloat(convertTwoDecimalPoint(item.price,2))-parseFloat(convertTwoDecimalPoint(itemPriceDisForMonthlyOrder,2));
                                // paidAmount+=applyDiscount? item.afterDiscountAmount:parseFloat(convertTwoDecimalPoint(item.price,2));
                            }                        
                    }
                })
            })
           
        }
        setPaidAmount(convertTwoDecimalPoint(paidAmount))
        setOrderAmount(convertTwoDecimalPoint(orderAmountTotal))
       
    }
    useEffect(()=>{
        getOrderAmount()
    },[count])

    return {
        orderAmount,
        previewOrder,
        PreviewOrder,
        getOrderAmount,
        paidAmount,
        gotoOrderSummary
    }
}

export default useAmountSummary