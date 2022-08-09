import React, { useContext, useEffect, useState } from 'react'
import moment from 'moment'
import MonthCalender from '../../../../Misc/calender/monthCalender/monthCalender'
import WeekCalender from '../../../../Misc/calender/weekCalender/weekCalender'
import { Card, Tab, Row, Col, Nav, Button, Image } from 'react-bootstrap';
import useOrderMealMenu from '../../../../hooks/useOrderMealMenu';
import { useLocation } from 'react-router-dom';
import { MealTypes, MealTypesText } from '../../../../server/constants';
import { convertTwoDecimalPoint, groupBy } from '../../../../server/util';
import { Popover, PopoverBody, PopoverHeader } from 'reactstrap';
import dietImage from '../../../../assets/img/generic/diet-img.jpg';
import useServiceCalls from '../../../../hooks/useServiceCalls';
import { orderMealContext } from '../../../../context/Context';

const RenderItems = ({events,eventDate,item,studentData,validateDates,currency_symbol,orderType})=>{
  const notRequiredOfNutrition = ['createdBy','_links','name',"longDescription","imageBase64Content",'active','isNutrAvailable','createdOn']
   const [eventsData,setEventsData] = useState(events)
   const {orderStateData : {previewOrder}, orderDispatch} = useContext(orderMealContext)
   console.log("previewOrder==========",previewOrder)
   const [loading,setLoading] = useState(false)
   const [nutritionInfo,setNutritionInfo] = useState([])
   const {get} = useServiceCalls()

   const getClassNames = (isDisabled)=>{
     var className = ""
     if(item === MealTypes.holiday ){
       className =  'event-holiday text-center justify-content-center ' 
     }else if (isDisabled ){
       className =  'event-disabled text-left justify-content-start '
     }else{
         className = 'event-active text-left justify-content-start '
     }

      return className
   }
   const getNutritionInfo = async (id)=>{
     try {
       setLoading(true)
       const resp = await get(`/menuItems/${id}`)
       console.log("nutrition responseData.....",resp)
       setNutritionInfo(resp.data)
       setLoading(false)
     } catch (error) {
       console.log(error)
       setLoading(false)
     }
   }
   const RenderNutritionInfo = ()=>{
     if(nutritionInfo.length === 0 ){
       return null
     }
     

     const x=  Object.keys(nutritionInfo).map(item=>{
       const val= nutritionInfo[item]
       if(notRequiredOfNutrition.includes(item) || !val){
         return null
       }
     
       return <Col xs={'6'}>{item} : {val}</Col>
     } 
     )
      return x
   }
   console.log("render items........")
   return eventsData.map((event,i)=>{
     const studentIsFreeMeal=((studentData?.isFreeMealEligible||false)?true:((event.type === MealTypes.breakfast) && studentData?.beforeCare)?true:false);
     const studentIsReducePrice=studentData?.isReducePriceEligible||false;
     const isDisabled=validateDates(eventDate);
     if(previewOrder ){
       return (
         <>
         {event.selected ? <p className='event-disabled text-left justify-content-start'>{event.name} {currency_symbol}{convertTwoDecimalPoint(studentIsFreeMeal? 0: (studentIsReducePrice)?event.reducedPrice:  (event.applyDiscount && event.isSelected?event.afterDiscountAmount:event.price))}</p> : null}
       </>
       )
     }
     return (
       <Row onClick={async ()=>{
         if(!isDisabled ){
           console.log("click on row.....",event)
           await orderDispatch({
             type: 'UPDATE_SELECTED_ITEMS',
             payload: {event,orderType : orderType}
           })
           if(event.type === MealTypes.meal  ){
             eventsData.map((item,key)=>{
               if(key !== i){
                 item.selected = false
               }
               
             })
           }
           eventsData[i]['selected'] = !eventsData[i]['selected']
           //setEventsData([...eventsData])
          
           
         }
       }} 
       onMouseEnter={()=>{
         eventsData[i]['openPopover'] = true
         setEventsData([...eventsData])
         getNutritionInfo(eventsData[i]['id'])
       }}
       onMouseLeave={()=>{
         eventsData[i]['openPopover'] = false
         setEventsData([...eventsData])
       }}
       key={`Popover_${event.id}_${i}_${event.mealCalendarId}`}
       id={`Popover_${event.id}_${i}_${event.mealCalendarId}`}
       className={`d-flex  ${getClassNames(isDisabled)} ${event.selected ? "event-selected" : ""}`}>
       <p >{event.name} {currency_symbol}{convertTwoDecimalPoint(studentIsFreeMeal? 0: (studentIsReducePrice)?event.reducedPrice:  (event.applyDiscount && event.isSelected?event.afterDiscountAmount:event.price))}</p>
       {event.type !== MealTypes.holiday && 
         <Popover onClick={(e)=>{
           e.stopPropagation()
         }} className='custm-popover' placement="left" id={`Popover_${event.id}_${i}_${event.mealCalendarId}`} isOpen={event.openPopover} target={`Popover_${event.id}_${i}_${event.mealCalendarId}`} >
           <PopoverHeader><Image src={dietImage} style={{width:"100%"}}/></PopoverHeader>
           <PopoverBody><h3>Nutrition Info</h3>
             {loading && "Loading..." }
              {!loading && <Row >
             <RenderNutritionInfo />
             </Row>}
             </PopoverBody>
         </Popover>
       }
       </Row>
       
     )
   })

 
}
const OrderMealComponent = React.memo(({lunch=false,breakfast=false,isParent,hiddenDays,currency_symbol,studentData})=>{
  console.log("OrderMealComponent  rendered.....")
    var orderType = lunch ? "Lunch" : (breakfast ? "Breakfast" : "Snack")
    const {state:{index,schoolId,studentID}} = useLocation()
    const {orderStateData : {previewOrder}, orderDispatch} = useContext(orderMealContext)
    console.log("previewOrder==========",previewOrder)
    const {orderMealData} = useOrderMealMenu({studentID,schoolId,breakfast,lunch})
    const [stateData,setStateData] = useState({
        weekStartDate : moment().startOf('week'),
        weekEndDate :  moment().endOf('week'),
       
    })
    const [key, setKey] = useState('month');
    const [yearMonth,setYearMonth] = useState(parseInt(moment().format("YYYYMM")))
    const [eventData,setEventData] = useState([])
    
    //const yearMonth = 202201
    const selectEvent = ()=>{
        
    }
   
    const compare=( a, b )=> {
      if ( a.name < b.name ){
        return -1;
      }
      if ( a.name > b.name ){
        return 1;
      }
      return 0;
    }
    const validateDates=(calEvent)=>{
      const _menuObj=orderMealData.availableMenu || {}
      const activeMonthMenuObj=_menuObj[yearMonth]||{};
      if(calEvent._d<new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate())){
          return true
      }        
      if((activeMonthMenuObj.cutOffType=='W') && (activeMonthMenuObj.weeklyOrderCutOffDay||'')!==''){
          if(!isParent){
              return false;
          }
          const isSundayHidden=hiddenDays.includes(0);
          let isIso=false;
          if(isSundayHidden){
              isIso=true;
          }
          const weekDay=activeMonthMenuObj.weeklyOrderCutOffDay;
          const weekTime=moment(activeMonthMenuObj.weeklyOrderCutOffTime,'HH:mm');
          let weekDayDate = isIso?moment().isoWeekday(weekDay) :moment().day(weekDay);
          const weekDayStart=isIso?moment().isoWeekday(weekDay).startOf('isoWeek') :moment().day(weekDay).startOf('week');
          let weekDayEnd=isIso?moment().isoWeekday(weekDay).endOf('isoWeek'):moment().day(weekDay).endOf('week');

          let nextWeekDayStart=isIso?moment().isoWeekday(weekDay).add('week',1).startOf('isoWeek'):moment().day(weekDay).add('week',1).startOf('week');
          let nextWeekDayEnd=isIso?moment().isoWeekday(weekDay).add('week',1).endOf('isoWeek'):moment().day(weekDay).add('week',1).endOf('week');

          /* if(weekDayEnd.format('MM')!==weekDayStart.format('MM')){
              if(moment().format('MM')!==weekDayEnd.format('MM')){
              weekDayEnd=moment(weekDayStart).endOf('M');
              nextWeekDayStart=moment(weekDayStart);
              nextWeekDayEnd=moment(weekDayEnd);
              }
              else{
                  return false;
              }
          } */
          if(calEvent.set({hour:0,minute:0,second:0,millisecond:0})>=weekDayStart.set({hour:0,minute:0,second:0,millisecond:0}) &&
          calEvent.set({hour:0,minute:0,second:0,millisecond:0})<=weekDayEnd.set({hour:0,minute:0,second:0,millisecond:0})){
              return true;
          }else if(calEvent.set({hour:0,minute:0,second:0,millisecond:0})>=nextWeekDayStart.set({hour:0,minute:0,second:0,millisecond:0}) &&
          calEvent.set({hour:0,minute:0,second:0,millisecond:0})<=nextWeekDayEnd.set({hour:0,minute:0,second:0,millisecond:0})){
              //if(moment().set({hour:0,minute:0,second:0,millisecond:0})>weekDayDate.set({hour:0,minute:0,second:0,millisecond:0})){
              if(moment()>weekDayDate.set({hour:weekTime.hour(),minute:weekTime.minutes(),second:0,millisecond:0})){
                  return true;
              }else{
                  return false;
              }
          }else{
              return false;
          }
      }else {
          if(activeMonthMenuObj.cutOffType=='M'){
              if(!isParent){
                  return false;
              }
              if((activeMonthMenuObj.cutOffDatetime||'')!==''){                    
                  let cutOffDate=moment(activeMonthMenuObj.cutOffDatetime);
                  if(activeMonthMenuObj.orderDateExtensionStatus){
                      return false;
                  }
                 //else if(moment().set({hour:0,minute:0,second:0,millisecond:0})>cutOffDate.set({hour:0,minute:0,second:0,millisecond:0})){
                  else if(moment()>cutOffDate){
                      return true;
                  }else{
                      return false;
                  }
              }
          }else if(activeMonthMenuObj.cutOffType=='R')  {
              const adjustDays=parseInt(convertTwoDecimalPoint(activeMonthMenuObj.allowOrderNDaysBefore));
              const endDate=moment().add('day',adjustDays);
              
              if(!isParent){
                  const time={
                      hour:(new Date().getHours()),
                      minute:(new Date().getMinutes()),
                      second:(new Date().getSeconds()),
                      millisecond:(new Date().getMilliseconds())
                    }
                  const cEvent=moment(calEvent).set({hour:11,minute:0,second:0,millisecond:0});
                  const cEndDate=moment().set(time)
                  //const cEndDate=endDate.set(time)
                  return (cEvent<cEndDate)?true:false;
              }else{
                  const cutOffTime=moment(activeMonthMenuObj.weeklyOrderCutOffTime,'HH:mm');
                  return (calEvent<=endDate.set({
                      hour:cutOffTime.hours(),
                      minute:cutOffTime.minute(),
                      second:0,
                      millisecond:0
                  }))?true:false;
              }
          }else{
              return false;
          }
      }    
    }
 
    const renderDayEventList = (eventDate)=>{
     
      const groupByDate=groupBy(eventData,'date');
      const eventsObj=groupBy((groupByDate[eventDate.format('YYYY-MM-DD')]||[]),'type');
      return (<div key= {eventDate}>
      {(Object.keys(eventsObj)).map((item,key)=>{
        const events = eventsObj[item]
        const isItemsSelected = events.find(item=>item.selected)

        return (<div key={key}>
          {(( item !== "HOLIDAY" && !previewOrder ) || (previewOrder && isItemsSelected)) && 
            <p className="groupTitle">
                <small>{MealTypesText[item]}</small>
                <hr className="menuItemDivision" />
            </p>
          }
          <RenderItems
            events = {events}
            eventDate = {eventDate}
            item={item}
            studentData= {studentData}
            validateDates = {validateDates}
            currency_symbol ={currency_symbol}
            orderType = {orderType}
          />
       
        </div>
          
        )
        
      })}
      </div>)
    }
    useEffect(()=>{
     if(Object.keys(orderMealData).includes("availableMenu")){
      const menuMonthData = orderMealData?.availableMenu[yearMonth] ?  orderMealData?.availableMenu[yearMonth]['menuItemsList'] : []
      setEventData(menuMonthData)
     }
     
    },[orderMealData])
    return (<>
    <Row>
      <Col xs="auto">
        <Nav  activeKey={key} onSelect={(k) => setKey(k)} variant="pills" className="nav-pills-falcon m-0">
          <Nav.Item>
            <Nav.Link as={Button} size="sm" eventKey="month">
              Month
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Button} size="sm" eventKey="week">
              Week
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </Col>
    </Row>
    <br/>
    {key === 'month' && 
    
        <MonthCalender 
                    id={`cCal-${yearMonth}`}
                    hiddenDays={[0,6]}
                    defaultDate={moment(yearMonth,'YYYYMM')}
                    events={eventData}
                    eventClick={ selectEvent}
                    onPrevMonthChange = {
                        ()=>{
                            
                            const nextMonth = moment(yearMonth,'YYYYMM').subtract(1,'month').format('YYYYMM')
                            // const menuMonthData = orderMealData?.availableMenu[yearMonth] ?  orderMealData?.availableMenu[yearMonth]['menuItemsList'] : []
                            // setEventData(menuMonthData)
                            setYearMonth(nextMonth)
                        }
                    }
                    onNextmonthChange = {
                        ()=>{
                            const nextMonth = moment(yearMonth,'YYYYMM').add(1,'month').format('YYYYMM')
                            setYearMonth(nextMonth)
                        }
                    }
                    renderDayEventList={renderDayEventList}
                    />
        }   
        {
            key === "week" && 
            <WeekCalender 
                id={`cCal-${yearMonth}`}
                hiddenDays={[0,6]}
                hideWeekEnds={true}
                defaultDate={moment(yearMonth,'YYYYMM')}
                events={eventData}
                eventClick={ selectEvent}
                weekStartDate={stateData.weekStartDate} 
                weekEndDate={stateData.weekEndDate}
                menuItems = {eventData}
                onPrevWeekChange={()=>{ 
                    setStateData({
                        weekStartDate: stateData.weekStartDate.subtract(1,'week'),
                        weekEndDate: stateData.weekEndDate.subtract(1,'week')
                    })
                }}
                    
                onNextWeekChange={()=>{
                    setStateData({
                        weekStartDate: stateData.weekStartDate.add(1,'week'),
                        weekEndDate: stateData.weekEndDate.add(1,'week')
                    })
                    }}
                    renderDayEventList = {renderDayEventList}
                />
        }    
            
            
    </>)
})

export default OrderMealComponent