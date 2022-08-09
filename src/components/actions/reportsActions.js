import { groupBy, numberParce, showFile } from '../../helpers/utils';
import service from '../../server/request';
const download = require('downloadjs');
export const getDepositReportData=async(reqData)=>{
    const {mealSchoolId, catererId, startDate, endDate, schoolYear}=reqData;
    try{
        let url='';
        if(mealSchoolId>0){
            //url=`mealManage/reports/transactionsReport?mealSchoolId=${mealSchoolId}&startDate=${startDate}&endDate=${endDate}&isDeposit=true&schoolYear=${schoolYear}&fileExport=false`;
            url=`mealManage/reports/transactionsReport?mealSchoolId=${mealSchoolId}&startDate=${startDate}&endDate=${endDate}&isDeposit=true&fileExport=false`;
        }else{
            //url=`mealManage/reports/caterer/depositReport/${catererId}?startDate=${startDate}&endDate=${endDate}&fileType=data&schoolYear=${schoolYear}`;
            url=`mealManage/reports/caterer/depositReport/${catererId}?startDate=${startDate}&endDate=${endDate}&fileType=data`;
        }
       const resp= await service({
            method:'GET',
            url:url
        });
        if(resp.status===200){
            return {success:true,data:resp.data};
        }
    }catch(ex){
        return {error:true,errorMessage:ex.errorMessage}
    }
}
export const getDepositFile=async(reqData)=>{
    const {mealSchoolId, catererId, startDate, endDate, schoolYear, fileType}=reqData;
    try{
        let url='';
        if(mealSchoolId>0){
            //url=`mealManage/reports/transactionsReport?mealSchoolId=${mealSchoolId}&startDate=${startDate}&endDate=${endDate}&isDeposit=true&schoolYear=${schoolYear}&fileExport=true&fileType=${fileType}`;
            url=`mealManage/reports/transactionsReport?mealSchoolId=${mealSchoolId}&startDate=${startDate}&endDate=${endDate}&isDeposit=true&fileExport=true&fileType=${fileType}`;
        }else{
            //url=`mealManage/reports/caterer/depositReport/${catererId}?startDate=${startDate}&endDate=${endDate}&fileType=${fileType}&schoolYear=${schoolYear}`;
            url=`mealManage/reports/caterer/depositReport/${catererId}?startDate=${startDate}&endDate=${endDate}&fileType=${fileType}`;
        }
       const resp= await service({
            method:'GET',
            url:url,
            responseType: "blob"
        });
        if(resp.status===200){
            let filename = "Deposit Reports";
            if(fileType==='pdf'){                
                await showFile(resp.data,filename);
                return {success:true,data: resp.data};
            }else{
                download(resp.data,
                    filename + '.xls', "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                    return {success:true,data: resp.data};
            }            
         }    
     }catch(ex){
         if(ex.message=='Request failed with status code 417'){
             return {error:true,errorMessage:'No data available.'};
         }else{
             return {error:true, errorMessage:ex.errorMessage};
         }
     }
}

export const getSalesReportData=async(reqData)=>{
    const {mealSchoolId, catererId, startDate, endDate}=reqData;
    try{
        let url='';
        if(mealSchoolId>0){
            url=`mealManage/reports/salesReport/${mealSchoolId}?&startDt=${startDate}&endDt=${endDate}&isExport=false`;
        }else{
            url=`mealManage/reports/salesReport/${catererId}?startDt=${startDate}&endDt=${endDate}&isExport=false&isCaterer=true`;
        }
       const resp= await service({
            method:'GET',
            url:url
        });
        if(resp.status===200){
            return {success:true,data:resp.data};
        }
    }catch(ex){
        return {error:true,errorMessage:ex.errorMessage}
    }
}
export const getSalesFile=async(reqData)=>{
    const {mealSchoolId, catererId, startDate, endDate, fileType}=reqData;
    try{
        let url='';
        if(mealSchoolId>0){
            url=`mealManage/reports/salesReport/${mealSchoolId}?&startDt=${startDate}&endDt=${endDate}&isExport=true&fileType=${fileType}`;
        }else{
            url=`mealManage/reports/salesReport/${catererId}?startDt=${startDate}&endDt=${endDate}&isExport=true&fileType=${fileType}&isCaterer=true`;
        }
        const resp= await service({
            method:'GET',
            url:url,
            responseType: "blob"
        });
        if(resp.status===200){            
            let filename = "Sales Report";
            if(fileType=='pdf'){
            await showFile(resp.data,filename);
            return {success:true,data: resp.data};
            }else{
                download(resp.data,
                    filename + '.xls', "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                    return {success:true,data: resp.data};

            }
         }    
     }catch(ex){
         if(ex.message=='Request failed with status code 417'){
             return {error:true,errorMessage:'No data available.'};
         }else{
             return {error:true, errorMessage:ex.errorMessage};
         }
     }
}