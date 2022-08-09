import { useState,useContext, useEffect } from "react"
import { ParentContext } from "../context/Context" 
import useUtil from "./useUtil";

const useParentDashboard = ()=>{
    const {parentStateData : {studentsListData}} = useContext(ParentContext)
    const {getGroupBySchool} = useUtil()
    const [studentsListBySchool,setStudentsListBySchool] = useState([])
    const groupBySchool= ()=>{
        const resultData = getGroupBySchool(studentsListData)
        setStudentsListBySchool(resultData)
    }
    useEffect(()=>{
        groupBySchool(studentsListData)
        //eslint-disable-next-line
    },[studentsListData])
    return {
        studentsListBySchool,
        groupBySchool
    }
}

export default useParentDashboard