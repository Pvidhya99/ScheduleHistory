export const parentReducer = (state, action) => {
    const { type, payload } = action;
    switch (type) {
      case 'SET_STUDENTS_LIST':
        return {
          ...state,
          studentsListData: payload,
        };
      
      case 'UPDATE_TITLE':
        return {
          ...state,
          pageTitle: payload,
        };
      
      default:
        return state;
    }
  };
  