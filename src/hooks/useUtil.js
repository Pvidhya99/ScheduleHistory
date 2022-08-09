
const useUtil = ()=>{

    const setSessionData = (param, value)=>{
        sessionStorage.setItem(param,value)
    }
    const removeSessionData = (param) =>{
        sessionStorage.removeItem(param);
    }
    const getSessionData = (param)=>{
        try{
            const returnValue = sessionStorage.getItem(param)
            return returnValue
        }catch(err){
            console.log("error in getting session data-----",err)
        }
       
    }
    const getGroupBySchool= (studentsListData=[])=>{
        let x={}
        studentsListData.forEach((a)=>{
            if(Object.keys(x).includes(a.mealSchoolId.toString())){
                x[a.mealSchoolId].push(a)
            }else{
                x[a.mealSchoolId.toString()] = [a]
            }
        })
        return x
    }

    return {getSessionData,setSessionData,removeSessionData,getGroupBySchool}
}

export default useUtil