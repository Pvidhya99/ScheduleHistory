import React, { useReducer } from 'react';
import { initialState, MenuTypeReducer } from '../reducers/menuTypeReducer';
const MenuTypeContext = React.createContext();
const MenuTypeDispatchContext = React.createContext();

export function useMenuTypeState() {
	const context = React.useContext(MenuTypeContext);
	try{	
		if (context === undefined) {
			throw new Error('useAuthState must be used within a AuthProvider');
		}		
		return context;
	}catch(ex){
		return context;
	}
}

export function useMenuTypeDispatch() {	
	const context = React.useContext(MenuTypeDispatchContext);
	if (context === undefined) {
		throw new Error('useAuthDispatch must be used within a AuthProvider');
	}

	return context;
}

export const MenuTypeProvider = ({ children }) => {
	const [data, dispatch] = useReducer(MenuTypeReducer, initialState);

	return (
		<MenuTypeContext.Provider value={data}>
			<MenuTypeDispatchContext.Provider value={dispatch}>
				{children}
			</MenuTypeDispatchContext.Provider>
		</MenuTypeContext.Provider>
	);
};