import { useContext, useEffect, useState } from "react"
import { ParentContext } from "../context/Context"
import useServiceCalls from "./useServiceCalls";
import useUtil from "./useUtil";

const useAllergeis  = ({index,schoolId}) =>{
    const {parentStateData : {studentsListData},parentDispatch} = useContext(ParentContext)
    const { getGroupBySchool } = useUtil()
    const [stateData,setStateData] = useState({})
    const {patch } = useServiceCalls()
    
    useEffect(()=>{
        if(studentsListData && Object.keys(studentsListData).length > 0){
            const resultData =  getGroupBySchool(JSON.parse(JSON.stringify(studentsListData)))

            let selectedSchool = JSON.parse(JSON.stringify(resultData[schoolId]))
            const selectedStudent = JSON.parse(JSON.stringify(selectedSchool[index]))
            delete resultData[schoolId]
            selectedSchool.splice(index,1)
            selectedSchool =[{...selectedStudent,isEdit:true},...selectedSchool]
            let x = {
                "0" : selectedSchool,
               
            }
            let resetArray =Object.assign(x,resultData)
            
          //  console.log(resetArray)
            setStateData(resetArray)
        }
    },[studentsListData])
    const enableEdit = (index,key) =>{
        stateData[key][index].isEdit = !stateData[key][index].isEdit
        setStateData({...stateData})
    }
    const saveChanges = async (index,key)=>{
        try {
            const id = stateData[key][index].id
            const requestBody = {
                allergies :  stateData[key][index].allergies
            }
            await patch("/studentUsers/"+id,requestBody)
            parentDispatch({ 
                type: 'SET_STUDENTS_LIST',
                payload: studentsListData
            }) 
            enableEdit(index,key)
        } catch (error) {
            console.log(error)
        }
    }
    const textHandler = (e,index,key)=>{
        stateData[key][index].allergies = e.target.value
        const mealschoolID = stateData[key][index].mealSchoolId
        studentsListData.some(item=>{
            if(item.mealSchoolId === mealschoolID){
                item.allergies = e.target.value
                return true
            }
        })
        parentDispatch({ 
            type: 'SET_STUDENTS_LIST',
            payload: studentsListData
        })
        setStateData({...stateData})
    }
    return {
        stateData,
        enableEdit,
        saveChanges,
        textHandler
    }
}

export default useAllergeis