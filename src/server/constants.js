export const env={dev:"Development",prod:"Production"}
export const ENVIRONMENT=env.dev //env.prod
export const BASE_URL = ENVIRONMENT===env.dev?'https://devapi.mealmanage.com':"https://api.mealmanage.com";
export const BASE_URL_2 = ENVIRONMENT===env.dev?'https://devapi.mealmanage.com/mealManage':"https://api.mealmanage.com/mealManage";
export const BASE_URL_1 = ENVIRONMENT===env.dev?'https://devapi.mealmanage.com/mealManage':"https://api.mealmanage.com/mealManage";
export const webURL=ENVIRONMENT===env.dev?"https://devapi.mealmanage.com/website":"https://api.mealmanage.com/website";
export const URL_VERSION='/v2';
//export const BASE_URL = 'http://DESKTOP-8QKFBMH:8296';
//export const BASE_URL_2 = 'http://DESKTOP-8QKFBMH:8296/mealManage';
//export const BASE_URL_1 = 'http://DESKTOP-8QKFBMH:8296/mealManage';
export const WEEKDAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const MONTH = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'];

export const grades = [{'K-6': ['K', 1, 2, 3, 4, 5, 6]}, {HS: [7, 8, 9, 10, 11, 12]}];
export const staffGrade='staff';
export const preSchoolGrades=['pk','k','kg'];
export const access_token = (function () {
    return sessionStorage.getItem('access_token');
});
export const currency_symbol = (function (sid=0) {
    let symb='$';
    try{
        if(sid===0){
            return sessionStorage.getItem('currency_symbol')
        }else{
            const obj=JSON.parse((sessionStorage.getItem('currency_symbol')||'')===''?[]:sessionStorage.getItem('currency_symbol'))||{};
            symb=obj[sid];
        }
    }catch(ex){
    }
    return symb;
});
export function getPageSizeForPrintByCountry(sid=0){
    let pageSize={};
    const pageSizeObj={
        'US':{w:'8.5in',h:'11in'},
        'ES':{w:'8.27in',h:'11.69in'},
        'IN':{w:'8.27in',h:'11.69in'},
        'GB':{w:'8.27in',h:'11.69in'},
        'ZA':{w:'8.27in',h:'11.69in'},
        'KR':{w:'8.27in',h:'11.69in'},
        'EG':{w:'8.27in',h:'11.69in'},
        '':{w:'8.5in',h:'11in'}
    }
    pageSize=pageSizeObj[sessionStorage.getItem('countryCode')||'']||{w:'8.5in',h:'11in'};
    try{        
        if(sid===0){
            return JSON.parse((sessionStorage.getItem('pageSize')||'')===''?pageSize:sessionStorage.getItem('pageSize'));
        }else{
            const obj=JSON.parse((sessionStorage.getItem('pageSize')||'')===''?[]:sessionStorage.getItem('pageSize'))||{};
            pageSize=obj[sid]||pageSize;
        }
    }catch(ex){
        return pageSize;
    }
  }
