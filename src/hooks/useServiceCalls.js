import client from "../helpers/axiosConfig";
//import { useNavigate } from 'react-router-dom'

const useServiceCalls = ()=>{
    //const navigate = useNavigate()
   // console.log("custom hook to get the data from services...")

    const redirectToLogin=()=>{
        //window.sessionStorage.removeItem('token')
        //navigate("/")
    }
    const get = async (URL,isHeaderRequired=true)=>{
        try {
            const updatedURL = appendAccessTokenToURL(URL)
            const response = await client.get(updatedURL);
            return response
        } catch (err) {
            console.log(err)
            if (err.response) {
                // client received an error response (5xx, 4xx)
               if(err.response.status === 401){
                    redirectToLogin()
                }
               console.log("error in api call")
              } else if (err.request) {
                // client never received a response, or request never left
                console.log("request failed and no response ")
              } else {
                // anything else
                console.log("request failed due to slow network")
        
              }
            
             

            throw err
        }

    }
    const post = async (URL,requestBody,isHeaderRequired=true)=>{
        try {
            //console.log("post method calling....")
            const updatedURL = appendAccessTokenToURL(URL)
           
            const response = await client.post(updatedURL,requestBody);
            return response
           
        } catch (error) {
            if(error.response.status === 401){
                redirectToLogin()
            }
            throw error
        }

    }
    const put = async (URL,requestBody)=>{
        try {
           // console.log("put method calling....")
            const updatedURL = appendAccessTokenToURL(URL)
            const response = await client.put(updatedURL,requestBody);
            return response
           
        } catch (error) {
            if(error.response.status === 401){
                redirectToLogin()
            }
            throw error
        }

    }
    const patch = async (URL,requestBody)=>{
        try {
            //console.log("put method calling....")
            const updatedURL = appendAccessTokenToURL(URL)
            const response = await client.patch(updatedURL,requestBody);
            return response
           
        } catch (error) {
            if(error.response.status === 401){
                redirectToLogin()
            }
            throw error
        }

    }
    const appendAccessTokenToURL = (url)=>{
        const token = window.sessionStorage.getItem('access_token') 
        if(url.includes("?")){
            return url+"&access_token="+token
        }else{
            return url+"?access_token="+token
        }

    }
    

    return {get,post,put,patch}



}
export default useServiceCalls