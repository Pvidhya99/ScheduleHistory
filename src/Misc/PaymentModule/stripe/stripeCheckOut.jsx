import React, {Component, Fragment} from 'react';
import {Link} from 'react-router-dom';
import StripeCheckout from 'react-stripe-checkout';
import {my_PUBLISHABLE_stripekey, stripeInfo} from '../../../server/constants';
import {_addNotificationError,
    allowNumericWithdecimal,
    _addNotification,
    calculateStripeCharges} from "../../../server/util";

class StripeCheckOut extends Component{
    constructor(props){
        super(props);
        this.state={
            reqObject:{},
        }
    }
    onToken = (token) => {    
        const me=this;
        me.props.onToken(token.id);
    }
    render(){
        const {paymentObj, schoolName, logoUrl,schoolId, excludeCharges, disabled} =this.props;
        const _stripeInfo=stripeInfo(schoolId);
        const amount= ((paymentObj===undefined?0.00:( parseFloat(paymentObj.balAmount)+ (excludeCharges?0:calculateStripeCharges(parseFloat(paymentObj.balAmount),undefined,schoolId))))*(_stripeInfo.monetary_unit));
        return(<Fragment>
            <div style={{width:'100%'}}>
                <StripeCheckout
                    name= {schoolName==''?'MealManage':schoolName}
                    ComponentClass="div"
                    panelLabel="Proceed To Pay" // prepended to the amount in the bottom pay button
                    token={this.onToken}            
                    stripeKey={my_PUBLISHABLE_stripekey}
                    amount={amount} // cents
                    currency={_stripeInfo.currencyCode}
                    image={(logoUrl||'')==''?"https://s3.amazonaws.com/stripe-uploads/acct_1CNm8hFk5swmLb4napplication-logo-logo_mm_1.png":logoUrl} // the pop-in header image (default none)
                    >
                        <button className="btn btn-success btn-sm btn-block" style={{ fontSize: '14px'}} disabled={disabled}>
                            Pay With Card
                        </button>
                </StripeCheckout>
            </div>
            </Fragment>)
    }
}
export default StripeCheckOut