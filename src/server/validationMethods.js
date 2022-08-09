import React from 'react';
import validator from 'validator';

export const required = (value,props) => {
    if (typeof value === 'undefined' || value === null) {
      return <span className="text-danger">{props.requiredmsg}</span>
    }
    else if(!value.toString().trim().length){
      return <span className="text-danger">{props.requiredmsg}</span>
    }
  };
  export const requiredSelect = (value,props) => {
    if (typeof value === 'undefined' || value === null) {
      return <span className="error">Please select {props.name}</span>
    }
      if (!value.toString().trim().length) {
        // We can return string or jsx as the 'error' prop for the validated Component
        return <span className="error">Please select {props.name}</span>
      }
  };
  export const phoneNo = (value, props) => {
    // get the maxLength from component's props
    if ( value  !==undefined  && value !== null && ((value.toString().trim().length < props.maxLength) || (value.toString().trim().length > props.maxLength))) {
      // Return jsx
      return <span className="text-danger">Invalid phone number.</span>
    }
  };
  export const email = (value,props) => {
    if (value  !==undefined  && value !== null && value !== '' && !validator.isEmail(value)) {
      return <span className="text-danger">Please enter valid email.</span>
    }
  };
  export const phone = (value,props) => {
    if ( value  !==undefined   && value !== null && !(validator.isMobilePhone(value,'en-US'))) {
      return <span className="text-danger">Please enter valid phone.</span>
    }
  };
  export const zipValidation = (value,props) => {
    if (value  !==undefined && value !== null && !(validator.isPostalCode(value,'US')) ) {
      return <span className="text-danger">Please enter valid zip code.</span>
    }
  };
  export const isAlphanumeric = (value,props) => {
    if (value  !==undefined && value !== null && !(validator.isAlphanumeric(value,'en-US')) ) {
      return <span className="text-danger">Please enter Alpha Numeric Only.</span>
    }
  };
  export const isNumeric = (value,props) => {
    if (value  !=='' && value  !==undefined && value !== null ) {
      if(!(validator.isNumeric(value.toString()))){
          return <span className="text-danger">Please enter Numeric Only.</span>
        }
    }
  };
  export const vinValidate = (vin,props) => {
    if (vin  !=='' && vin  !==undefined && vin !== null) {
     // let regIsAlphaNumaric = /^([a-zA-Z0-9_-]){17,17}$/;
     // if(!regIsAlphaNumaric.test(value)){
     //   return <span className="text-danger">VIN should be 17 alphanumeric characters.</span>
     // }
     if (vin == "11111111111111111") { return <span className="text-danger">VIN should be 17 alphanumeric characters.</span>; }
    
     if (!vin.match("^([0-9a-hj-npr-zA-HJ-NPR-Z]{10,17})+$")) { return <span className="text-danger">VIN should be 17 alphanumeric characters.</span>;}
     
     var letters = [{ k: "A", v: 1 }, { k: "B", v: 2 }, { k: "C", v: 3 },
     { k: "D", v: 4 }, { k: "E", v: 5 }, { k: "F", v: 6 }, { k: "G", v: 7 },
     { k: "H", v: 8 }, { k: "J", v: 1 }, { k: "K", v: 2 }, { k: "L", v: 3 },
     { k: "M", v: 4 }, { k: "N", v: 5 }, { k: "P", v: 7 }, { k: "R", v: 9 },
     { k: "S", v: 2 }, { k: "T", v: 3 }, { k: "U", v: 4 }, { k: "V", v: 5 },
     { k: "W", v: 6 }, { k: "X", v: 7 }, { k: "Y", v: 8 }, { k: "Z", v: 9 }];
     var weights = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];
     var exclude = ["I", "O", "Q"];
     var val = 0;
     for (var idx = 0; idx < vin.length; idx++) {
         var item = vin.charAt(idx).toUpperCase();
         if (exclude.includes(function (x) { return x == item; })) { return <span className="text-danger">VIN should be 17 alphanumeric characters.</span>; }
     
         var pos = (item.match("^[0-9]+$") != null) ? parseInt(item) : letters.filter(function (letter) { return letter.k == item; })[0].v;
         val += (pos * weights[idx]);
     }
     var checksum = (val % 11);
    if(!(vin.charAt(8) == (checksum < 10 ? checksum.toString() : "X"))){
     return <span className="text-danger">VIN should be 17 alphanumeric characters.</span>
    };

    }
  };
  export const isYear = (value,props) => {
    if( value  !=='' && value  !==undefined && value !== null ){
      let regIsYear = /^\d{4}$/;
      if(!regIsYear.test(value)){
        return <span className="text-danger">Year should be 4 digits.</span>
      }
    }
  };
  export const isMileage = (value,props) => {
    if( value  !=='' && value  !==undefined && value !== null ){
      if(value.length > 8){
        return <span className="text-danger">Max. length should be 8 digits.</span>
      }else{
      let regIsYear = /^[0-9]*$/;
      if(!regIsYear.test(value)){
          return <span className="text-danger">Please enter Digits Only.</span>  
      }
    }
    }
  };
  export const isGreaterOrEqual = (value,props) => {
    if( value  !=='' && value  !==undefined && value !== null ){
      if(parseInt(value) < parseInt(props.compareTo)){
        return <span className="text-danger">{props.comparemsg}</span>
      }
    }
  }
  export const isDecimal = (value,props) => {
    if (value  !=='' && value  !==undefined && value !== null ) {
      let regDec = /(?:\d*\.\d{1,2}|\d+)$/;
      if(!regDec.test(value)){
      return <span className="text-danger">{props.errormsg}</span>
      }
    }
  };
  export const toInt = (value,props) => {
    if (value  !=='' && value  !==undefined && value !== null && !(validator.toInt(value)) ) {
      return <span className="text-danger">Please enter integer values Only.</span>
    }
  };

  export const isValidForm=(formObj)=>{
    let inValidCount=0;
    Object.keys( formObj.state.byId).map(item=>{
      if( Object.keys( formObj.state.byId[item].error||{}).length>0)
      inValidCount++;
  });
  return inValidCount<=0?true:false;
  }
  export const isLenghtOf=(value,props)=>{
    if( value  !=='' && value  !==undefined && value !== null ){
      if(value.length !== props.length){
        return <span className="text-danger">{props.lengthofmsg}</span>
      }
    }
  }