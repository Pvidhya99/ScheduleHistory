import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { DropdownItem, DropdownMenu, DropdownToggle, Dropdown } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

library.add(faBars);

const SchoolDashboardDropdown = ({mealSchoolId}) => {

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen(prevState => !prevState);
  const navigate = useHistory()
  const addLunchBalance = (schoolId) =>{
    navigate.push("/parent/addlunchbalance",{schoolId})
  }
  const dailySpendingLimit = (schoolId) =>{
    navigate.push("/parent/dailyspendlimit",{schoolId})
  }
  return (
    <Dropdown
      isOpen={dropdownOpen}
      toggle={toggle}
     
    >
      <DropdownToggle nav className="pr-0">
      <FontAwesomeIcon icon="bars" className="me-1" />
      </DropdownToggle>
      <DropdownMenu right className="dropdown-menu-card">
        <div className="bg-white rounded-soft py-2">
          <DropdownItem onClick={()=>{addLunchBalance(mealSchoolId)}}>
            Add Balance
          </DropdownItem>
          <DropdownItem onClick={()=>{dailySpendingLimit(mealSchoolId)}} >
            Spending Limit
          </DropdownItem>
          <DropdownItem onClick={()=>{}} >
            Meal Benefits Application
          </DropdownItem>
        </div>
      </DropdownMenu>
    </Dropdown>
  );
};

export default SchoolDashboardDropdown;
