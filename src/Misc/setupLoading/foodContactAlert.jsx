import React, {Component,Fragment} from 'react';
import PropTypes from "prop-types";
import {get, getAccessToken} from "../../../server/actions";
const lunchProAlert={
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
class FoodContactAlert extends Component {
    render(){
        return(
            this.props.isShowAlert?
            <div className="row"> 
             <div className="alert alert-danger alert-dismissable" style={lunchProAlert.alert} role="alert">
             <button type="button" className="close" data-dismiss="alert" aria-hidden="true">×</button>
                 <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
                 <span style={lunchProAlert.alertText}>
                 {'School food service manager contact details mandatory. Please provide contact details.'}</span>
                 <span style={lunchProAlert.acceptSpan}>
                 <button type="button" className="btn btn-xs btn-primary" style={{margin: '0 0 9px 0', fontSize: '12px'}} onClick={(e)=>{
                     this.context.router.history.push('/schoolAdmin/account/show-contact');                           
                 }}> <span>Go</span></button></span>
             </div>
             </div>:null
      )
    }

}
FoodContactAlert.contextTypes = {
    router: PropTypes.object.isRequired
}
export default FoodContactAlert