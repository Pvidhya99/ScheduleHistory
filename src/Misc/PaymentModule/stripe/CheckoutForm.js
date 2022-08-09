import React from 'react';
import {CardElement, injectStripe, CardNumberElement, CardCVCElement, CardExpiryElement} from 'react-stripe-elements';
import {calculateStripeCharges, _addNotification, _addNotificationError, getPaymentGatewayCharges} from '../../../server/util';
import {stripeInfo, currency_symbol, application_free} from '../../../server/constants';
import {get, postWithHeaders} from '../../../server/actions'
import './checkout.css';
const createOptions = (fontSize, padding) => {
  return {
    style: {
      base: {
        fontSize,
        color: '#424770',
        letterSpacing: '0.025em',
        fontFamily: 'Source Code Pro, monospace',
        '::placeholder': {
          color: '#aab7c4',
        },
        padding,
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };
};
class CheckoutForm extends React.Component {
  constructor(props){
    super(props);
    this.state={
      loading:false
    }
  }

   pay =  (ev) => {
    const {paymentObj, schoolName, logoUrl,schoolId, excludeCharges, disabled, userInfo, paymentDesc, studentData} =this.props;
    const _stripeInfo=stripeInfo(schoolId);
    const amt= ((paymentObj===undefined?0.00:( parseFloat(paymentObj.balAmount)+ (excludeCharges?0:calculateStripeCharges(parseFloat(paymentObj.balAmount),undefined,schoolId)))));
    const amount= ((paymentObj===undefined?0.00:( parseFloat(paymentObj.balAmount)+ (excludeCharges?0:calculateStripeCharges(parseFloat(paymentObj.balAmount),undefined,schoolId))))*(_stripeInfo.monetary_unit));
    const onlyAmt=(paymentObj===undefined?0.00:( parseFloat(paymentObj.balAmount)));
    ev.preventDefault();    
    const cardElement = this.props.elements.getElement('card');
    const frmCtrlsEmpty=ev.target.getElementsByClassName('StripeElement--empty')
    if(frmCtrlsEmpty.length>0){
      this.props.onValidationError('please fill all fields.');
      return false;
    }
    const frmCtrolInvalid=ev.target.getElementsByClassName('StripeElement--invalid');
    if(frmCtrolInvalid.length>0){
      this.props.onValidationError('please enter valid data.');
      return false;
    }
    try {
      this.setState({loading:true});
      const _url=`/transactions/generatePaySecretCode/${schoolId}?access_token=`;
      let headers = {
        'Content-Type': 'application/json'
    };
    const reqObj={
      "totalTransactionAmount": onlyAmt,
      "transactionFees": getPaymentGatewayCharges(schoolId,parseFloat(onlyAmt),false),
      "appFeeAmount": application_free
    };    
    if(paymentDesc=="LUNCH_BAL"){
      reqObj.trxDesc='Add Lunch Balance';
      const stdInfo={};
      paymentObj.studentWiseTransactions.map((s)=>{  
        if(s.transactionAmount>0) {
          stdInfo[s.studentRecId]=s.transactionAmount; 
        }         
      }); 
      reqObj.stdInfo=stdInfo;
    }else if(paymentDesc=="ORDER_PAY"){
      reqObj.trxDesc='Instant Payment For Orders';
      const stdInfo={}; 
      stdInfo[studentData.studentRecId] = amt;
      reqObj.stdInfo=stdInfo;  
    }else if(paymentDesc=="BCAC_PAY"){
      reqObj.trxDesc='BCAC Payment';
      const stdInfo={};
      (paymentObj.subscriptionsTrxByStds||[]).map(item=>{
        stdInfo[item.studentUser.userId] = item.paidAmt;
      });      
      reqObj.stdInfo=stdInfo;
    }else if (paymentDesc=="EVENT_PAY"){
       reqObj.trxDesc='Event Payment';
      const stdInfo={};      
    }
    postWithHeaders(_url,JSON.stringify(reqObj),headers)
      .then(response=>{
        return response.json();
      }).then(_data=>{
        if(_data.statusCode===200){
          const data = _data;
          const clientSecret=data.summary;
          //const clientSecret=data.clientSecret;
          this.props.stripe.confirmCardPayment(
            clientSecret,
            { 
               payment_method: { 
                 card: cardElement,
                  billing_details: {
                  email: userInfo.parent,
                },
              },
            }
           ).then(resp=>{
             if(resp.error){
               this.props.onValidationError(resp.error.message);
             }else{
             const {paymentIntent}=resp;
             if (paymentIntent.status === "succeeded"){
               const _payObj={};
               _payObj.transferId=paymentIntent.id;
               _payObj.chargeId=paymentIntent.payment_method;
               this.props.onToken(_payObj);
               //_addNotification(`Payment successful!`,this.props);
             }
             else {
               this.props.onValidationError(`Payment failed!`);
             }
           }
           }).catch(ex=>{
               console.log(ex)
           });
        }else{

        }
    }).catch(err=>{
      console.error(err);
      this.props.onValidationError(`There was an error in payment`);
    });      
  }catch(ex){
    console.error(ex);
  }
}
render() {
    const {paymentObj, schoolName, logoUrl,schoolId, excludeCharges, disabled} =this.props;
    const _stripeInfo=stripeInfo(schoolId);
    const amt= ((paymentObj===undefined?0.00:( parseFloat(paymentObj.balAmount)+ (excludeCharges?0:calculateStripeCharges(parseFloat(paymentObj.balAmount),undefined,schoolId)))));
    const amount= ((paymentObj===undefined?0.00:( parseFloat(paymentObj.balAmount)+ (excludeCharges?0:calculateStripeCharges(parseFloat(paymentObj.balAmount),undefined,schoolId))))*(_stripeInfo.monetary_unit));
    
    return (
      <form onSubmit={this.pay} className="checkout">
        <fieldset disabled={this.state.loading}>
        <div className="row">
          <div className="col-md-12 text-center">
            <div>
              <img alt="" src="https://s3.amazonaws.com/stripe-uploads/acct_1CNm8hFk5swmLb4napplication-logo-logo_mm_1.png" />
            </div>

          </div>
          <div className="col-md-12">
            <label>
              Card details
              <CardElement
                {...createOptions(this.props.fontSize)}
              />
            </label>         
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 text-center">
            <button disabled={this.state.loading}>{`Proceed To Pay ${currency_symbol(schoolId)} ${ amt} `} </button>            
          </div>
          {this.state.loading && 
          <div className="col-md-12 text-center" style={{color: 'green', fontSize: '18px', paddingTop: '15px'}}><i className="fa fa-spinner fa-spin"></i> Processing...</div>}
        </div>
        </fieldset>
      </form>
    );
  }
}
 
export default injectStripe(CheckoutForm);