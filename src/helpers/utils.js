import moment from 'moment';

export const isIterableArray = array => Array.isArray(array) && !!array.length;

//===============================
// Breakpoints
//===============================
export const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1540
};

//===============================
// Local Store
//===============================
export const getItemFromStore = (key, defaultValue, store = localStorage) =>
  JSON.parse(store.getItem(key)) || defaultValue;
export const setItemToStore = (key, payload, store = localStorage) => store.setItem(key, JSON.stringify(payload));
export const getStoreSpace = (store = localStorage) =>
  parseFloat((escape(encodeURIComponent(JSON.stringify(store))).length / (1024 * 1024)).toFixed(2));

  //===============================
// Session Store
//===============================
export const getItemFromSessionStore = (key, defaultValue, store = sessionStorage) =>
JSON.parse(store.getItem(key)) || defaultValue;
export const setItemToSessionStore = (key, payload, store = sessionStorage) => store.setItem(key, JSON.stringify(payload));
export const getStoreSessionSpace = (store = sessionStorage) =>
parseFloat((escape(encodeURIComponent(JSON.stringify(store))).length / (1024 * 1024)).toFixed(2));

//===============================
// Cookie
//===============================
export const getCookieValue = name => {
  const value = document.cookie.match('(^|[^;]+)\\s*' + name + '\\s*=\\s*([^;]+)');
  return value ? value.pop() : null;
};

export const createCookie = (name, value, cookieExpireTime) => {
  const date = new Date();
  date.setTime(date.getTime() + cookieExpireTime);
  const expires = '; expires=' + date.toUTCString();
  document.cookie = name + '=' + value + expires + '; path=/';
};

//===============================
// Moment
//===============================
export const getDuration = (startDate, endDate) => {
  if (!moment.isMoment(startDate)) throw new Error(`Start date must be a moment object, received ${typeof startDate}`);
  if (endDate && !moment.isMoment(endDate))
    throw new Error(`End date must be a moment object, received ${typeof startDate}`);

  return `${startDate.format('ll')} - ${endDate ? endDate.format('ll') : 'Present'} • ${startDate.from(
    endDate || moment(),
    true
  )}`;
};
//convert yearMonth to monthYear
export const convertToMonthYear = (yearMonth)=>{
  if(yearMonth){
    const year = yearMonth.substr(0,4)
    const month = yearMonth.substr(4,2)
    const monthYear = moment(yearMonth , 'YYYYMM').format("MMM YYYY")
    return monthYear
  }

  return ''
   
}
export const numberFormatter = (number, fixed = 2) => {
  // Nine Zeroes for Billions
  return Math.abs(Number(number)) >= 1.0e9
    ? (Math.abs(Number(number)) / 1.0e9).toFixed(fixed) + 'B'
    : // Six Zeroes for Millions
    Math.abs(Number(number)) >= 1.0e6
    ? (Math.abs(Number(number)) / 1.0e6).toFixed(fixed) + 'M'
    : // Three Zeroes for Thousands
    Math.abs(Number(number)) >= 1.0e3
    ? (Math.abs(Number(number)) / 1.0e3).toFixed(fixed) + 'K'
    : Math.abs(Number(number)).toFixed(fixed);
};

//===============================
// Colors
//===============================
export const hexToRgb = hexValue => {
  let hex;
  hexValue.indexOf('#') === 0 ? (hex = hexValue.substring(1)) : (hex = hexValue);
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
    hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b)
  );
  return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
};

export const rgbColor = (color = colors[0]) => `rgb(${hexToRgb(color)})`;
export const rgbaColor = (color = colors[0], alpha = 0.5) => `rgba(${hexToRgb(color)},${alpha})`;

export const colors = [
  '#2c7be5',
  '#00d97e',
  '#e63757',
  '#39afd1',
  '#fd7e14',
  '#02a8b5',
  '#727cf5',
  '#6b5eae',
  '#ff679b',
  '#f6c343'
];

export const themeColors = {
  primary: '#ea7066',
  secondary: '#748194',
  success: '#b5d56a',
  info: '#84bed6',
  warning: '#f0c24b',
  danger: '#ea7066',
  light: '#f9fafd',
  dark: '#0b1727'
};

