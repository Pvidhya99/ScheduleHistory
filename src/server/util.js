import {staffGrade,preSchoolGrades, 
    MealTypes, menuTypeCalender, MenuOrderTypes, paymentGatewayOptions, stripeInfo, regularNotWorkingDays, itemizeNotWorkingDays} from './constants';
import {countryCodes} from './countryCodes';
import moment from 'moment';
import {moduleEnum} from './modules'
import {text2num} from './word2number';
//const converter = require('number-to-words');
export function createCookie(name, value, days) {
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    }
    else {
        expires = "";
    }
        document.cookie = name + "=" + value + expires + "; domain=.mealmanage.com; path=/";
}

export function getCookie(c_name) {
    if (document.cookie.length > 0) {
        var c_start = document.cookie.indexOf(c_name + "=");
        if (c_start !== -1) {
            c_start = c_start + c_name.length + 1;
            var c_end = document.cookie.indexOf(";", c_start);
            if (c_end === -1) {
                c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}

export function formatDate(d) {
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    let year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
}

export function convertUTCDateToLocalDate(date) {
    //var newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
    var newDate=date;

    var offset = date.getTimezoneOffset() / 60;
    var hours = date.getHours();

    newDate.setHours(hours - offset);

    return newDate;
}
export function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}
export function getMonthNameByNumber(monthNo){
    var monthno=parseInt(monthNo);
    if(monthno !== undefined){
    var month = []
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";
    return month[monthno-1] ||'';
    }
    else{
        return ''
    }
}
export function gradeTextToNumber(_grade) {
    if((_grade||'')===''){
        return ''
    }
    if(_grade==='k' || _grade==='K'){
        _grade='k';
    }
    return (preSchoolGrades.includes(isNaN(_grade)?_grade:_grade.toLowerCase()) || _grade=== staffGrade? _grade: text2num(_grade));
}
/* export function gradeNoToText(_grade) {
    if((_grade||'')===''){
        return ''
    }
    if(_grade==='k' || _grade==='K'){
        _grade='k';
    }
    return (preSchoolGrades.includes(isNaN(_grade)?_grade.toLowerCase():_grade) || _grade== staffGrade? _grade: converter.toWords(_grade));
} */

export const sortGrade= (grade)=> {
    let resNo = [];
    let resNoNo = [];
    let staffArray=[];    
    grade.forEach(function (val) {
        if (!isNaN(val))
            resNo.push(parseInt(val));
        else
            if(val===staffGrade){
                staffArray.push(val);
            }else{
                resNoNo.push(val);
            }
    });
    for (let i = 0; i < resNo.length; i++) {
        for (let j = 0; j < resNo.length - i; j++) {
            if (resNo[j] > resNo[j + 1]) {
                let tmp = resNo[j];
                resNo[j] = resNo[j + 1];
                resNo[j + 1] = tmp;
            }
        }
    }
    for (let k = resNoNo.length - 1; k >= 0; k--) {
        resNo.unshift(resNoNo[k]);
    }
    staffArray.forEach(item=>{
        resNo.push(item)
    })
    return (resNo);
}

export function _addNotification(event, self) {
    self._notificationSystem.addNotification({
        title: "Success",
        message: event,
        level: 'success',
        position: 'tc',
        autoDismiss: '3',
        uid: 5,

    });
}
export function _addNotificationWarning(event, self) {
    self._notificationSystem.addNotification({
        title: "Warning",
        message: event,
        level: 'warning',
        position: 'tc',
        autoDismiss: '3',
        uid: 5,

    });
}
export function _addNotificationError(event, self) {
    self._notificationSystem.addNotification({
        title: "Failed",
        message: event,
        level: 'error',
        position: 'tc',
        autoDismiss: '3',
        uid: 5,
    });
}
export function standardDateFormat(dateString){
    return new Date(dateString.substr(0,dateString.indexOf('.'))+'Z');
}
export function deleteCookie(c_name) {
    var d = new Date(); //Create an date object
    d.setTime(d.getTime() - (1000*60*60*24)); //Set the time to the past. 1000 milliseonds = 1 second
    var expires = "expires=" + d.toGMTString(); //Compose the expirartion date
    window.document.cookie = c_name+"=; "+expires+";domain=.mealmanage.com;";//Set the cookie with name and the expiration date
}
export function getOrderMonthYearByStudent(monthYearArray,studentId){
    let monthYear='';
    let _monthyearArray=Object.keys(monthYearArray)||[];

    for(var i=0;i<_monthyearArray.length;i++){
        if(monthYearArray[_monthyearArray[i]].indexOf(studentId)>=0){
            monthYear=_monthyearArray[i];
            break;
        }
    }   
    return monthYear;
}
export function allowNumericWithdecimal(event){
    let input = event.target;
    if(input.value === 0){input.value = ''}
    //eslint-disable-next-line
    input.value=input.value.replace(/[^0-9\.]/g,'');
    let ponto = input.value.split('.').length;
    if (ponto > 2)
        input.value=input.value.substr(0,(input.value.length)-1);
    if (ponto ===2){
        input.value=input.value.substr(0,(input.value.indexOf('.')+3));
    }
    if(input.value === '.')
        input.value = "";
    if ((event.which !== 46 || event.target.value.indexOf('.') !== -1) && (event.which < 48 || event.which > 57)) {
        event.preventDefault();
    }
}
export function allowNumberWithDecimalNegative(event){
    let input = event.target;
        let ponto = input.value.split('.').length;
        let slash = input.value.split('-').length;
        if (ponto > 2)
                input.value=input.value.substr(0,(input.value.length)-1);

        if(slash > 2){            
            input.value=input.value.substr(0,(input.value.length)-1);
        }else{
            if(input.value.indexOf('-')>0){
                input.value=input.value.substr(0,(input.value.length)-1);
            }
        }
        input.value=input.value.replace(/[^0-9.-]/,'');
        if (ponto ===2){
            input.value=input.value.substr(0,(input.value.indexOf('.')+3));
        }
        if(event.keyCode===8){
            if(input.value.length===(input.value.indexOf('.')+1)){
                input.value=input.value.substr(0,(input.value.length)-1);
            }
        }        
    if(input.value === '.')
        input.value = "";
}

export function showFile(blob,fileName){
    // It is necessary to create a new blob object with mime-type explicitly set
    // otherwise only Chrome works like it should
    var newBlob = new Blob([blob], {type: "application/pdf"})
    
    // IE doesn't allow using a blob object directly as link href
    // instead it is necessary to use msSaveOrOpenBlob
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(newBlob);
      return;
    } 
  
    // For other browsers: 
    // Create a link pointing to the ObjectURL containing the blob.
   
    


    var anchor = document.createElement('a');
    anchor.href = window.URL.createObjectURL(newBlob);
   
    anchor.name=fileName+'.pdf';
    anchor.dataset.downloadurl = ['application/pdf', anchor.download, anchor.href].join(':');

    if(typeof InstallTrigger !== 'undefined'){
        window.open(anchor.href,'_blank');
        return;
    }    
    anchor.target='_blank';
    anchor.click();

    //var link = document.createElement('a');
   // link.href = data;
   // link.target='_blank';
   // link.setAttribute('open', fileName+".pdf");
    // link.click();
    setTimeout(function(){
      // For Firefox it is necessary to delay revoking the ObjectURL
    //  window.URL.revokeObjectURL(anchor.href);
    }
    , 100);
  }

  export function numToWords(number) {

    //Validates the number input and makes it a string
    if (typeof number === 'string') {
        number = parseInt(number, 10);
    }
    if (typeof number === 'number' && isFinite(number)) {
        number = number.toString(10);
    } else {
        return '';
    }

    //Creates an array with the number's digits and
    //adds the necessary amount of 0 to make it fully 
    //divisible by 3
    var digits = number.split('');
    while (digits.length % 3 !== 0) {
        digits.unshift('0');
    }


    //Groups the digits in groups of three
    var digitsGroup = [];
    var numberOfGroups = digits.length / 3;
    for (var i = 0; i < numberOfGroups; i++) {
        digitsGroup[i] = digits.splice(0, 3);
    }
    //console.log(digitsGroup); //debug

    //Change the group's numerical values to text
    var digitsGroupLen = digitsGroup.length;
    var numTxt = [
        [null, 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'], //hundreds
        [null, 'ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'], //tens
        [null, 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'] //ones
        ];
    var tenthsDifferent = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];

    // j maps the groups in the digitsGroup
    // k maps the element's position in the group to the numTxt equivalent
    // k values: 0 = hundreds, 1 = tens, 2 = ones
    for (var j = 0; j < digitsGroupLen; j++) {
        for (var k = 0; k < 3; k++) {
            var currentValue = digitsGroup[j][k];
            digitsGroup[j][k] = numTxt[k][currentValue];
            if (k === 0 && currentValue !== '0') { // !==0 avoids creating a string "null hundred"
                digitsGroup[j][k] += ' hundred ';
            } else if (k === 1 && currentValue === '1') { //Changes the value in the tens place and erases the value in the ones place
                digitsGroup[j][k] = tenthsDifferent[digitsGroup[j][2]];
                digitsGroup[j][2] = 0; //Sets to null. Because it sets the next k to be evaluated, setting this to null doesn't work.
            }
        }
    }

    console.log(digitsGroup); //debug

    //Adds '-' for gramar, cleans all null values, joins the group's elements into a string
    for (var l = 0; l < digitsGroupLen; l++) {
        if (digitsGroup[l][1] && digitsGroup[l][2]) {
            digitsGroup[l][1] += '-';
        }
        digitsGroup[l].filter(function (e) {return e !== null});
        digitsGroup[l] = digitsGroup[l].join('');
    }

    console.log(digitsGroup); //debug

    //Adds thousand, millions, billion and etc to the respective string.
    var posfix = [null, 'thousand', 'million', 'billion', 'trillion', 'quadrillion', 'quintillion', 'sextillion'];
    if (digitsGroupLen > 1) {
        var posfixRange = posfix.splice(0, digitsGroupLen).reverse();
        for (var m = 0; m < digitsGroupLen - 1; m++) { //'-1' prevents adding a null posfix to the last group
            if (digitsGroup[m]) {
                digitsGroup[m] += ' ' + posfixRange[m];
            }
        }
    }

    console.log(digitsGroup); //debug

    //Joins all the string into one and returns it
    return digitsGroup.join(' ');

} //End of numToWords 

export function getWeekStartEndDates(currentDate){
    var curr = new Date(currentDate)|| new Date();
    var end=new Date(currentDate)||new Date();
    curr.setHours(0)
    curr.setMinutes(0);
    curr.setSeconds(0);
    end.setHours(23);
    end.setMinutes(59);
    end.setSeconds(59);
    var firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
    var lastday = new Date(end.setDate(end.getDate() - end.getDay()+6));
return {startDate:firstday,endDate:lastday}
}
export function getMonthStartEndDates(currentDate){
    var curr = currentDate|| new Date();
    curr.setHours(0)
    curr.setMinutes(0);
    curr.setSeconds(0);    
    var y = curr.getFullYear(), m = curr.getMonth();
    var firstDay = new Date(y, m, 1);
    var lastDay = new Date(y, m + 1, 0);  
    lastDay.setHours(23);
    lastDay.setMinutes(59);
    lastDay.setSeconds(59);
return {startDate:firstDay,endDate:lastDay}
}
export function getYearStartEndDates(currentDate){
    var curr = currentDate|| new Date();
    curr.setHours(0)
    curr.setMinutes(0);
    curr.setSeconds(0);
    var y = curr.getFullYear()
    var firstDay = new Date(y, 0, 1);
    var lastDay = new Date(y, 11, 31); 
     lastDay.setHours(23);
    lastDay.setMinutes(59);
    lastDay.setSeconds(59); 
return {startDate:firstDay,endDate:lastDay}
}
export function getSessionStartEndDates(currentSchoolYear){
    try{
        let _schoolYearsList=JSON.parse(sessionStorage.getItem('schoolYearsList')||[]);
        const idx=_schoolYearsList.findIndex(item=>{
            return item.schoolYear===currentSchoolYear
        });
        
        if(idx>=0){
           return {startDate:moment(_schoolYearsList[idx].sessionStartDateTime)._d,
            endDate:moment(_schoolYearsList[idx].sessionEndDateTime)}
        }else{
            return getYearStartEndDates(new Date())
        }
    }catch(ex){
        return getYearStartEndDates(new Date())
    }
    
    
}
export function getTodayStartEndDates(currentDate){
    var curr = currentDate|| new Date();
    curr.setHours(0)
    curr.setMinutes(0);
    curr.setSeconds(0);
    var firstDay = curr;
    var lastDay = new Date(curr);
    lastDay.setHours(23)
    lastDay.setMinutes(59);
    lastDay.setSeconds(59);
return {startDate:firstDay,endDate:lastDay}
}
/*export function calculateStripeCharges(amount,isIncludeAppFree=true){
    if(amount==0){
        return 0.00
    }
    const charges=amount*(transaction_Charge/100)+transaction_Other_Charge;
   const chargeAmt= parseFloat((charges).toFixed(2)) ;
   return isIncludeAppFree? parseFloat( (application_free+chargeAmt).toFixed(2)):parseFloat( (chargeAmt).toFixed(2))
}*/
export const getMurchantPayChargesStatus=(sid=0)=>{
    let trxFeeOnSchoolObj={}
    try{
        trxFeeOnSchoolObj=JSON.parse(sessionStorage.getItem('trxFeeOnSchool'));
    }catch(ex){
        trxFeeOnSchoolObj={}       
    }
    return (trxFeeOnSchoolObj[sid]);
}
export const getPaymentGatewayCharges=(sid=0,amount, isIncludeAppFree=true)=>{
   const _gateWay= getPaymentGateway(sid).payGatewayName;
   switch(_gateWay){
        case paymentGatewayOptions.STRIPE :
            return calculateStripeCharges(amount, isIncludeAppFree,sid);
        case paymentGatewayOptions.PAYMOB :
            return calculatePaymobCharges(amount, isIncludeAppFree);
        default:
            return 0.00;
   }
}
export const calculatePaymobCharges=(amount,isIncludeAppFree=true)=>{
    if(amount===0){
        return 0.00
    }
    const charges=(amount*(1/100))+(amount*(2.75/100))+3;
    return charges;
}
 export const calculateStripeCharges=(amount,isIncludeAppFree=true, sid=0)=>{
    // const _stripeInfo=stripeInfo(sid);
    if(amount===0){
        return 0.00
    }
   // const charges=amount*(_stripeInfo.transaction_Charge/100)+_stripeInfo.transaction_Other_Charge;
   // const other_charges=charges*(_stripeInfo.transaction_Charge/100);
   // return parseFloat((charges+other_charges).toFixed(2)) ;
   return calcFee(amount,isIncludeAppFree,sid);
}

function calcFee(amount,isIncludeAppFree,sid) {
    const _stripeInfo=stripeInfo(sid);
	let _amount = parseFloat(amount);
	let total = (_amount + parseFloat(_stripeInfo.transaction_Other_Charge)) / (1 - parseFloat(_stripeInfo.transaction_Charge) / 100);
	let fee = total - _amount;

	return isIncludeAppFree? parseFloat( (_stripeInfo.application_free+fee).toFixed(2)):parseFloat( (fee).toFixed(2));
} 
export function numberOnly(evt){
    var iKeyCode = (evt.which) ? evt.which : evt.keyCode
    if (iKeyCode !== 46 && iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57)){
        evt.preventDefault()
    }else{
        if(iKeyCode === 46)
            evt.preventDefault()
    }       
}
export function fileToBase64Convert(file,onDone) {    
    if (file) {
        var reader = new FileReader();

        reader.onload = function(readerEvt) {
            var binaryString = readerEvt.target.result;
            onDone(btoa(binaryString));
        };
        reader.readAsBinaryString(file);
    }
};
 export function convertTwoDecimalPoint(value){
     let num = value || 0;
     if(!isNaN(num)){
        return parseFloat(num).toFixed(2)
     }
     return 0.00;
 }
 export function getCountryCode(){
     return '+1';
 }
 export function getCountryCallCode(code){
    const countryObj=groupBy(countryCodes,'code');
     return (countryObj[code][0]||{}).dial_code
 }
 export function groupBy(list, props) {
    return list.reduce((a, b) => {
       (a[b[props]] = a[b[props]] || []).push(b);
       return a;
    }, {});
}
export function getAccessLevelByModule(module,sid=0){
    const yesNo=['Yes','No'];
    const monthYear=['Monthly','Weekly','Yearly'];
    const orderLunchType=['Regular','A la Carte'];
    let accessVal='';
    if(sid===0){
        accessVal=getLoginModuleAccess()[module];
    }else{
        accessVal=getParentSchoolModuleAccess(sid)[module];
    }    
    if(monthYear.includes(accessVal)){
        return accessVal;
    }else if(orderLunchType.includes(accessVal)){
        return accessVal;
    }else if(yesNo.includes(accessVal)){
        return accessVal===yesNo[0]?true:false;
    }
    return false;
}
export function getLoginModuleAccess() {
    const _loggedInUserInfo =sessionStorage.getItem('loggedInUserInfo')||{};
    try{
       return JSON.parse(_loggedInUserInfo).moduleAccess||{};
    }catch(ex){
        return {};
    }
}
export function getParentSchoolModuleAccess(sid) {
    const _schoolModuleObj =sessionStorage.getItem('moduleAccess')||{};
    try{
       return JSON.parse(_schoolModuleObj)[sid]||{};
    }catch(ex){
        return {};
    }
}
export function getModuleEnum(){
    return moduleEnum;
}
export function getShortNameByModuleEnum(value){
    const obj = getModuleEnum();
   return  Object.keys(obj).find(key => obj[key] === value);
}
export function setSchoolsModule(modules){
    try{
    sessionStorage.setItem('moduleAccess', JSON.stringify(modules));
    }catch(ex){
        sessionStorage.setItem('moduleAccess', {});
    }
} 
export function setSchoolsPaymentGateways(gateways){
    try{
    sessionStorage.setItem('paymentGateways', JSON.stringify(gateways));
    }catch(ex){
        sessionStorage.setItem('paymentGateways', {});
    }
}
export const numberParce=(value)=>{
    try{
        const num=Number(value);
        return isNaN(num)?0:num;
    }catch(ex){
        return 0;
    }
}
export const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
export const dataURLtoFile=(dataurl, filename)=> { 
    let arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), 
    n = bstr.length, 
    u8arr = new Uint8Array(n);        
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }    
    return new File([u8arr], filename, {type:mime});
}
export function getSchoolCountryCode(sid=0){
    let cCode=''
    if(sid===0){
        cCode= sessionStorage.getItem('countryCode');
    }else{
        const obj=JSON.parse((sessionStorage.getItem('countryCode')||'')==''?[]:sessionStorage.getItem('countryCode'))||{};
        cCode=obj[sid];        
    }
    return cCode;
}
export const isWeekMenu=(mealType,sid=0)=>{
    const modEnum=getModuleEnum();
    if(!isRegularLunchOrderType(sid)){
        return true;
    }
    if(mealType===MealTypes.LUNCH){
        return (getAccessLevelByModule(modEnum.LMM,sid)===menuTypeCalender.WEEKLY)?true:false;
    }
    if(mealType===MealTypes.BREAKFAST){
        return (getAccessLevelByModule(modEnum.BMM,sid)===menuTypeCalender.WEEKLY)?true:false;
    }
    if(mealType===MealTypes.SNACK){
        return (getAccessLevelByModule(modEnum.SMM,sid)===menuTypeCalender.WEEKLY)?true:false;
    }
    return false;
}
export const isRegularLunchOrderType=(sid=0)=>{
    const modEnum=getModuleEnum();
    return getAccessLevelByModule(modEnum.MOT,sid)===MenuOrderTypes.REGULAR
}
export const getPaymentGateway=(sid=0)=>{
    let _schoolPaymentGateWay=[];
    try{
        if(sid===0){
            const _loggedInUserInfo =sessionStorage.getItem('loggedInUserInfo')||{};
            _schoolPaymentGateWay= JSON.parse(_loggedInUserInfo).paymentGateways||[];
        }else{
            const allGateways =sessionStorage.getItem('paymentGateways')||{};
            _schoolPaymentGateWay= JSON.parse(allGateways)[sid]||[];
        }
        if(_schoolPaymentGateWay.length>0){
            return _schoolPaymentGateWay[0]||{}
        }else{
            return {};
        }
    }catch(ex){
    }
    return {};
}
export const getLoginParent=()=>{
    try{
        const _loggedInUserInfo =sessionStorage.getItem('loggedInUserInfo');
        return _loggedInUserInfo;
    }catch(ex){
        return ''
    }
}
export const getSchoolGrades=(sid=0,includeAll=true)=>{
    let _gradesMap=[];
    const allTab=[{label:'All', value:0,displayOrder:0}];
    try{
        if(sid===0){
            const _loggedInUserInfo =sessionStorage.getItem('loggedInUserInfo')||{};
            const availableGrades=sessionStorage.getItem('grades')||[];
            _gradesMap= (JSON.parse(_loggedInUserInfo).gradesMap||[]).filter(g=>{
                return availableGrades.includes(g.value);
            });
        }else{
            const allGradesMap =sessionStorage.getItem('gradesMap')||{};
            _gradesMap= JSON.parse(allGradesMap)[sid]||[];
        }    
    }catch(ex){
    }
    const list=(includeAll? [...allTab,..._gradesMap]:_gradesMap).sort((a,b)=>a.displayOrder-b.displayOrder);
    return(list);
}
export function getStripeSchoolAccountId(sid=0){
    let id=undefined;
    if(sid===0){
        id=sessionStorage.getItem('stripeAccountIds');
    }else{        
        const obj=JSON.parse((sessionStorage.getItem('stripeAccountIds')||'')==''?[]:sessionStorage.getItem('stripeAccountIds'))||{};
        id=obj[sid];
    }
    return id;
}
export const getNotWorkingDays=(sid=0)=>{//nonSchoolDays
    const isRegular=isRegularLunchOrderType(sid);
    let nonSchoolDays=isRegular?regularNotWorkingDays:itemizeNotWorkingDays;
    try{
        if(sid==0){
            const _loggedInUserInfo =sessionStorage.getItem('loggedInUserInfo')||{};
            nonSchoolDays= JSON.parse(_loggedInUserInfo).nonSchoolDays||[];
        }else{
            const allGateways =sessionStorage.getItem('nonSchoolDays')||{};
            nonSchoolDays= JSON.parse(allGateways)[sid]||[];
        }
        return nonSchoolDays
    }catch(ex){
    }    
    return nonSchoolDays
}