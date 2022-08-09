import React, { Component, Fragment } from 'react';
//import Datetime from 'react-datetime';
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
//import "react-datetime/css/react-datetime.css";
import './multiDatePicker.css';

class MultiDatePicker extends Component {
    constructor(props){
        super(props);
        this.state={
            date:''
        }
    }
    onChange=(e)=>{
        this.props.onSelectedDate(moment(e))
        this.setState({date:''});
    }
    onRemoveClick=(e,i)=>{        
        this.props.onDateRemove(i);
    }
    onClose=()=>{
        this.setState({ date:''});
    }
    render() {
        let excludeDates=(this.props.selectedDates||[]).map(dt=>{
            return dt.toDate();
        });
        (this.props.previousPaidDates||[]).map(dt=>{
            excludeDates.push(dt);
        });
        const isWeekday = date => {
            const day = moment(date).day();
            return !(this.props.hiddenDays||[]).includes(day);
          };
        return (<Fragment>
            <div className="bootstrap-tagsinput">
                {
                    (this.props.selectedDates||[]).map((date,i)=>{
                        return <span class="badge badge badge-info">{date.format('MM-DD-YYYY')}<span data-role="remove" onClick={(e)=>{
                            this.onRemoveClick(e,i);
                        }}></span></span>
                    })
                } 
                <DatePicker minDate={moment().toDate()} 
                shouldCloseOnSelect={false}
                selected={this.state.date} 
                excludeDates={excludeDates||[]}
                onChange={this.onChange}
                filterDate={isWeekday} />
                
            </div>            
        </Fragment>);
    }
}

export default MultiDatePicker;