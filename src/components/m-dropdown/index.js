import React, {useState} from 'react';
import {Dropdown} from 'reactstrap';
const MDropdown=(props)=>{
    const {children, className, direction}=props;
    const [dropdownOpen, setDropdownOpen]=useState(false);
    const toggle=()=>setDropdownOpen(!dropdownOpen);
    return <Dropdown className={className} direction={direction} isOpen={dropdownOpen} toggle={toggle}>
                {children}                
            </Dropdown>
}
export default MDropdown