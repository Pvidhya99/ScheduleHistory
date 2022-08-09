import React, {Component} from 'react';
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
class HouseHoldAppAlert extends Component {
    constructor(props){
        super(props);
        this.state={
            lunchProgramsCount:0,
            schoolYear:this.props.schoolYear
        }
        this.getPendingLunchProgramCount=this.getPendingLunchProgramCount.bind(this);
    }
    componentWillMount=()=>{               
        this.getPendingLunchProgramCount(this.state.schoolYear)
    }
    componentWillReceiveProps=(nextProps)=>{
        if(nextProps.schoolYear!=this.state.schoolYear){
            this.setState({schoolYear:nextProps.schoolYear},
                this.getPendingLunchProgramCount(nextProps.schoolYear) )
        }        
    }
    getPendingLunchProgramCount=(schoolYear)=>{   
       get('/householdApplicationForFRMs/search/countByMealSchoolIdAndSchoolYearAndStatus?mealSchoolId=' + this.props.schoolId + '&schoolYear='+schoolYear+'&status=pending&access_token=').then((response) => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        }).then(data => {
            console.log('data', data);
            this.setState({
                lunchProgramsCount: (data||'')===''?0:(data||0) 
            })             
        }).catch(
            (error) => {              
                console.log('Get Users data response', error)
            }
        );
    }
    
    render(){
        return(
            <div className="row">                
            {
                (this.state.lunchProgramsCount||0)>0?
            
             <div className="alert alert-danger alert-dismissable" style={lunchProAlert.alert} role="alert">
             <button type="button" className="close" data-dismiss="alert" aria-hidden="true">×</button>
                 <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
                 <span style={lunchProAlert.alertText}><strong>{this.state.lunchProgramsCount}</strong> {' Household Application for Free and Reduced Price School Meals are pending.'}</span>
                 <span style={lunchProAlert.acceptSpan}>
                 <button type="button" className="btn btn-xs btn-primary" style={{margin: '0 0 9px 0', fontSize: '12px'}} onClick={(e)=>{
                     this.context.router.history.push('/schoolAdmin/schoolMealProgram');                           
                 }}> <span>Show All</span></button>
                 </span>
             </div> :null
             }
             </div>
      )
    }

}
HouseHoldAppAlert.contextTypes = {
    router: PropTypes.object.isRequired
}
export default HouseHoldAppAlert