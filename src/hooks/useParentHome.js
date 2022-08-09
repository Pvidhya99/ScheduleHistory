import _ from "lodash";
import moment from "moment";
import {  useState } from "react";
import { useEffect } from "react";
import { URL_VERSION } from "../server/constants";
import { convertUTCDateToLocalDate, getOrderMonthYearByStudent,setSchoolsModule,setSchoolsPaymentGateways } from "../server/util";
import useServiceCalls from "./useServiceCalls";
import useUtil from "./useUtil";

const useParentHome = ()=>{
    const {getSessionData} = useUtil()
    let date = new Date();
    date.setMonth(date.getMonth() + 1)
  
    const [stateData,setStateData] = useState({
        date:date,
        studentsList: [],
        studentsListTemp: [],
        studentData: [],
        schoolObject:{},
        loading: false,
        hdataFilter:{tdate:'D',sdate:new Date(),edate:new Date()},
        selectedStudentsForPay:{}
    })
    const [menuYearMonth,setmenuYearMonth] =useState('')
    const {get} = useServiceCalls()
    useEffect(()=>{
        getMenuOrderYrMonth()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    const getMenuOrderYrMonth = async (parent) => {       
        try{
            const parentEmail = getSessionData("loggedInUserInfo")
        // get('/reports/getMenuOrderYrMonth?parentEmail='+parent+'&access_token=').then((response) => {
            let currentYearMonth=  new Date().getFullYear()+("0" + (new Date().getMonth() + 1)).slice(-2)
            const studentList = get('/reports/monthAndStudentListByEmail?isVersion2=true&parentEmail='+parentEmail+'&currentYearMonth='+currentYearMonth)
            const schoolInfo = get('/schoolInfoByParentEmail?isVersion2=true&parentEmail=' +parentEmail  +'&currentDate='+moment().format('YYYY-MM-DD'))
            const result = await Promise.allSettled([studentList,schoolInfo])
            result.forEach((resp,i)=>{
                if(resp.status === "fulfilled"){
                    if(i=== 0){
                        setmenuYearMonth(resp.value.data);  
                    }else if(i === 1 ){
                        setSchoolData(resp.value.data)
                    }
                }
            })
        }catch(err){
            console.log(err)
        }
       
    }
    const setSchoolData = async (schooldata)=>{
        try {
            let studentsListArray = []
            let moduleObject={};
            let paymentGatewayObj={};
            let currency={};
            let gradesMap=[];
            let countryCode={};
            let dateFormat={};
            let nonSchoolDays={};
            let trxFeeOnSchool={};
            let stripeAccountIds={};
            ((schooldata||{}).schoolDetailsInfos||[]).forEach(element => {
                currency[element.mealSchoolId]=element.currencySymbol;
                gradesMap[element.mealSchoolId]=element.gradesMap;
                countryCode[element.mealSchoolId]=element.countryCode;
                dateFormat[element.mealSchoolId]=element.dateFormat;
                nonSchoolDays[element.mealSchoolId]=element.nonSchoolDays;
                trxFeeOnSchool[element.mealSchoolId]=element.trxFeeOnSchool;
                if((element.stripeAccountId||'').length>0){
                    stripeAccountIds[element.mealSchoolId]=element.stripeAccountId;
                }
            });
            sessionStorage.setItem('currency_symbol',JSON.stringify(currency));
            sessionStorage.setItem('gradesMap',JSON.stringify(gradesMap));
            sessionStorage.setItem('ISD_code',schooldata.schoolDetailsInfos[0].isdCode);
            sessionStorage.setItem('countryCode',JSON.stringify(countryCode));
            sessionStorage.setItem('date_format',JSON.stringify(dateFormat));
            sessionStorage.setItem('nonSchoolDays',JSON.stringify(nonSchoolDays));
            sessionStorage.setItem('trxFeeOnSchool',JSON.stringify(trxFeeOnSchool));
            sessionStorage.setItem('stripeAccountIds',JSON.stringify(stripeAccountIds));
                const schoolDetailsAPICalls = schooldata.schoolDetailsInfos.map(async (school)=>{
                    let syear='';
                    moduleObject[school.mealSchoolId]=school.moduleAccess||{};
                    paymentGatewayObj[school.mealSchoolId]=school.paymentGateways||[]

                   let orderbySchoolYears= _.orderBy(school.schoolYears, [ 'schoolYear'], ['desc']);
                   let cDate=new Date();
                   for(var i=0;i<orderbySchoolYears.length;i++){
                       if(moment(orderbySchoolYears[i].sessionStartDateTime).local()<=cDate  && moment(orderbySchoolYears[i].sessionEndDateTime).local() >=cDate){
                        syear=orderbySchoolYears[i].schoolYear
                        
                        break;
                       }
                       else{
                           if(moment(orderbySchoolYears[i].sessionEndDateTime).local() <cDate){
                            syear=orderbySchoolYears[i].schoolYear
                            
                            break;
                           }
                       }
                   }
                   
                    return get('/studentUsers/search/findByEmailAndYearAndSchool?username=' + sessionStorage.getItem('loggedInUserInfo') + '&schoolYear='+syear+'&mealSchoolId='+school.mealSchoolId)
                    
                   
                });
                const result = await Promise.allSettled(schoolDetailsAPICalls)
                result.forEach((resp,i)=>{
                    if(resp.status === "fulfilled" && resp.value){
                        resp.value.data._embedded.studentUsers.map((student)=>{
                            let syear='';
                            let syearSDate=null;
                            let syearEDate=null;
                            let sname='';
                            let pdfurl='';
                              
                            const id =  parseInt(getQueryStringParams(resp.value.config.url,"mealSchoolId"))
                            const school = schooldata.schoolDetailsInfos.find(item=>item.mealSchoolId === id)
                            let cDate=new Date();
                            let orderbySchoolYears= _.orderBy(school.schoolYears, [ 'schoolYear'], ['desc']);
                            for(var i=0;i<orderbySchoolYears.length;i++){
                                if(moment(orderbySchoolYears[i].sessionStartDateTime).local()<=cDate  && moment(orderbySchoolYears[i].sessionEndDateTime).local() >=cDate){
                                 syear=orderbySchoolYears[i].schoolYear
                                 syearSDate=moment(orderbySchoolYears[i].sessionStartDateTime)
                                 syearEDate=moment(orderbySchoolYears[i].sessionEndDateTime)
                                 pdfurl=orderbySchoolYears[i].schoolPdfUrl
                                 break;
                                }
                                else{
                                    if(moment(orderbySchoolYears[i].sessionEndDateTime).local() <cDate){
                                     syear=orderbySchoolYears[i].schoolYear
                                     syearSDate=moment(orderbySchoolYears[i].sessionStartDateTime)
                                     syearEDate=moment(orderbySchoolYears[i].sessionEndDateTime)
                                     pdfurl=orderbySchoolYears[i].schoolPdfUrl
                                     break;
                                    }
                                }
                            }
                            student.schoolName = school.schoolName;
                            student.mealSchoolId = school.mealSchoolId;
                            student.logoUrl=school.logoLink
                            student.contactPName= school.contactPName
                            student.contactPPhone=school.contactPPhone
                            student.contactPEmail=school.contactPEmail
                            student.isPaymentEnabled=school.isPaymentEnabled;
                            student.stripeAccountId=(school.stripeAccountId || '');
                            student.isBreakfastAvailable =school.isBreakfastAvailable
                            student.id=parseInt(student._links.self.href.split('/').pop())
                            student.sessionYear={schoolYearValue:syear,schoolYear:sname,schoolPdfUrl:pdfurl, sessionStartDate:syearSDate.toDate(), sessionEndDate:syearEDate.toDate()}
                            let schoolObj=stateData.schoolObject;
                            schoolObj[school.mealSchoolId]={
                                schoolName:school.schoolName,
                                schoolModules:school.moduleAccess,
                                paymentGateways:school.paymentGateways||[],
                                sessionYear:student.sessionYear,
                                events:school.events,
                                pkgRegStudents:school.pkgRegisteredStds
                            }
                            setStateData({...stateData , 
                                schoolObject:schoolObj,
                                })
                            studentsListArray.push(student)
                            return student
                            
                        })
                    }
                })
                
                setStateData({...stateData , 
                    studentsListTemp: studentsListArray,
                    studentsList: studentsListArray,
                })
                 setSchoolsModule(moduleObject);
                 setSchoolsPaymentGateways(paymentGatewayObj)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => { 
        fetchStudentExtraInfo(stateData.studentsListTemp)
       // eslint-disable-next-line react-hooks/exhaustive-deps                           
    },[stateData.studentsListTemp])
    const fetchStudentExtraInfo = async (studentsList)=>{
        //console.log(studentsList) 
         // eslint-disable-next-line
        const apiCalls = studentsList.map(student=>{
            let yearmonth=getOrderMonthYearByStudent(menuYearMonth,parseInt( student._links.self.href.split('/').pop()));
           // console.log(yearmonth)
            if(yearmonth!=='')         
            {
               const api =  getStudentExtraInfo(student,yearmonth);
               return api
            }                 
           
        })
        const resultArray = await Promise.allSettled(apiCalls)
        let {studentsList : updatedStudentList} = stateData
        resultArray.forEach(resp=>{
            if(resp.status === "fulfilled" && resp.value){
                const data = resp.value.data   
                const id =  parseInt(getQueryStringParams(resp.value.config.url,"studentRecId"))
                let orderStatus = ""
                    let orderPrice = ''
                    let paymentStatus = ''
                    let orderDate = ''
                    if (data.orderStatus === true) {
                        orderStatus = "update"
                        orderPrice = data.totalPrice;
                        let date = data.orderedDate;
                        let t = date.split(/[- : T]/);
                        let d = convertUTCDateToLocalDate(new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]));
                        let actiondate = new Date(d);
                        orderDate = (actiondate.getMonth() + 1) + '/' + actiondate.getDate() + '/' + actiondate.getFullYear().toString().substr(-2);
                        paymentStatus = data.paymentStatus
                    } else if (data.orderStatus === false) {
                        orderStatus = "new"
                    } else {
                        orderStatus = 0;
                    }
                   // let id = stId;
                   
                   updatedStudentList = updatedStudentList.map(item=>{
                        if(item.id=== id){
                             item = {...item,orderStatus,orderPrice,paymentStatus, orderDate }
                        }
                        return item
                    })
                    // studentsList.
                    // const idx = studentsList.indexOf(student)
                    // let updatedStudent = {...student, orderStatus, id, orderPrice, paymentStatus, orderDate};
                    // const nextEvents = [...studentsList]
                    // nextEvents.splice(idx, 1, updatedStudent)
                    // setStateData({...stateData,studentsList : nextEvents})
            }
        })
        //console.log(updatedStudentList)
        setStateData({...stateData,studentsList : updatedStudentList})
  
    }
    // useEffect(()=>{
    //     parentDispatch({ 
    //         type: 'SET_STUDENTS_LIST',
    //         payload: stateData.studentsList
    //     }) 
    // },[stateData.studentsList])
    const getQueryStringParams = (str,name) => {
        let q={}
        str.split('?')[1].split('&').forEach(function(i){
            q[i.split('=')[0]]=i.split('=')[1];
        });
        return q[name]
    };
    const getStudentExtraInfo = async (student,yearMonth) => {
        try {
             //alert(JSON.stringify(student, null, 2))
        let stId = student._links.self.href.split('/').pop();
        return get(URL_VERSION+'/menuOrderStatus?studentRecId=' + stId + '&yearMonth=' + yearMonth )
        
        
        } catch (error) {
            console.log(error)
        }
       

    }

    return {
        stateData
    }
}

export default useParentHome