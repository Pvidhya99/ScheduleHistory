export const orderMealReducer = (state, action) => {
    const { type, payload } = action;
    switch (type) {
      case 'SET_ORDER_TYPE':
          console.log("SET_ORDER_TYPE")
        return {
          ...state,
          orderType: payload,
        };
      case 'UPDATE_PREVIEW_ORDER_STATUS':
          console.log("UPDATE_PREVIEW_ORDER_STATUS")
        return {
          ...state,
          previewOrder: !state.previewOrder
          
        };
      case 'UPDATE_SELECTED_ITEMS':
          console.log("UPDATE_SELECTED_ITEMS")
          const {event,orderType} = payload
          const existedItems = state.selectedItems
          if(!Object.keys(existedItems).includes(orderType)){
            existedItems[orderType] = []
          }
          if(existedItems[orderType].length > 0 ){
            if(event.type === "MEAL" && event.type === "SIDE" && event.selected){
              const y = existedItems[orderType].filter(item=>  {
                const isExisted = item.date === event.date && item.type !== "MEAL"  && item.type !== "SIDE"
                return isExisted
              })
              existedItems[orderType] = JSON.parse(JSON.stringify(y))
            }
            const isExisted = existedItems[orderType].find(item=>item.mealCalendarId === event.mealCalendarId)
            if(!isExisted){
              existedItems[orderType].push(event)
            }else{
              const x = existedItems[orderType].filter(item=>item.mealCalendarId !== event.mealCalendarId)
              existedItems[orderType] = JSON.parse(JSON.stringify(x))
            }
          }else{
            existedItems[orderType].push(event)
          }
          

        return {
          ...state,
          selectedItems: existedItems,
          count : state.count+1
        };
      
      default:
        return state;
    }
  };
  