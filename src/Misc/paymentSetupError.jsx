import React, {Component} from 'react';
import img from '../../assets/img/500.png'
import AppHeader from './AppHeader';
class PaymentSetupError extends Component{
    render(){
        return(
            <div>
                <AppHeader/>
                <div className="main-wrapper margin-top">
                    <section className="mainContent full-width clearfix">
                        <div className="container">
                            <div className="row">
                                <div className="col-sm-4 col-sm-offset-1 col-xs-12">
                                    <div className="errorMsg">
                                        <img src={img} alt="error 500" className="img-responsive"/>
                                    </div>
                                </div>
                                <div className="col-sm-6 col-xs-12">
                                    <div className="errorInfo">
                                        <h3>Oops!</h3>
                                        <p>We are sorry, Stripe payment setup failed. Please try again.</p>

                                    </div>
                                </div>
                            </div>

                        </div>
                    </section>
                </div>
            </div>

        );
    }

}
export default PaymentSetupError;