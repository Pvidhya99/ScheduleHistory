import { useState } from "react";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import Cookies from "universal-cookie";
import { createCookie } from "../server/util";
import useServiceCalls from "./useServiceCalls";
import useUtil from "./useUtil";

const useDeviceRegister = ()=>{
    let history = useHistory();
    const {getSessionData} = useUtil()
    const [stateData,setStateData] = useState({
        loading: false,
        userName: "",
        cookies: new Cookies(),
        isCookie: false,
        validateDevResp: {},
        deviceId: '',
        otp: '',
        mobileNo:'',
        isOTPInpitShow: false,
        isEmailChecked: false,
        isMobileChecked: false
    })
    const [showRequestForm,setShowRequestForm ] = useState(true)
    const {post} = useServiceCalls()
    useEffect(()=>{
        let validateDevString = getSessionData('validateresp') === undefined ? '' : getSessionData('validateresp');
        let validateObj = (validateDevString === '' ? {} : JSON.parse(validateDevString));
        //let validateObj=this.props.validateresp;
        //console.log(validateObj);
        if (validateObj && Object.keys(validateObj).length !== 0) {
            setStateData({...stateData, validateDevResp: validateObj,deviceId: validateObj.deviceId});
        }
        else {
            history.push('/404')
           
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    const onChangeHandler = (e,type) =>{
        if(type !== "otp")
        setStateData({...stateData, [type] : e.target.checked})
        else
        setStateData({...stateData, [type] : e.target.value})
    }
    const sendOTP =async ()=>{
        try{
            let reqObj = {};
            reqObj.username = getSessionData('loggedInUserInfo');
            reqObj.otpOn = (stateData.isEmailChecked && stateData.isMobileChecked) ? 'both' : stateData.isEmailChecked ? 'email' : stateData.isMobileChecked ? 'mobile' : '';
            reqObj.parentMobile = (stateData.isMobileChecked) ? (stateData.validateDevResp.mobileNumber == null) ? stateData.mobileNo : '':'';
            const res = await post("/generateOTP",reqObj)
           // console.log(res)
            setShowRequestForm(false)
        }catch(error){
            console.log(error)
        }
        
        
    }
    const onValidateOTP = async (e) => {
        try{
            e.preventDefault();
        
            if (stateData.otp.length > 0) {
    
                let reqObj = {
                    "username": getSessionData('loggedInUserInfo'),
                    "otp": stateData.otp,
                    "deviceId": stateData.deviceId,
                    "fToken": getSessionData('ftoken'),
                    "deviceIP": "47.12.11.00"
                };
               
                await post('/validateOTP',reqObj)
                createCookie('parent', JSON.stringify({
                    'token': getSessionData('ftoken'),
                    'email': getSessionData('loggedInUserInfo')
                }), 300);
                history.push('/parent')
    
            }
        }catch(err){
            history.push('/parent')
        }
       
    }

    return {
        sendOTP,
        onChangeHandler,
        stateData,
        showRequestForm,
        onValidateOTP
    }
}

export default useDeviceRegister