import React, { Component, Fragment } from 'react';
import Modal from 'react-modal';
import {paymentGatewayOptions, stripeInfo} from '../../server/constants'
import {getPaymentGateway, groupBy, getSchoolCountryCode } from '../../server/util';
import PaymobPay from './paymob/paymobPay';
import Stripe3DCheckOut from './stripe/stripe3DCheckOut';
import StripeCheckOut from './stripe/stripeCheckOut';
const customStyles = {
    content: {
        textAlign: 'justify',
        textJustify: 'inter-word',
        padding: '0px',
        height: '450px',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        width: '40%',
        transform: 'translate(-50%, -50%)',
        overflow: 'initial',
        WebkitBoxShadow: '0 5px 11px 0 rgba(0,0,0,0.18), 0 4px 15px 0 rgba(0,0,0,0.15)',
        boxShadow: '0 5px 11px 0 rgba(0,0,0,0.18), 0 4px 15px 0 rgba(0,0,0,0.15)'
    }
}

class PaymentModule extends Component {
    constructor(props){
        super(props);
        this.state={
            showPayMobModal:false,
            showStripe3DModal:false
        }
    }
    getPayMobDetails=(gateWayOption)=>{
        const groupGateWay=groupBy(gateWayOption.formValues||[],'name');
        let iframeURL='';
        let apiKey='';
        let integrationId='';
        if(((groupGateWay||{}).iframeURL||[]).length>0){
            iframeURL=((groupGateWay||{}).iframeURL||[])[0].value||'';
        }
        if(((groupGateWay||{}).apiKey||[]).length>0){
            apiKey=((groupGateWay||{}).apiKey||[])[0].value||'';
        }
        if(((groupGateWay||{}).integrationId||[]).length>0){
            integrationId=((groupGateWay||{}).integrationId||[])[0].value||'';
        }
        return {
            iframeURL:iframeURL,
            apiKey:apiKey,
            integrationId:integrationId,
        }
    }
    render() {
        const {schoolId}=this.props;
        const gateWayOption=getPaymentGateway(schoolId||0);
        const payMobObj=this.getPayMobDetails(gateWayOption);
        const _stripeInfo=stripeInfo(schoolId);
        
        return (
            <Fragment>
            {
                gateWayOption.payGatewayName===paymentGatewayOptions.STRIPE?
                (getSchoolCountryCode(schoolId)==='US'?<StripeCheckOut {...this.props} />:
                <button className="btn btn-success" onClick={(e)=>{
                    this.setState({showStripe3DModal:true})
                }}>Pay With Card</button>):
                gateWayOption.payGatewayName===paymentGatewayOptions.PAYMOB?
                <button className="btn btn-success" onClick={(e)=>{
                    this.setState({showPayMobModal:true})
                }}>Pay With Card</button>
                    :
                null
            } 
            <Modal
                isOpen={this.state.showStripe3DModal}
                style={customStyles}
                contentLabel="Activation"
                ariaHideApp={false}>
                    <div class="modal-header">
                        <h5 class="modal-title" style={{display:'inline'}}>Stripe Payment</h5>
                        <span style={{ color: '#aaa',  float: 'right', fontSize: '28px', fontWeight: 'bold', cursor:'pointer'}} 
                            onClick={() => {
                                this.setState({showStripe3DModal:false})
                            }}>&times;</span>
                    </div>
                    <div className="modal-body">
                        <div className="row">
                            <div className="col-md-12 col-sm-12">                                                            
                                <Stripe3DCheckOut {...this.props} />
                            </div>
                        </div>
                    </div>
            </Modal>
            <Modal
                isOpen={this.state.showPayMobModal}
                style={customStyles}
                contentLabel="Activation"
                ariaHideApp={false}>
                    <div className="modal-body">
                        <div className="row">
                            <div className="col-md-12 col-sm-12">
                            <span style={{ color: '#aaa',  float: 'right', fontSize: '28px', fontWeight: 'bold'}} 
                            onClick={() => {
                                this.setState({showPayMobModal:false})
                            }}>&times;</span>
                                <PaymobPay {...this.props}
                                    iframeUrl={`${payMobObj.iframeURL}`}
                                    apiKey={payMobObj.apiKey}
                                    integrationId={payMobObj.integrationId}
                                    />
                            </div>
                        </div>
                    </div>
            </Modal>       
        </Fragment>
        )
    }
}
export default PaymentModule