export const getLoginDistrictInfo=()=>{
    try{
        const _loggedInUserInfo = JSON.parse(sessionStorage.getItem('loggedInUserDetails')||{});
        return _loggedInUserInfo;
    }catch(ex){
        return {}
    }
}
export const dial_code = () =>{
    let symb='+1';
    const userInfo=getLoginDistrictInfo()
    try{
        return userInfo.isdCode||symb;
    }catch(ex){
    }
    return symb;
};
export const mobileNoLength = ()=> {
    let symb=10;
    try{
        const userInfo=getLoginDistrictInfo()
            return userInfo.phoneValidation||symb;
       
    }catch(ex){
    }
    return symb;
};