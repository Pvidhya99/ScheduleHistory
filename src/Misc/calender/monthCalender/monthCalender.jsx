import React, { Component, Fragment } from 'react';
import moment from 'moment';
import {groupBy}from '../../../server/util';
import './monthCalender.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faAngleDoubleLeft,faAngleDoubleRight } from "@fortawesome/free-solid-svg-icons";

library.add(faAngleDoubleLeft);
library.add(faAngleDoubleRight);

const weekEndDays=['Sun','Sat'];
const MealTypesText={
    MEAL:'Main course',
    SNACK:'Snack',
    BREAKFAST:'Breakfast',
    SIDE:'Sides',
    EXTRA:'A La Carte ',
    HOLIDAY:'Holiday'
}
const MealTypes={    
    meal:'MEAL',
    snack:'SNACK',
    breakfast:'BREAKFAST',
    side:'SIDE',
    extra:'EXTRA',
    holiday:'HOLIDAY'
};

class MonthCalender extends Component {
    renderDayEventList=(eventDate)=>{
        const {currency_symbol, events, renderDayEventList, eventClick}=this.props;
        
        const groupByDate=groupBy(events,'date');
        const groupByType=groupBy((groupByDate[eventDate.format('YYYY-MM-DD')]||[]),'type');
        const isDisabled=false;
        if (renderDayEventList){
            return renderDayEventList(eventDate);
        }else{
            return(
                <Fragment>
                {
                    (groupByType[MealTypes.meal]||[]).length>0?
                    <Fragment>
                        <p className="groupTitle">
                            <small>{MealTypesText[MealTypes.meal]}</small>
                        </p>
                        {
                            (groupByType[MealTypes.meal]||[]).map(item=>{
                                return <div className={item.isSelected?(isDisabled?"menuItem active disabled":"menuItem active"):(isDisabled?"menuItem disabled":"menuItem")} onClick={()=>{
                                    if(eventClick){
                                        this.props.eventClick(item);
                                    }                                    
                                }}>
                                        <span>{item.name}</span></div>
                            })
                        }
                    </Fragment>:null
                }
                {
                    (groupByType[MealTypes.snack]||[]).length>0?
                    <Fragment>
                        <p className="groupTitle">
                            <small>{MealTypesText[MealTypes.snack]}</small>
                        </p>
                        {
                            (groupByType[MealTypes.snack]||[]).map(item=>{
                                return <div className={item.isSelected?(isDisabled?"menuItem active disabled":"menuItem active"):(isDisabled?"menuItem disabled":"menuItem")} onClick={()=>{
                                    if(eventClick){
                                        this.props.eventClick(item);
                                    }
                                }}>
                                        <span>{item.name}</span></div>
                            })
                        }
                    </Fragment>:null
                }
                {
                    (groupByType[MealTypes.breakfast]||[]).length>0?
                    <Fragment>
                        <p className="groupTitle">
                            <small>{MealTypesText[MealTypes.breakfast]}</small>
                        </p>
                        {
                            (groupByType[MealTypes.breakfast]||[]).map(item=>{
                                return <div className={item.isSelected?(isDisabled?"menuItem active disabled":"menuItem active"):(isDisabled?"menuItem disabled":"menuItem")} onClick={()=>{
                                    if(eventClick){
                                        this.props.eventClick(item);
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
                        <p className="groupTitle">
                            <small>{MealTypesText[MealTypes.side]}</small>
                        </p>
                        {
                            (groupByType[MealTypes.side]||[]).map(item=>{
                                return <div className={item.isSelected?(isDisabled?"menuItem active disabled":"menuItem active"):(isDisabled?"menuItem disabled":"menuItem")} onClick={()=>{
                                    if(eventClick){
                                        this.props.eventClick(item);
                                    }
                                }}>
                                        <span>{item.name}</span></div>
                            })
                        }
                    </Fragment>:null
                }{
                    (groupByType[MealTypes.extra]||[]).length>0?
                    <Fragment>
                        <p className="groupTitle">
                            <small>{MealTypesText[MealTypes.extra]}</small>
                        </p>
                        {
                            (groupByType[MealTypes.extra]||[]).map(item=>{
                                return <div className={item.isSelected?(isDisabled?"menuItem active disabled":"menuItem active"):(isDisabled?"menuItem disabled":"menuItem")} onClick={()=>{
                                    if(eventClick){
                                        this.props.eventClick(item);
                                    }
                                }}>
                                        <span>{item.name}</span></div>
                            })
                        }
                    </Fragment>:
                        null
                }
                {
                    (groupByType[MealTypes.holiday]||[]).length>0?
                    <Fragment>
                        {(groupByType[MealTypes.holiday]||[]).map(item=>{
                                return <div className={"menuItem noSchool"}>
                                        <span>{item.name}</span></div>
                            })
                        }
                    </Fragment>:null
                }             
                </Fragment>
            )

        }
        
    }
    buildCalender=()=>{
        let firstDay = moment([this.props.defaultDate.get('year'), this.props.defaultDate.get('month'),1]).day();
        let daysInMonth = parseInt(this.props.defaultDate.endOf('month').format('DD'));
        let date=1;
        return(
            <table className="table table-bordered table-responsive" id="calendar">
                <thead>
                    <tr className="tblHead">
                        <td colSpan='7' className="text-center calender-header">
                            <FontAwesomeIcon icon="angle-double-left" className='calender-btn' onClick={()=>{this.props.onPrevMonthChange()}} />
                            <h2 class="calender-btn" style={{display:'inline'}}>&nbsp;{`  ${moment(this.props.defaultDate).format("MMM")} ${this.props.defaultDate.get('year')} `}&nbsp;</h2>
                            <FontAwesomeIcon icon="angle-double-right" className='calender-btn' onClick={()=>{this.props.onNextmonthChange()}}/></td>
                    </tr>
                </thead>
                <thead>
                    <tr className="bg-color-1 tblHead">
                    {
                        [0,1,2,3,4,5,6].map(i=>{
                            return (this.props.hiddenDays||[]).includes(i)?
                            <th className="col-lg-2" style={{display:'none'}}>{moment().day(i).format('ddd')}</th>:
                            <th className="col-lg-2">{moment().day(i).format('ddd')}</th>
                        })
                    } 
                    </tr>
                </thead>
                <tbody>
                {
                    [0,1,2,3,4,5].map((i)=>{
                        return(  <tr>{
                            [0,1,2,3,4,5,6].map((j)=>{ 
                                const thisDate= moment([ this.props.defaultDate.get('year'), this.props.defaultDate.get('month'),date])              
                              if(i===0 && j<firstDay){                                  
                                return (this.props.hiddenDays||[]).includes(j)?<td style={{display:'none'}}></td>: <td className="tblBodyCol">{''}</td>
                              }else if(date > daysInMonth){
                                return null                      
                              }else{                                
                                const _str= (this.props.hiddenDays||[]).includes(j)?
                                    <td style={{display:'none'}}></td>: 
                                    <td className="tblBodyColDate">
                                        <span className={thisDate.format('YYYYMMDD')==moment().format('YYYYMMDD')?'today':'notToday'}>{date}</span>
                                        {
                                            this.renderDayEventList(thisDate)
                                        }
                                    </td>
                                date++;
                                return _str;
                              }
                              
                    })
                }</tr>);
                })
                }
                </tbody>
            </table>
        )

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

export default MonthCalender
