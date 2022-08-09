import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Collapse, Navbar, NavItem, Nav } from 'reactstrap';
import classNames from 'classnames';
import AppContext, { ParentContext } from '../../context/Context';
import Logo from './Logo';
import SearchBox from './SearchBox';
import TopNavRightSideNavItem from './TopNavRightSideNavItem';
import NavbarTopDropDownMenus from './NavbarTopDropDownMenus';
import { topNavbarBreakpoint } from '../../config';
import autoCompleteInitialItem from '../../data/autocomplete/autocomplete';
import { parentReducer } from '../../reducers/parentReducer';

const NavbarTop = (props) => {
  const {
    isTopNav,
    navbarCollapsed,
    setNavbarCollapsed
  } = useContext(AppContext);
  const [showDropShadow, setShowDropShadow] = useState(false);
  const {parentStateData :{pageTitle}} = useContext(ParentContext);
  const setDropShadow = () => {
    const el = document.documentElement;
    if (el.scrollTop > 0) {
      setShowDropShadow(true);
    } else {
      setShowDropShadow(false);
    }
  };
  useEffect(() => {
    window.addEventListener('scroll', setDropShadow);
    return () => window.removeEventListener('scroll', setDropShadow);
  }, []);


  return (
    <Navbar
      light
      //className="navbar-glass fs--1 font-weight-semi-bold row navbar-top sticky-kit"
      className={classNames('navbar-glass  fs--1 navbar-top sticky-kit', {
        // 'navbar-glass-shadow': showDropShadow
        'navbar-glass-shadow': showDropShadow 
      })}
      expand={isTopNav && topNavbarBreakpoint}
    >
     
      <Logo at="navbar-top" width={120} id="topLogo" />
      {isTopNav ? (
        <Collapse navbar isOpen={navbarCollapsed} className={`scrollbar ${props.parent ? "justify-content-center" : ''}`}>
           {props.parent ? <h4 style={{color:"#ea7066"}}>{pageTitle}</h4> :
              <Nav navbar>
              <NavbarTopDropDownMenus setNavbarCollapsed={setNavbarCollapsed} />
            </Nav> 
            }
         
        </Collapse>
      ) : (
        <Nav navbar className={`align-items-center d-none d-${topNavbarBreakpoint}-block`}>
          <NavItem>
            <SearchBox autoCompleteItem={autoCompleteInitialItem} />
          </NavItem>
        </Nav>
      )}
     
      <TopNavRightSideNavItem onRightSideNavItemClick={(action)=>{props.onRightSideNavItemClick(action)}} {...props}/>
    </Navbar>
  );
};

export default NavbarTop;