import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import NavbarDropdownComponents from './NavbarDropdownComponents';
import {
  buildMenu
} from '../../routes';
import { NavItem } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { breakpoints } from '../../helpers/utils';
import { navbarBreakPoint, topNavbarBreakpoint } from '../../config';
import AppContext from '../../context/Context';

const NavbarTopDropDownMenus = ({ setNavbarCollapsed, setShowBurgerMenu }) => {
  const { isCombo, isTopNav } = useContext(AppContext);

  //const components = [componentRoutes, pluginRoutes, utilityRoutes];

  //const pages = [pageRoutes, calenderRoutes, kanbanRoutes, widgetsRoutes, chatRoutes, emailRoutes, ECommerceRoutes];

  const handleSetNavbarCollapsed = () => {
    const windowWidth = window.innerWidth;
    isTopNav && !isCombo && windowWidth < breakpoints[topNavbarBreakpoint] && setNavbarCollapsed(false);
    isCombo && windowWidth < breakpoints[navbarBreakPoint] && setShowBurgerMenu(false);
  };
  return (
    <>
    {
      (buildMenu()||[]).map((item,i)=>{
        if((item.children||[]).length===0){
          return  <NavItem key={i} onClick={handleSetNavbarCollapsed}>
          <NavLink className="nav-link" to={item.to}>
            {item.name}
          </NavLink>
        </NavItem>
        }else{
        return <NavbarDropdownComponents key={i} 
                title={item.name}
                items={item.children}
                handleSetNavbarCollapsed={handleSetNavbarCollapsed}/>
        }
      })
    }
      {/* <NavbarDropdown
        title={homeRoutes.name}
        items={homeRoutes.children}
        handleSetNavbarCollapsed={handleSetNavbarCollapsed}
      />
      <NavbarDropdown title={pageRoutes.name} items={pages} handleSetNavbarCollapsed={handleSetNavbarCollapsed} />
      <NavbarDropdownComponents
        title={componentRoutes.name}
        items={components}
        handleSetNavbarCollapsed={handleSetNavbarCollapsed}
      />
      <NavbarDropdown
        title={authenticationRoutes.name}
        items={authenticationRoutes.children}
        handleSetNavbarCollapsed={handleSetNavbarCollapsed}
      /> */}
    </>
  );
};

NavbarTopDropDownMenus.propTypes = { setNavbarCollapsed: PropTypes.func.isRequired };

export default NavbarTopDropDownMenus;
