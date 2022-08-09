import { MealTypes,MealTypesTran, MenuOrderTypes,MealTypesReports,RadioTypesReports } from "../../../server/constants";
import {getAccessLevelByModule,getModuleEnum} from '../../../server/util';
const ActionEnum={
  CREATE:'CREATE',
  ORDER:'ORDER',
  VIEW:'VIEW',
  TRANSACTION:'TRANSACTION',
  CATERER:'CATERER'
}
const modEnum=getModuleEnum();

const visibleMenuOption=(type,sid=0,action)=>{
  if(ActionEnum.TRANSACTION==action){
    if((type==MealTypes.LUNCH || type==MealTypes.BREAKFAST || type==MealTypes.SNACK) 
    && sessionStorage.getItem('ROLE')=='ROLE_ADMIN' && isMenuCreationActive(type,sid)){
      return true
    }
    if(type==MealTypes.LUNCH){
      return (getAccessLevelByModule(modEnum.LMCI,sid) || getAccessLevelByModule(modEnum.LMCU,sid) )?true:false;
    }
    if(type==MealTypes.BREAKFAST){
      return (getAccessLevelByModule(modEnum.BMCI,sid) || getAccessLevelByModule(modEnum.BMCU,sid))?true:false;
    }
    if(type==MealTypes.SNACK){
      return (getAccessLevelByModule(modEnum.SMCI,sid) || getAccessLevelByModule(modEnum.SMCU,sid))?true:false;
    }

    if(type==MealTypesReports.LUNCH){
      return (getAccessLevelByModule(modEnum.LMCI,sid) || getAccessLevelByModule(modEnum.LMCU,sid))?true:false;
    }
    if(type==MealTypesReports.BREAKFAST){
      return (getAccessLevelByModule(modEnum.BMCI,sid) || getAccessLevelByModule(modEnum.BMCU,sid))?true:false;
    }
    if(type==MealTypesReports.SNACK){
      return (getAccessLevelByModule(modEnum.SMCI,sid) || getAccessLevelByModule(modEnum.SMCU,sid))?true:false;
    }
  }else if(ActionEnum.ORDER==action){
    if((type==MealTypes.LUNCH || type==MealTypes.BREAKFAST || type==MealTypes.SNACK) 
    && sessionStorage.getItem('ROLE')=='ROLE_ADMIN' && isMenuCreationActive(type,sid)){
      return true
    }
      if(type==MealTypes.LUNCH){
        return (getAccessLevelByModule(modEnum.LOM,sid))?true:false;
      }
      if(type==MealTypes.BREAKFAST){
        return (getAccessLevelByModule(modEnum.BOM,sid))?true:false;
      }
      if(type==MealTypes.SNACK){
        return (getAccessLevelByModule(modEnum.SOM,sid))?true:false;
      }
  
      if(type==MealTypesReports.LUNCH){
        return (getAccessLevelByModule(modEnum.LOM,sid))?true:false;
      }
      if(type==MealTypesReports.BREAKFAST){
        return (getAccessLevelByModule(modEnum.BOM,sid))?true:false;
      }
      if(type==MealTypesReports.SNACK){
        return (getAccessLevelByModule(modEnum.SOM,sid))?true:false;
      }

  }else if(ActionEnum.VIEW==action){
    if((type==MealTypes.LUNCH || type==MealTypes.BREAKFAST || type==MealTypes.SNACK) 
    && sessionStorage.getItem('ROLE')=='ROLE_ADMIN' && isMenuCreationActive(type,sid)){
      return true
    }
    if(type==MealTypes.LUNCH){
      return (getAccessLevelByModule(modEnum.VLM,sid))?true:false;
    }
    if(type==MealTypes.BREAKFAST){
      return (getAccessLevelByModule(modEnum.VBM,sid))?true:false;
    }
    if(type==MealTypes.SNACK){
      return (getAccessLevelByModule(modEnum.VSM,sid))?true:false;
    }

    if(type==MealTypesReports.LUNCH){
      return (getAccessLevelByModule(modEnum.VLM,sid))?true:false;
    }
    if(type==MealTypesReports.BREAKFAST){
      return (getAccessLevelByModule(modEnum.VBM,sid))?true:false;
    }
    if(type==MealTypesReports.SNACK){
      return (getAccessLevelByModule(modEnum.VSM,sid))?true:false;
    }

}else if(ActionEnum.CREATE==action){
  if((type==MealTypes.LUNCH || type==MealTypes.BREAKFAST || type==MealTypes.SNACK) 
  && sessionStorage.getItem('ROLE')=='ROLE_ADMIN' && isMenuCreationActive(type,sid)){
    return true
  }  
    if(type==MealTypes.LUNCH){
      return (getAccessLevelByModule(modEnum.LMCU,sid) || getAccessLevelByModule(modEnum.LMCI,sid))?true:false;
    }
    if(type==MealTypes.BREAKFAST){
      return (getAccessLevelByModule(modEnum.BMCU,sid) || getAccessLevelByModule(modEnum.BMCI,sid))?true:false;
    }
    if(type==MealTypes.SNACK){
      return (getAccessLevelByModule(modEnum.SMCU,sid) || getAccessLevelByModule(modEnum.SMCI,sid))?true:false;
    }

    if(type==MealTypesReports.LUNCH){
      return (getAccessLevelByModule(modEnum.LMCU,sid) || getAccessLevelByModule(modEnum.LMCI,sid))?true:false;
    }
    if(type==MealTypesReports.BREAKFAST){
      return (getAccessLevelByModule(modEnum.BMCU,sid) || getAccessLevelByModule(modEnum.BMCI,sid))?true:false;
    }
    if(type==MealTypesReports.SNACK){
      return (getAccessLevelByModule(modEnum.SMCU,sid) || getAccessLevelByModule(modEnum.SMCI,sid))?true:false;
    }
  }else if(ActionEnum.CATERER==action){
    return true;
  }else{
    if((type==MealTypes.LUNCH || type==MealTypes.BREAKFAST || type==MealTypes.SNACK) 
    && sessionStorage.getItem('ROLE')=='ROLE_ADMIN' && isMenuCreationActive(type,sid)){
      return true
    }
    if(type==MealTypes.LUNCH){
      return (getAccessLevelByModule(modEnum.LMCU,sid) || getAccessLevelByModule(modEnum.LMCI,sid))?true:false;
    }
    if(type==MealTypes.BREAKFAST){
      return (getAccessLevelByModule(modEnum.BMCU,sid) || getAccessLevelByModule(modEnum.BMCI,sid))?true:false;
    }
    if(type==MealTypes.SNACK){
      return (getAccessLevelByModule(modEnum.SMCU,sid) || getAccessLevelByModule(modEnum.SMCI,sid))?true:false;
    }

    if(type==MealTypesReports.LUNCH){
      return (getAccessLevelByModule(modEnum.LMCU,sid) || getAccessLevelByModule(modEnum.LMCI,sid))?true:false;
    }
    if(type==MealTypesReports.BREAKFAST){
      return (getAccessLevelByModule(modEnum.BMCU,sid) || getAccessLevelByModule(modEnum.BMCI,sid))?true:false;
    }
    if(type==MealTypesReports.SNACK){
      return (getAccessLevelByModule(modEnum.SMCU,sid) || getAccessLevelByModule(modEnum.SMCI,sid))?true:false;
    }
  }
}
const isMenuCreationActive=(type,sid=0)=>{
  
  if(type==MealTypes.LUNCH){
    return (getAccessLevelByModule(modEnum.LMCU,sid) || getAccessLevelByModule(modEnum.LMCI,sid))?true:false;
  }
  if(type==MealTypes.BREAKFAST){
    return (getAccessLevelByModule(modEnum.BMCU,sid) || getAccessLevelByModule(modEnum.BMCI,sid))?true:false;
  }
  if(type==MealTypes.SNACK){
    return (getAccessLevelByModule(modEnum.SMCU,sid) || getAccessLevelByModule(modEnum.SMCI,sid))?true:false;
  }
  if(type==MealTypesReports.LUNCH){
    return (getAccessLevelByModule(modEnum.LMCU,sid) || getAccessLevelByModule(modEnum.LMCI,sid))?true:false;
  }
  if(type==MealTypesReports.BREAKFAST){
    return (getAccessLevelByModule(modEnum.BMCU,sid) || getAccessLevelByModule(modEnum.BMCI,sid))?true:false;
  }
  if(type==MealTypesReports.SNACK){
    return (getAccessLevelByModule(modEnum.SMCU,sid) || getAccessLevelByModule(modEnum.SMCI,sid))?true:false;
  }
  return false
}
export const getTransactionOptions=(sid=0)=>{
  let list=[];
    Object.keys(MealTypes).forEach((type)=>{
        if(visibleMenuOption(MealTypes[type],sid, ActionEnum.TRANSACTION)){
            list.push(MealTypes[type]);
        }
    })
    return list;
}
export const getMenuOptions=(sid=0)=>{
    let list=[];
    Object.keys(MealTypes).forEach((type)=>{
        if(visibleMenuOption(MealTypes[type],sid)){
            list.push(MealTypes[type]);
        }
    })
    return list;
}
export const getOrderMenuOptions=(sid=0)=>{
  let list=[];
    Object.keys(MealTypes).forEach((type)=>{
        if(visibleMenuOption(MealTypes[type],sid, ActionEnum.ORDER)){
            list.push(MealTypes[type]);
        }
    })
    return list;
}
export const getViewMenuOptions=(sid=0)=>{
  let list=[];
    Object.keys(MealTypes).forEach((type)=>{
        if(visibleMenuOption(MealTypes[type],sid, ActionEnum.VIEW)){
            list.push(MealTypes[type]);
        }
    })
    return list;
}
export const getCreateMenuOptions=(sid=0)=>{
  let list=[];
    Object.keys(MealTypes).forEach((type)=>{
        if(visibleMenuOption(MealTypes[type],sid, ActionEnum.CREATE)){
            list.push(MealTypes[type]);
        }
    })
    return list;
}
export const getCatererMenuOptions=(sid=0)=>{
  let list=[];
  let excludeList=[MealTypes.EXTRA];
    Object.keys(MealTypes).forEach((type)=>{
        if(visibleMenuOption(MealTypes[type],sid, ActionEnum.CATERER)){
            if(!excludeList.includes(MealTypes[type])){
              list.push(MealTypes[type]);
            } 
        }
    })
    return list;
}
export const getReportMenuOptions=(sid=0)=>{
  let reportList=[];
  Object.keys(MealTypesReports).forEach((type)=>{
      if(visibleMenuOption(MealTypesReports[type],sid,ActionEnum.ORDER)){
        reportList.push(MealTypesReports[type]);
      }
  })
  return reportList;
}
export const getRedioMenuOptions=()=>{   
  let radioList=[];
  Object.keys(RadioTypesReports).forEach((type)=>{
      if(visibleMenuOption(RadioTypesReports[type])){
        radioList.push(RadioTypesReports[type]);
      }
  })
  return radioList;
}