import React, { Component } from 'react';
import { 
    Col, Row, 
     Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';

class SchoolYearHeader extends Component {
    constructor(props){
        super(props)
        this.state={
            dropdownOpen:false
        }
    }
    toggle= () => this.setState({dropdownOpen: !this.state.dropdownOpen});
    render() {
        const {schoolYears, selectedSchoolYear, onSchoolYearChange}=this.props;
        return (
            <Row noGutters className="bg-100 rounded-soft px-card py-2 mt-2 mb-3 ">
                <Col className="d-flex align-items-center">
                </Col>
                <Col xs="auto" className="d-flex">
                    <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle} >
                        <DropdownToggle caret className="btn btn-falcon-default" size={'sm'}>
                            {selectedSchoolYear.name ||'...'}
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem key={-1} header>School Year</DropdownItem>
                            {
                                (schoolYears||[]).map((itm,i)=>{
                                    return <DropdownItem key={i} onClick={(e)=>{
                                        onSchoolYearChange(itm);
                                    }}>{itm.name}</DropdownItem>
                                })
                            }
                        </DropdownMenu>
                    </Dropdown>
                    
                </Col>
            </Row>
        );
    }
}

export default SchoolYearHeader;