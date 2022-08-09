import { useContext, useEffect, useState } from "react"
import useServiceCalls from "./useServiceCalls";

const useOrderMealMenu = ({studentID,schoolId,breakfast,lunch})=>{
    const [orderMealData,setOrderMealData] = useState({})
    const [schoolAndMeal , setSchoolAndMeal] = useState({})
    
    const {get} = useServiceCalls()
    useEffect(()=>{
        getStudentDetails()
    },[])
    const getStudentDetails =async ()=>{
        try {
            const studentPromise =  get('/studentUsers/'+studentID)
            const mealSchoolPromise =  get('/studentUsers/'+studentID+"/mealSchool")
            const responseArray = await Promise.allSettled([studentPromise,mealSchoolPromise])
            setSchoolAndMeal({studentData: responseArray[0].value.data,
                mealSchoolData : responseArray[1].value.data })
        } catch (error) {
            console.log(error)
        }
    }
    const getMenus = async ()=>{
        try{
        let typeOfMeal = ""
        if(breakfast){
            typeOfMeal = "Breakfast"
        }else if(lunch){
            typeOfMeal = "Lunch"
        }    
        const {studentData} = schoolAndMeal
        const url = '/mealSummaryDetails?menuSummaryId=0&mealSchoolId=' + schoolId+'&grade=' + studentData.gradeName+'&studentRecId='+studentData.displayRecId+ '&itemType='+typeOfMeal
        const menusData = await get(url)
        setOrderMealData(menusData.data || {})
        }catch(error){
            console.log(error)
        }
    }
    useEffect(()=>{
        if(Object.keys(schoolAndMeal).length > 0)
        getMenus()
    },[schoolAndMeal])
    return {orderMealData}
}

export default useOrderMealMenu