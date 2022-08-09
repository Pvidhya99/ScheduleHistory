import React, { Component, Fragment } from 'react';
import {Elements, StripeProvider } from 'react-stripe-elements';
import {my_PUBLISHABLE_stripekey, stripeInfo} from '../../../server/constants';
import {_addNotificationError,
    allowNumericWithdecimal,
    _addNotification,
    calculateStripeCharges, getStripeSchoolAccountId} from "../../../server/util";
import InjectedCheckoutForm from './CheckoutForm';
class Stripe3DCheckOut extends Component {
    constructor(props){
        super(props);
    }
    
    render() {
        return (
            <Fragment>
                <StripeProvider apiKey={my_PUBLISHABLE_stripekey} stripeAccount={getStripeSchoolAccountId(this.props.schoolId)}>
                    <Elements>
                        <InjectedCheckoutForm {...this.props} />
                    </Elements> 
                </StripeProvider>                              
            </Fragment>
        );
    }
}

export default Stripe3DCheckOut;