export const dial_code = (function (sid=0) {
    let symb='+1';
    try{
        if(sid===0){
            return sessionStorage.getItem('ISD_code')
        }else{
            const obj=JSON.parse((sessionStorage.getItem('ISD_code')||'')===''?[]:sessionStorage.getItem('ISD_code'))||{};
            symb=obj[sid];
        }
    }catch(ex){
    }
    return symb;
});
export const mobileNoLength = (function (sid=0) {
    let symb=10;
    try{
        if(sid===0){
            return parseInt(sessionStorage.getItem('phoneValidation'));
        }else{
            const obj=JSON.parse((sessionStorage.getItem('phoneValidation')||'')===''?[]:sessionStorage.getItem('phoneValidation'))||{};
            symb=parseInt(obj[sid]||10);
        }
    }catch(ex){
    }
    return symb;
});
export const date_format = (function (sid=0) {
    let format='yyyy/mm/dd';
    //let ccd=sessionStorage.getItem('country_code')
    try{
        if(sid===0){
            return sessionStorage.getItem('date_format').toUpperCase()
        }else{
            const obj=JSON.parse((sessionStorage.getItem('date_format').toUpperCase()||'')===''?[]:sessionStorage.getItem('date_format').toUpperCase())||{};
            format=obj[sid];
        }
    }catch(ex){
    }
    return format;
});
export const stripeInfo = (function (sid=0) {
    const stripeCurrencyinfo={
        'US':{currencyCode:'USD', transaction_Charge:2.9, transaction_Other_Charge:0.30, application_free:0.20, monetary_unit:100},
        'IN':{currencyCode:'INR', transaction_Charge:2.9, transaction_Other_Charge:0.30, application_free:0.20, monetary_unit:100},
        'EG':{currencyCode:'EUR', transaction_Charge:2.9, transaction_Other_Charge:0.30, application_free:0.20, monetary_unit:100},
    }
    let symb=undefined;
    try{
        if(sid===0){
            return stripeCurrencyinfo[sessionStorage.getItem('countryCode')]||{};
        }else{
            const obj=JSON.parse((sessionStorage.getItem('countryCode')||'')===''?[]:sessionStorage.getItem('countryCode'))||{};
            symb=stripeCurrencyinfo[obj[sid]];
        }
    }catch(ex){
    }
    return symb;
});
export const my_PUBLISHABLE_stripekey = ENVIRONMENT===env.dev? 'pk_test_G2WjXfugGRWasG1nXSgSwc0I':'pk_live_YDHrtrbdm940cWONI0BHARiQ';
//export const my_PUBLISHABLE_stripekey= 'pk_live_YDHrtrbdm940cWONI0BHARiQ'
export const domains = ['https://', 'http://', 'www.', 'devapp.', 'app.','.com'];
export const catererDomains=['devkitchen.','kitchen.'];
export const districtDomains=['devdistrict.','district.'];
export const transaction_Charge=2.9;
export const transaction_Other_Charge=0.30;
export const application_free=0.20;
export const nutritions={
    "calories": { display:'Calories *', tabindex:1,isRequired:true},
    "phosphorous":{ display:'Phosphorous (mg)', tabindex:11,isRequired:false},
    "pantothenicAcid":{ display:'Pantothenic Acid (mg)', tabindex:21,isRequired:false},
    "protein": { display:'Protein (g) *', tabindex:2,isRequired:true},
    "sodium": { display:'Sodium (mg)', tabindex:12,isRequired:false},
    "folate":{ display:'Folate (mcg)', tabindex:22,isRequired:false} ,
    "calcium":{ display:'Calcium (mg) *', tabindex:3,isRequired:true},
    "dietaryFiber": { display:'Dietary fiber (g)', tabindex:13,isRequired:false},
    "manganese":{ display:'Manganese (mg)', tabindex:23,isRequired:false} ,
    "potassium":{ display:'Potassium (mg) *', tabindex:4,isRequired:true},
    "vitaminA": { display:'Vitamin A (mcg)', tabindex:14,isRequired:false},
    "thiamin": { display:'Thiamin (mg)', tabindex:24,isRequired:false},
    "cholestral": { display:'Cholesterol (mg) *', tabindex:5,isRequired:true},
    "vitaminB6": { display:'Vitamin B6 (mg)', tabindex:15,isRequired:false},
    "niacin":{ display:'Niacin (mg)', tabindex:25,isRequired:false},
    "saturatedFat": { display:'Saturated Fat (g) *', tabindex:6,isRequired:true},
    "vitaminB12": { display:'Vitamin B12 (mcg)', tabindex:16,isRequired:false},
    "copper": { display:'Copper (mg)', tabindex:26,isRequired:false},
    "totalFat": { display:'Total Fat (g) *', tabindex:7,isRequired:true},
    "vitaminC": { display:'Vitamin C (mg)', tabindex:17,isRequired:false},
    "magnesium":{ display:'Magnesium (mg)', tabindex:27,isRequired:false},
    "totalCarbohydrate": { display:'Total Carbohydrates (g) *', tabindex:8,isRequired:true},
    "vitaminD": { display:'Vitamin D (mcg)', tabindex:18,isRequired:false},
    "riboFlavin": { display:'Riboflavin (mg)', tabindex:28,isRequired:false},
    "iron":{ display:'Iron (mg) *', tabindex:9,isRequired:true},
    "vitaminE": { display:'Vitamin E (mg)', tabindex:19,isRequired:false},
    "selenium":{ display:'Selenium (mcg)', tabindex:29,isRequired:false},
    "sugars":{ display:'Sugar (g) *', tabindex:10,isRequired:true},
    "vitaminK": { display:'Vitamin K (mcg)', tabindex:20,isRequired:false},
    "zinc": { display:'Zinc (mg)', tabindex:30,isRequired:false}
}
export const category={
    BREAKFAST:'Breakfast',
    MEAL:'Lunch',
    SNACK:'Snack',
}
export const menuTypeCalender={
    MONTHLY:'Monthly',
    WEEKLY:'Weekly',
    YEARLY:'Yearly'
}
export const MealTypes={
    meal:'MEAL',
    snack:'SNACK',
    breakfast:'BREAKFAST',
    side:'SIDE',
    extra:'EXTRA',
    holiday:'HOLIDAY'
}
export const MealTypesText={
    MEAL:'Main course',
    SNACK:'Snack',
    BREAKFAST:'Breakfast',
    SIDE:'Sides',
    EXTRA:'A La Carte ',
    HOLIDAY:'Holiday'
}
export const MealTypesTran={
    LUNCH:'Regular',
    EXTRA:'ALaCarte',
}

export const MealTypesReports={
    LUNCH:'Lunch',
    //ITEMIZE:'Itemized',
    SNACK:'Snack', 
    BREAKFAST:'Breakfast',    
}
export const RadioTypesReports={
    ALL:'All',
    FREE:'Free',
    REDUCED:'Reduced',       
}
export const MenuOrderTypes={
    REGULAR:'Regular',
    ITEMIZE:'Itemized'
}
export const paymentGatewayOptions={
    STRIPE:'Stripe',
    PAYMOB:'PayMob',
    ADDONPAY:'ADDONPAY'
}
export const paymentOptionValues=[100,250,500,1000];
export const itemizeNotWorkingDays=[5,6];
export const regularNotWorkingDays=[0,6];


//const AppContext = React.createContext();

//export const ProfileProvider = ProfileContext.Provider

//export const ProfilerConsumer = ProfileContext.Consumer



