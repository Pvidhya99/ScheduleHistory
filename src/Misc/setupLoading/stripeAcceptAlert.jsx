import React, {Component} from 'react';
import {get, getAccessToken} from "../../../server/actions";
const stripeAlert={
    alert:{
        marginBottom:'0px'
    },
    acceptSpan:{
        float:'right'
    },
    acceptBtn:{
        marginTop:'-6px'
    },
    alertText:{
        fontSize:'12px',
        fontStyle: 'italic',
        paddingLeft: '10px'
    }
}
class StripeAcceptAlert extends Component {
    constructor(props){
        super(props);
        this.state={
            ip:''
        }
        this.getSystemIp=this.getSystemIp.bind(this);
        this.onAcceptClick=this.onAcceptClick.bind(this);
    }
    componentWillMount=()=>{
        this.getSystemIp();
    }
    onAcceptClick=(e)=>{
        e.preventDefault();
        get('/transactions/acceptStripeAgreement/'+sessionStorage.getItem("SchoolId")+'?systemIP=' + this.state.ip + '&access_token=').then((response) => {
            return response.json();
        }).then(data => {
            if(data.statusCode===200)
            this.props.onStripeAccept()
            else{
                throw Error(data.statusMessage);
            }

        }).catch(
            (error) => {
               // _addNotificationError('Invalid Sub Domain Please Check the URL', this)
               this.props.showErrorMessage(error.message)
                console.log(' response', error)
            }
        )

    }
    getSystemIp=()=>{
        fetch('https://ipapi.co/json/')
            .then(res => res.json())
            .then(json => {
            this.setState({ip: json.ip});
        });
    }
    render(){
        return(
       this.props.showIsAccept? <div className="alert alert-danger" style={stripeAlert.alert} role="alert">
        <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
        <span style={stripeAlert.alertText}>{'By registering your account, you agree to our '}<a href="https://stripe.com/docs/connect/updating-accounts#tos-acceptance" target="_blank">Services Agreement</a>{" and "}<a href="https://stripe.com/connect-account/legal" target="_blank">the Stripe Connected Account Agreement</a>.</span>
        <span style={stripeAlert.acceptSpan}><button type="button" style={stripeAlert.acceptBtn} className="btn btn-xs btn-success not-rounded" onClick={(e)=>{
            this.onAcceptClick(e)
        }}>Accept</button></span>
      </div>:null
      )
    }

}
export default StripeAcceptAlert