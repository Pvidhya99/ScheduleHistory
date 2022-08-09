import React from 'react'
import { withRouter } from "react-router";
import Fingerprint from 'fingerprintjs';
import {getAccessToken, validateParentAccount} from "../server/actionsParent";
import {createCookie, getCookie} from '../server/util';
import { useEffect } from 'react';
import useUtil from '../hooks/useUtil';

const ActiveParent = ({history})=>{
    // const [stateData,setStateData] = useState({ userName: "",
    //                                     logInUserRole: "",
    //                                     login_user: "",
    //                                     cookies: new Cookies(),
    //                                     isCookie: false,
    //                                     studentsList: []
    //                                     })
    const {setSessionData,removeSessionData} = useUtil()
    useEffect(()=>{
        validateUrl()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    const validateUrl = () => {
        let queryString = window.location.search;

        var token = '';
        var parentEmail = '';
        if (queryString.length > 0) {
            // eslint-disable-next-line
            token = decodeURIComponent(queryString.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent('token').replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
            // eslint-disable-next-line
            parentEmail = decodeURIComponent(queryString.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent('parentId').replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
            if ((token === undefined ? '' : token) === '' || (parentEmail === undefined ? '' : token) === '') {
                //this.context.router.history.push('/404')
                return false;
            }
        }
        else {
            // const cookies = new Cookies();
            let cookieData = getCookie('parent')
            const cookieObj = cookieData === '' ? undefined : (JSON.parse(cookieData) || undefined);
            if (cookieObj === undefined) {
               // this.context.router.history.push('/404')
                return false;
            }
            token = cookieObj.token;
            parentEmail = cookieObj.email;
            //console.log(cookieObj);
        }
        setSessionData('ftoken', token);
        setSessionData('loggedInUserInfo', parentEmail);
        setSessionData('ROLE', 'ROLE_PARENT');
        let fp = new Fingerprint({
            canvas: true,
            ie_activex: true,
            screen_resolution: true
        });
        let reqBody = {
            'username': parentEmail,
            'fToken': token,
            'deviceId': fp.get()
        };
        removeSessionData('validateresp');

        if (queryString.length > 0) {
            //alert(JSON.stringify(reqBody,null,2))
            validateParentAccount(reqBody).then((response) => {
                if (!response.ok) {
                    //toast.error('Invalid email/token');
                   // _addNotificationError('Invalid email/token', this);
                    throw Error(response.message);
                }
                return response.json();
            }).then((data) => {
                generateAccessToken(reqBody.username, reqBody.fToken, reqBody.deviceId, data);
            })
                .catch(
                    (error) => {
                        console.log('Parent dashboard error', error);
                        //this.context.router.history.push('/404')
                        return false;
                    }
                );
        } else {
            generateAccessToken(reqBody.username, reqBody.fToken, reqBody.deviceId, undefined);
        }
    }

    const generateAccessToken = (uname, ftoken, devId, valDevResp) =>{

        getAccessToken(uname, ftoken).then((response) => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            //console.log('response', response);
            // this.setToken(response.token); // Setting the token in sessionStorage
            return response.json();
        }).then(respData => {
            setSessionData('access_token', respData.access_token);
            setSessionData('refresh_token', respData.refresh_token);

            if ((valDevResp === undefined ? '' : valDevResp.status) === 'Device not registered') {
                valDevResp.deviceId = devId;
                setSessionData('validateresp', JSON.stringify(valDevResp));
               // validateParent(valDevResp);
               // toast.error('Please register your device');
                //this.context.router.history.push('/deviceRegister')
                history.push('/deviceRegister');
                //return true;

            }
            else {
                /* const cookies = new Cookies();
                let expDate=new Date().setFullYear(new Date().getFullYear()+10)
                cookies.set('parent', JSON.stringify({'token':sessionStorage.getItem('ftoken'),'email':sessionStorage.getItem('loggedInUserInfo')}),
                 { path: '/' }); */
                createCookie('parent', JSON.stringify({'token': ftoken, 'email': uname}), 300);
                //this.context.router.history.push('/parent')
                history.push('/parent');
                return true;


            }
        }).catch(
            (error) => {
                // alert("came here");
                // window.location.replace('/404');
                return false;
            }
        );

    }


    return(
        <div>
            Active parent....
        </div>
    )
}

export default withRouter(ActiveParent)