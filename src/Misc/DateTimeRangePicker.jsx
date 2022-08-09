import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import DatetimeRangePicker from 'react-bootstrap-daterangepicker';
import {
    Button,
  } from 'react-bootstrap';
import moment from "moment"
const rangeObject={
  'Today': [moment(), moment()],
  'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
  'Last 7 Days': [moment().subtract(6, 'days'), moment()],
  'Last 30 Days': [moment().subtract(29, 'days'), moment()],
  'This Month': [moment().startOf('month'), moment().endOf('month')]
}

class DateTimeRangePicker extends Component {
    constructor(props){
        super(props);
        let now = new Date();
        let start = this.props.startDate|| moment(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0,0,0,0));
        let end = this.props.endDate|| moment(start).add(1, "days").subtract(1, "seconds");
        this.state = {
            start : start,
            end : end,
            ranges: this.props.ranges||rangeObject
        }
        this.applyCallback = this.applyCallback.bind(this);
    }
    applyCallback(event, picker) {
        this.setState({
          start: picker.startDate,
          end: picker.endDate,
        });
        this.props.applyCallback(event,picker);
      }
      componentWillReceiveProps=(nextpros)=>{
        this.setState({
          start:nextpros.startDate,end:nextpros.endDate, ranges:nextpros.ranges||rangeObject
        })
      }
    render(){
        let start = this.state.start.format('MMM D, YYYY');
        let end = this.state.end.format('MMM D, YYYY');
        let label = start + ' - ' + end;
        if (start === end) {
        label = start;
        }        
            return(
                <div>
                <DatetimeRangePicker
            startDate={this.state.start}
            endDate={this.state.end}
            ranges={this.state.ranges}
            //onEvent={this.applyCallback}
            onApply={this.applyCallback}
            applyClass={'btn btn-success'}
            cancelClass={'btn btn-danger'}
          > <a href="javascript:void(0)" className="selected-date-range-btn" >
              <div className="pull-left">
                <i className="fa fa-calendar"/>                
                  {
                    this.props.isDateShow? <span> {  label} </span>:null
                }
              </div>
              
            </a>
          </DatetimeRangePicker>                    
                </div>
            );
        }
}
export default DateTimeRangePicker;