export const grays = {
  white: '#fff',
  100: '#f9fafd',
  200: '#edf2f9',
  300: '#d8e2ef',
  400: '#b6c1d2',
  500: '#9da9bb',
  600: '#748194',
  700: '#5e6e82',
  800: '#4d5969',
  900: '#344050',
  1000: '#232e3c',
  1100: '#0b1727',
  black: '#000'
};

export const darkGrays = {
  white: '#fff',
  1100: '#f9fafd',
  1000: '#edf2f9',
  900: '#d8e2ef',
  800: '#b6c1d2',
  700: '#9da9bb',
  600: '#748194',
  500: '#5e6e82',
  400: '#4d5969',
  300: '#344050',
  200: '#232e3c',
  100: '#0b1727',
  black: '#000'
};

export const getGrays = isDark => (isDark ? darkGrays : grays);

export const rgbColors = colors.map(color => rgbColor(color));
export const rgbaColors = colors.map(color => rgbaColor(color));

//===============================
// Echarts
//===============================
export const getColor = (name, dom = document.documentElement) => {
  return getComputedStyle(dom).getPropertyValue(`--falcon-${name}`).trim();
};

export const getPosition = (pos, params, dom, rect, size) => ({
  top: pos[1] - size.contentSize[1] - 10,
  left: pos[0] - size.contentSize[0] / 2
});

//===============================
// E-Commerce
//===============================
export const calculateSale = (base, less = 0, fix = 2) => (base - base * (less / 100)).toFixed(fix);
export const getTotalPrice = (cart, baseItems) =>
  cart.reduce((accumulator, currentValue) => {
    const { id, quantity } = currentValue;
    const { price, sale } = baseItems.find(item => item.id === id);
    return accumulator + calculateSale(price, sale) * quantity;
  }, 0);

//===============================
// Helpers
//===============================
export const getPaginationArray = (totalSize, sizePerPage) => {
  const noOfPages = Math.ceil(totalSize / sizePerPage);
  const array = [];
  let pageNo = 1;
  while (pageNo <= noOfPages) {
    array.push(pageNo);
    pageNo = pageNo + 1;
  }
  return array;
};

export const capitalize = str => (str.charAt(0).toUpperCase() + str.slice(1)).replace(/-/g, ' ');

export const routesSlicer = ({ routes, columns = 3, rows }) => {
  const routesCollection = [];
  (routes||[]).map(route => {
    if (route.children) {
      return route.children.map(item => {
        if (item.children) {
          return routesCollection.push(...item.children);
        }
        return routesCollection.push(item);
      });
    }
    return routesCollection.push(route);
  });

  const totalRoutes = routesCollection.length;
  const calculatedRows = rows || Math.ceil(totalRoutes / columns);
  const routesChunks = [];
  for (let i = 0; i < totalRoutes; i += calculatedRows) {
    routesChunks.push(routesCollection.slice(i, i + calculatedRows));
  }
  return routesChunks;
};

export const getPageName = pageName => {
  return window.location.pathname.split('/').slice(-1)[0] === pageName;
};

export const copyToClipBoard = textFieldRef => {
  const textField = textFieldRef.current;
  textField.focus();
  textField.select();
  document.execCommand('copy');
};

export const menuTypeItems={
  'LUNCH':{text:'Lunch'},
  'BREAKFAST':{text:'Breakfast'},
  'SNACK':{text:'Snack'},
  /* 'DINNER':{text:'Dinner'} */
}
export const additionalMenuTypeItems={
  'SIDE':{text:'Side'},
  'EXTRA':{text:'A La Carte'}
}
export const additionalMenuType_MainCourse={
  'MAINCOURSE':{text:'Main Course'},
  'SIDE':{text:'Side'},
  'EXTRA':{text:'A La Carte'}
}
export const allMenuTypes=[
  {value:'MEAL',text:'Lunch'},
  {value:'BREAKFAST',text:'Breakfast'},
  {value:'SNACK',text:'Snack'},
  /* {value:'DINNER',text:'Dinner'}, */
  {value:'EXTRA',text:'A La Carte'},
  {value:'SIDE', text:'Side'}
  ];
