export const initialState = {
	selectedSchool: undefined ,
	selectedMenuType:undefined,
	showMenuTypeBar:true,
	showDDSchool:true,
	showMenuTypeTabs:true,
	loading: false,
	errorMessage: undefined,
};

export const MenuTypeReducer = (initialState, action) => {
	switch (action.type) {
		case 'SET_SCHOOL':
			return {
				...initialState,
				selectedSchool: action.payload,
				loading: false,
			};
		case 'SET_MENUTYPE':
			return {
				...initialState,
				selectedMenuType: action.payload,
                loading: false,
			};
		case 'SHOW_HIDE_MENUTYPE_BAR':
			return {
				...initialState,
				showMenuTypeBar: action.payload,
				loading: false,
			};
		case 'SHOW_HIDE_SCHOOL_DD':
			return {
					...initialState,
					showDDSchool: action.payload,
					loading: false,
				};
		case 'SHOW_HIDE_MENUTYPE_TABS':
			return {
				...initialState,
				showMenuTypeTabs: action.payload,
				loading: false,
			};

		case 'LOGIN_ERROR':
			return {
				...initialState,
				loading: false,
				errorMessage: action.error,
			};

		default:
			throw new Error(`Unhandled action type: ${action.type}`);
	}
};