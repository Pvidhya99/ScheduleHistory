import React, { useContext } from 'react';
import {  Nav, NavItem, NavLink, UncontrolledTooltip } from 'reactstrap';
import ProfileDropdown from './ProfileDropdown';
import SettingsAnimatedIcon from './SettingsAnimatedIcon';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';
import AppContext from '../../context/Context';
import classNames from 'classnames';
import { navbarBreakPoint } from '../../config';

library.add(faSignOutAlt);

const TopNavRightSideNavItem = (props) => {
  const { isTopNav, isCombo } = useContext(AppContext);
  return (
    <Nav navbar className="navbar-nav-icons ml-auto flex-row align-items-center">
      {
        !props.parent ? 
          <>
            <NavItem>
            <SettingsAnimatedIcon />
          </NavItem>
          {(isCombo || isTopNav) && (
            <NavItem className={classNames(`p-2 px-lg-0 cursor-pointer`, { [`d-${navbarBreakPoint}-none`]: isCombo })}>
              <NavLink tag={Link} to="/changelog" id="changelog">
                <FontAwesomeIcon icon="code-branch" transform="right-6 grow-4" />
              </NavLink>
              <UncontrolledTooltip autohide={false} placement="left" target="changelog">
                Changelog
              </UncontrolledTooltip>
            </NavItem>
          )}
          <ProfileDropdown onProfileItemClcik={(action)=>{props.onRightSideNavItemClick(action)}} />
          </>
        :
        <>
        <NavItem className={classNames(`p-2 px-lg-0 cursor-pointer`)}>
        <NavLink tag={Link} to="/parent" id="dashboard" className='text-primary'>
          <FontAwesomeIcon icon="home" transform="right-6 grow-4"  size='lg'/>
         
          </NavLink>
        </NavItem>
        <NavItem className={classNames(`p-2 px-lg-0 cursor-pointer`)}>
          <NavLink tag={Link} to="/settings" id="settings" className='text-warning'>
            <FontAwesomeIcon icon="cog" transform="right-6 grow-4" size='lg'/>
          </NavLink>
        </NavItem>
        <NavItem className={classNames(`p-2 px-lg-0 cursor-pointer`)}>
          <NavLink tag={Link} to="/help" id="help" className='text-success'>
            <FontAwesomeIcon icon="question-circle" transform="right-6 grow-4" size='lg'/>
          </NavLink>
        </NavItem>
        <NavItem className={classNames(`p-2 px-lg-0 cursor-pointer`)}>
          <NavLink tag={Link} to="/logout" id="logout" className='text-info'>
          <FontAwesomeIcon icon="sign-out-alt" transform="right-6 grow-4" style={{fontSize:21,marginTop:5}}/>
          </NavLink>
        </NavItem>
        </>    
      }
      
    </Nav>
  );
};

export default TopNavRightSideNavItem;
