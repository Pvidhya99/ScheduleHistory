import React, { Component, Fragment } from 'react';
import PayMobService from './payMobService';
import './paymob.css';
import {calculatePaymobCharges} from "../../../server/util";
class PaymobPay extends Component {
    constructor(props){
        super(props);
        this.state={
            paymentToken:'',
            progress:true
        }
    }
    componentWillMount=()=>{
        this.getAuthToken();
    }
    getAuthToken=()=>{
        const {apiKey}= this.props;
        this.setState({progress:true})
        const _payMobService=new PayMobService();
        _payMobService.authenticationRequest(apiKey)
        .then(response => {
            if(response.ok){
            return response.json();
        }else{
            throw(response);
            }
        })
        .then(result => {
            this.registerOrder(result.token);          
        })
        .catch(error => {
            this.setState({progress:false});
          console.error('Error:', error);
        })
    }
    registerOrder=(token)=>{
        const _payMobService=new PayMobService();
        const amount_cents= ((!this.props.paymentObj?0.00:( parseFloat(this.props.paymentObj.balAmount)+calculatePaymobCharges(parseFloat(this.props.paymentObj.balAmount))))*100);
        let itemList=[];
        ((this.props.paymentObj||{}).studentWiseTransactions||[]).map((s)=>{  
            if(s.transactionAmount>0) {
                itemList.push({
                    name:s.name,
                    description:s.studentRecId,
                    amount_cents:parseFloat(s.transactionAmount)*100,
                    quantity: "1"
                    });
            }           
        });
        const reqObject={
            auth_token:token,
            delivery_needed: "false",
            amount_cents:amount_cents,
            currency: "EGP",
            items:itemList
        }
        _payMobService.orderRegistration(reqObject)
        .then(response => {
            if(response.ok){
            return response.json();
        }else{
            throw(response);
            }
        })
        .then(result => {
            this.requestPaymentKey(result,token);          
        })
        .catch(error => {
            this.setState({progress:false})
          console.error('Error:', error);
        })
    }
    requestPaymentKey=(result,token)=>{
        const _payMobService=new PayMobService();
        const {userInfo, integrationId}=this.props
        const reqObject={
            auth_token:token,
            amount_cents:result.amount_cents,
            expiration:3600,
            order_id:result.id,
            billing_data:{
                "apartment": "NA", 
                "email": (userInfo||{}).parent||'', 
                "floor": "NA", 
                "first_name": (userInfo||{}).parent||'', 
                "street": "NA", 
                "building": "NA", 
                "phone_number": "NA", 
                "shipping_method": "NA", 
                "postal_code": "NA", 
                "city": "NA", 
                "country": "NA", 
                "last_name": (userInfo||{}).parent||'', 
                "state": "NA"
            },
            currency:result.currency,
            integration_id:integrationId,
            lock_order_when_paid: "false"
        } 
        _payMobService.paymentKeyRequest(reqObject)
        .then(response => {
            if(response.ok){
            return response.json();
        }else{
            throw(response);
            }
        })
        .then(result => {
            this.setState({paymentToken:result.token, progress:false})                      
        })
        .catch(error => {
            this.setState({progress:false})
          console.error('Error:', error);
        })
    }

    render() {
        const {progress}=this.state;
        return (
            <Fragment>
            {
                progress && <div className="payLoader">
                                <div className="payLoaderText"></div>
                            </div>
            }
               {
                (this.props.iframeUrl||'')!=='' && (this.state.paymentToken||'')!=='' &&
                <iframe 
                    src={this.props.iframeUrl+this.state.paymentToken} 
                    style={{ right: 0, left: 0,width:'100%', height:'390px', border:'0px'}}>
                </iframe> 

               }        
            </Fragment>
        );
    }
}

export default PaymobPay;