export const CalenderViewOptions={
  'DAY':'Day',
  'WEEK':'Week',
  'MONTH':'Month',
}
export const paymentType={
  'Online':'Online',
  'Check':'Check',
  'Cash':'Cash',
  'CreditCard':'CreditCard'
}
export const nutritions={
  "calories": { display:'Calories *', tabindex:1, isRequired:true},
  "protein": { display:'Protein (g) *', tabindex:2, isRequired:true},
  "calcium":{ display:'Calcium (mg) *', tabindex:3, isRequired:true},
  "potassium":{ display:'Potassium (mg) *', tabindex:4, isRequired:true},
  "cholestral": { display:'Cholesterol (mg) *', tabindex:5, isRequired:true},
  "saturatedFat": { display:'Saturated Fat (g) *', tabindex:6, isRequired:true},
  "totalFat": { display:'Total Fat (g) *', tabindex:7, isRequired:true},
  "totalCarbohydrate": { display:'Total Carbohydrates (g) *', tabindex:8, isRequired:true},
  "iron":{ display:'Iron (mg) *', tabindex:9, isRequired:true},
  "sugars":{ display:'Sugar (g) *', tabindex:10, isRequired:true},
  "phosphorous":{ display:'Phosphorous (mg)', tabindex:11},
  "sodium": { display:'Sodium (mg)', tabindex:12},
  "dietaryFiber": { display:'Dietary fiber (g)', tabindex:13},
  "vitaminA": { display:'Vitamin A (mcg)', tabindex:14},
  "vitaminB6": { display:'Vitamin B6 (mg)', tabindex:15},
  "vitaminB12": { display:'Vitamin B12 (mcg)', tabindex:16},
  "vitaminC": { display:'Vitamin C (mg)', tabindex:17},
  "vitaminD": { display:'Vitamin D (mcg)', tabindex:18},
  "vitaminE": { display:'Vitamin E (mg)', tabindex:19},
  "vitaminK": { display:'Vitamin K (mcg)', tabindex:20},
  "pantothenicAcid":{ display:'Pantothenic Acid (mg)', tabindex:21},
  "folate":{ display:'Folate (mcg)', tabindex:22},
  "manganese":{ display:'Manganese (mg)', tabindex:23},
  "thiamin": { display:'Thiamin (mg)', tabindex:24},
  "niacin":{ display:'Niacin (mg)', tabindex:25},
  "copper": { display:'Copper (mg)', tabindex:26},
  "magnesium":{ display:'Magnesium (mg)', tabindex:27},
  "riboFlavin": { display:'Riboflavin (mg)', tabindex:28},
  "selenium":{ display:'Selenium (mcg)', tabindex:29},
  "zinc": { display:'Zinc (mg)', tabindex:30}
}
export const enumDateFilterOptions={
  'Today':{text:'Today',value:'td'},
  'Yesterday':{text:'Yesterday',value:'yd'},
  'ThisWeek':{text:'This Week',value:'tw'},
  'LastWeek':{text:'Last Week',value:'lw'},
  'ThisMonth':{text:'This Month',value:'tm'},
  'LastMonth':{text:'Last Month',value:'lm'},
  'ThisYear':{text:'This Year',value:'ty'}
}

export const groupBy=(list=[], props)=> {
  return list.reduce((a, b) => {
     (a[b[props]] = a[b[props]] || []).push(b);
     return a;
  }, {});
}
export const numberParce=(value)=>{
  try{
      const num=Number(value);
      return isNaN(num)?0:num;
  }catch(ex){
      return 0;
  }
}
export const showFile=(blob,fileName)=>{
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

export const getPageSizeForPrintByCountry=(countryCode)=>{
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
  pageSize=pageSizeObj[countryCode]||{w:'8.5in',h:'11in'};

  return pageSize;
}

export const getItemPriceTypes=()=>{
  const currentUser=getItemFromSessionStore('currentUser',{'authInfo':{},'otherInfo':{}});
  const {priceTypes}=currentUser.otherInfo;
  return priceTypes||[];
}

export const getSchoolID =(schoolName)=>{
  const currentUser=getItemFromSessionStore('currentUser',{'authInfo':{},'otherInfo':{}});
  const {schools}=currentUser.otherInfo;
  const schoolData = schools.find(item=>item.schoolName === schoolName) || {}
  return schoolData?.schoolId;
}
