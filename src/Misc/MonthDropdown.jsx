import React, {Component} from 'react';
import Datetime from 'react-datetime';
import moment from "moment";
class MonthDropdown extends Component {
    constructor(props){
        super(props);
        this.state={
            selectedMonth:this.props.selectedMonth ||moment().startOf('month')
        }
        this.onChange=this.onChange.bind(this);
    }
    onChange=(e)=>{
        this.setState({selectedMonth:moment(e)},()=>{
            this.refs.calendar.closeCalendar();
            this.props.onChange(e);
        })
        
    }
    componentWillReceiveProps=()=>{
        this.setState({
            selectedMonth:this.props.selectedMonth
        })
    }
    render(){
        return(
            <Datetime value={this.state.selectedMonth}  ref='calendar' onChange={(e)=> this.onChange(e)} closeOnSelect={true} dateFormat={this.props.dateFormat} timeFormat={false} renderInput={(props, openCalendar, closeCalendar) => {
                    return (
                        <a href="javascript:void(0)" className="selected-date-range-btn" onClick={openCalendar} >
                            <div className="pull-left">
                                <i className="fa fa-calendar"/>
                            </div>                            
                        </a>
                    );
                }} >
            </Datetime>
        )
    }
}
export default MonthDropdown