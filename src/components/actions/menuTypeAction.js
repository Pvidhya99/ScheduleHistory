export const showMenuTypeBar=async(dispatch)=>{
    await dispatch({ type: 'SHOW_HIDE_MENUTYPE_BAR', payload:true });
}
export const hideMenuTypeBar=async(dispatch)=>{
    await dispatch({ type: 'SHOW_HIDE_MENUTYPE_BAR', payload:false });
}

export const showSchoolDrowdown=async(dispatch)=>{
    await dispatch({ type: 'SHOW_HIDE_SCHOOL_DD', payload:true });
}
export const hideSchoolDrowdown=async(dispatch)=>{
    await dispatch({ type: 'SHOW_HIDE_SCHOOL_DD', payload:false });
}

export const showMenuTypeTabs=async(dispatch)=>{
    await dispatch({ type: 'SHOW_HIDE_MENUTYPE_TABS', payload:true });
}
export const hideMenuTypeTabs=async(dispatch)=>{
    await dispatch({ type: 'SHOW_HIDE_MENUTYPE_TABS', payload:false });
}