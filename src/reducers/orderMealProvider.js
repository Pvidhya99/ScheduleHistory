import {  useReducer } from "react"
import { orderMealContext } from "../context/Context";
import { orderMealReducer } from "./orderMealReducer";

const OrderMealProvider=({children})=>{
    const [orderStateData, orderDispatch] = useReducer(orderMealReducer,{selectedItems:{},count : 0});
return (
    <orderMealContext.Provider value={{orderStateData, orderDispatch }}>
        {children}
    </orderMealContext.Provider>
)

}

export default OrderMealProvider