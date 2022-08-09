export const getLoginCatererInfo=()=>{
    try{
        const _loggedInUserInfo = JSON.parse(sessionStorage.getItem('loggedInUserDetails')||{});
        return _loggedInUserInfo;
    }catch(ex){
        return {}
    }
}