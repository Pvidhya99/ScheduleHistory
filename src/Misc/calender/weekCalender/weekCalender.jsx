import React, { Component, Fragment } from 'react';
import moment from 'moment';
import {groupBy}from '../../../server/util';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from "@fortawesome/fontawesome-svg-core";
import { faAngleDoubleLeft,faAngleDoubleRight } from "@fortawesome/free-solid-svg-icons";
import './weeklyMenu.css';

library.add(faAngleDoubleLeft);
library.add(faAngleDoubleRight);

const weekEndDays=['Sun','Sat'];
const MealTypes={
    breakfast:'BREAKFAST',
    meal:'MEAL',
    side:'SIDE',
    holiday:'HOLIDAY'
};
class WeekCalender extends Component {
    constructor(props){
        super(props);
        this.state={
            loading:false
        }
       
    }

    
    getFirstAndLastDates = ()=>{
        const {currency_symbol,weekStartDate,weekEndDate, hideWeekEnds, menuItems,hiddenDays}=this.props;
        const returnObj = {
            weekFirstDate : "",
            weekLastDate : ""

        }
       const dates = this.weekDatesArray(weekStartDate,weekEndDate)
       const firstAndLastDates = dates.filter((date,i)=>  !hiddenDays.includes(i)) || []
       if(firstAndLastDates.length > 0 ){
            returnObj.weekFirstDate = firstAndLastDates[0]
            returnObj.weekLastDate  =firstAndLastDates[firstAndLastDates?.length -1]
       }
       return returnObj
    }
    renderList=(date)=>{
        const {currency_symbol,weekStartDate,weekEndDate, hideWeekEnds, menuItems,hiddenDays,renderDayEventList}=this.props;
        const groupByDate=groupBy(menuItems,'date');
        const groupByType=groupBy((groupByDate[date.format('YYYY-MM-DD')]||[]),'type');
        if(renderDayEventList){
           return renderDayEventList(date)
        }else{
            const isDisabled=moment(date).set({hour:0,minute:0,second:0,millisecond:0})<moment().set({hour:0,minute:0,second:0,millisecond:0})?true:false;

        return <>
        {
            (groupByType[MealTypes.meal]||[]).length>0?
            <Fragment>
                <p>
                    <small>{MealTypes.meal}</small>
                    <hr className="menuItemDivision" />
                </p>
                {
                    (groupByType[MealTypes.meal]||[]).map(item=>{
                        return <div className={item.isSelected?(isDisabled?"menuItem active disabled":"menuItem active"):(isDisabled?"menuItem disabled":"menuItem")} onClick={()=>{
                        if(this.props.isEditable){
                                this.props.itemSelectionChange(item);
                        } 
                        }}>
                                <span>{item.name}</span></div>
                    })
                }
            </Fragment>:null
        }
        {
            (groupByType[MealTypes.side]||[]).length>0?
            <Fragment>
                <p>
                    <small>{MealTypes.side}</small>
                    <hr className="menuItemDivision" />
                </p>
                {
                    (groupByType[MealTypes.side]||[]).map(item=>{
                        return <div className={item.isSelected?(isDisabled?"menuItem active disabled":"menuItem active"):(isDisabled?"menuItem disabled":"menuItem")} onClick={()=>{
                        if(this.props.isEditable){
                                this.props.itemSelectionChange(item);
                        } 
                        }}>
                                <span>{item.name}</span></div>
                    })
                }
            </Fragment>:null
        } 
        </>
             
        }
    }
    buildCalender=()=>{
        const {currency_symbol,weekStartDate,weekEndDate, hideWeekEnds, menuItems,hiddenDays}=this.props;
        
        const {weekFirstDate,weekLastDate} = this.getFirstAndLastDates()
       return (
          <table className="table table-bordered table-responsive" id="calendar">
                <thead>
                    <tr className="tblHead">
                        <td colSpan='7' className="text-center calender-header">
                            <FontAwesomeIcon icon="angle-double-left" className='calender-btn' onClick={()=>{this.props.onPrevWeekChange()}} />
                            <h2 class="calender-btn" style={{display:'inline'}}>&nbsp;{`  ${weekStartDate.format('MMM')} ${weekFirstDate.format('D')} - ${weekLastDate.format('D')}  `}&nbsp;</h2>
                            <FontAwesomeIcon icon="angle-double-right" className='calender-btn' onClick={()=>{this.props.onNextWeekChange()}}/></td>
                    </tr>
                </thead>
                <thead >
                <tr className="bg-color-1 tblHead">
                    {
                        this.weekDayNames(weekStartDate,weekEndDate).map((day,i)=>{
                            if(hideWeekEnds && hiddenDays.includes(i)){
                                return <th style={{display:'none'}} className="col-lg-2">{day}</th>
                            }else{
                                return <th className="col-lg-2">{day}</th>
                            }
                        })
                    } 
                </tr>
                </thead>
                <tbody>
                    
                      <tr>
                          {
                            this.weekDatesArray(weekStartDate,weekEndDate).map((date,i)=>{
                                if(hideWeekEnds && hiddenDays.includes(i)){
                                return <td style={{display:'none'}} className="tblBodyCol" data-date={date.format('YYYY-MM-DD')}>
                                <div className="tblBodyColDate"><span>{date.format('D')}</span></div>
                                </td>
                            }else{
                               
                                return <td className="tblBodyCol" data-date={date.format('YYYY-MM-DD')}>
                                   
                                    <div className="tblBodyColDate">
                                        <span className={date.format('YYYYMMDD')==moment().format('YYYYMMDD')?'today':'notToday'}>{date.format('D')}</span></div>
                                        {this.renderList(date)}                                   
                                  
                                </td>
                            }                               
                            })
                          }
                      </tr>
                </tbody>
         </table>
       )
      }
      weekDayNames=(start, end)=>{
        let dates=[];
        let dt = moment(start);      
        while (dt <= end) {
            dates.push(moment(dt).format('ddd'));
            dt.add(1,'d');
        }      
        return dates;

      }
      weekDatesArray=(start, end)=>{
        let dates=[];
        let dt = moment(start);      
        while (dt <= end) {
            dates.push(moment(dt));
          dt.add(1,'d');
        }      
        return dates;
     }
    render() {
        return (
            <div>
            {
                this.buildCalender()
            }
                
            </div>
        )
    }
}
export default WeekCalender
