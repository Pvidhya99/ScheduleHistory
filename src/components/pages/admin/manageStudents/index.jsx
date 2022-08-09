import React, { Component } from 'react';
import { withRouter } from "react-router";
import { Alert, Card, CardBody, Col, Row, TabContent, TabPane, Nav, NavItem, NavLink, Button, ButtonGroup  } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { dial_code, mobileNoLength } from '../../../../server/constants';
import classnames from 'classnames';
import Loader from '../../../common/Loader';
import TooltipItem from '../../../tooltip';
import { _delete, get, patch, postWithHeaders, postWithHeadersResponse, put,putWithHeadersResponse } from '../../../../server/actions'
import FalconCardHeader from '../../../common/FalconCardHeader';
import {  formatDate, numberOnly, getGradeNumberByText, getModuleEnum, getAccessLevelByModule, getSchoolGrades, groupBy } from '../../../../server/util'
import RTable from '../../../rtable';
import { object } from 'prop-types';
import { toast } from 'react-toastify';
const enumBtnGroup={
    'All':'All',
    'invited':'invited',
    'notInvited':'notInvited',
    'registered':'registered',
    'notRegistered':'notRegistered',
    'enrollBC_AC':'enrollBC&AC',
    'Free':'Free',
    'Reduced':'Reduced',
    'Regular':'Regular',
    'BC':'BC',
    'AC':'AC'
}
const parentEmailsEnum= {
    primary:'Primary email',
    alternate:'Alternate email',
    both:'Both emails'
}
const modEnum=getModuleEnum();
let gradeList=[];
let teacherNames=[];
class ManageStudents extends Component {
    constructor(props){
        super(props);
        this.state={
            activeTab:0,
            tooltipOpen:false,
            loading:false,
            studentsCount:0,
            students: [],
            data: [],
            mobileLength:mobileNoLength(),
            columns: [],
            selectAll:false,
            selection:[],
            search:'',
            selectedSchoolYear:{},
            selectedButtonGroup:enumBtnGroup.All
        }
    }
    componentDidMount=()=>{        
        this.setState({selectedSchoolYear:(this.props.selectedSchoolYear||{})},()=>{
            this.getDataByGrade('0')
        })
    }
    componentWillReceiveProps=(nextProps)=>{
        this.setState({selectedSchoolYear:nextProps.selectedSchoolYear},()=>{
            this.getDataByGrade(gradeList[this.state.activeTab].value)
        })
        
    }
    toggle = tab => {
        if (this.state.activeTab !== tab) 
            this.setState({activeTab:tab},()=>{                
                this.getDataByGrade(gradeList[tab].value)
            });
      };
    getColumns=(data)=> {
        let columns = [];
        let header = ['First Name', 'Last Name', 'Teacher Name', 'Parent EmailId', 'Parent MobileNo', 'Actions'];
        if (data.length === 0) {
            header.map(key =>
                columns.push({ Header: key }));
        }
        else {
            columns.push({
                accessor: 'fullName',
               id:"fullName",
                Header: 'Name',
                sortable: true,
                style: { textAlign: 'center' }
            });
            columns.push({
                accessor: 'teacherName',
                Header: 'Teacher Name',
                style: { textAlign: 'center' }
            });
            if(getAccessLevelByModule(modEnum.MKA)){
            columns.push({
                accessor: 'allergies',
                Header: 'Allergies',
                style: { textAlign: 'center', verticalAlign:'middle' },
                Cell:(props) => (
                    <>
                        <TooltipItem 
                        item={{text:props.value,tooltipContent:props.value,id:props.index, placement:'bottom'}}
                        children={<span className="cursor-pointer" id={`Tooltip-${props.index}`}>{props.value}</span>} />                        
                    </>
                )
            });
        }
            columns.push({
                accessor: 'parentuser.userName',
                Header: 'PARENT EMAILID',
                style: { textAlign: 'center' }
            });
            columns.push({
                accessor: 'mobileNum', // formatted mobile num for display
                Header: 'PARENT MOBILENO',
                style: { textAlign: 'center' }
            });
            columns.push({
                accessor:'grade',
                Header:'GRADE',
                style: { textAlign: 'center', textTransform:'capitalize' },
                Cell:(props)=>{                    
                    return <span>{props.original.grade}</span>        
                },
                width:75,
                show:this.state.tabIndex===0?true:false
            });
            columns.push({
                accessor:'pin',
                Header:'PIN',
                style: { textAlign: 'center', textTransform:'capitalize' },                
                width:75,
                show:this.state.tabIndex===0?false:true
            });
            columns.push({
                id: 'actionButton',
                accessor: "studentId",
                Header: 'ACTIONS',
                style: { textAlign: 'center' }, // className: "actions text-center"
                width:150,
                Cell: ({ row }) => (<>
                    <Button color="falcon-primary" size="sm" onClick={() => this.editRec( row._original)}>
                        <FontAwesomeIcon icon="pencil-alt" className="text-success fs-1" />                                       
                    </Button>
                    <Button color="falcon-primary" size="sm" onClick={() => this.openModal('deleteModalIsOpen', row._original)}>
                        <FontAwesomeIcon icon="trash-alt" className="text-danger fs-1" />                                       
                    </Button>
                    {
                        getAccessLevelByModule(modEnum.PR)?
                    <Button color="falcon-primary" size="sm" onClick={() => this.sendNotification('single', row._original)}>
                    <FontAwesomeIcon icon={['far', 'paper-plane']} className={row._original.register ?"text-info fs-1":"text-success fs-1"} />                                       
                    </Button>:null
                    }                    
                </>),
            });

        }
        return columns;
    }
    filterSchool = () => {
        let s = this.state.search;
        //alert(s)
        let filteredData = [];
        let filter =this.state.selectedButtonGroup; //document.getElementById('selector').querySelectorAll(".active")[0].getAttribute("name") || '';
            switch (filter) {
                case enumBtnGroup.invited:
                    this.state.students.map(item => {
                            if(item.register)
                                filteredData.push(item);
                    });
                    break;
                case enumBtnGroup.notInvited:
                    this.state.students.map(item => {
                        if(!item.register)
                            filteredData.push(item);
                    });
                    break;
                case enumBtnGroup.registered:
                    this.state.students.map(item => {
                        if(item.parentuser.isParentRegistered)
                            filteredData.push(item);
                    });
                    break;
                case enumBtnGroup.notRegistered:
                    this.state.students.map(item => {
                        if(!item.parentuser.isParentRegistered)
                            filteredData.push(item);
                    });
                    break;
                case enumBtnGroup.enrollBC_AC:
                    this.state.students.map(item => {
                        if(item.isEnrollBCAndACPkt)
                            filteredData.push(item);
                    });
                    break;
                case enumBtnGroup.Free:
                    this.state.students.map(item => {
                        if(item.isFreeMealEligible)
                            filteredData.push(item);
                    });
                    break;
                case enumBtnGroup.Reduced:
                    this.state.students.map(item => {
                        if(item.isReducePriceEligible)
                            filteredData.push(item);
                    });
                    break;
                case enumBtnGroup.Regular:
                    this.state.students.map(item => {
                        if(!item.isFreeMealEligible && !item.isReducePriceEligible)
                            filteredData.push(item);
                    });
                    break;
                case enumBtnGroup.BC:
                    this.state.students.map(item => {
                        if(item.beforeCare===true)
                            filteredData.push(item);
                    });
                    break;
                case enumBtnGroup.AC:
                    this.state.students.map(item => {
                        if(item.beforeCare!==true)
                            filteredData.push(item);
                    });
                    break;
                default:
                    filteredData=this.state.students;
                    break;
            }
        let searchedSchool = [];
        if (s.length > 0) {
            filteredData.forEach(obj => {
                if (obj._id != null && (obj._id.toLowerCase()).startsWith(s.toLowerCase())) {
                    searchedSchool.push(obj);
                } else if (obj.firstName != null && (obj.firstName.toLowerCase() + ' ' + obj.lastName.toLowerCase()).startsWith(s.toLowerCase())) {
                    searchedSchool.push(obj);
                } else if (obj.lastName != null && (obj.lastName.toLowerCase()).startsWith(s.toLowerCase())) {
                    searchedSchool.push(obj);
                } else if (obj.teacherName != null && (obj.teacherName.toLowerCase()).startsWith(s.toLowerCase())) {
                    searchedSchool.push(obj);
                } else if (obj.mobileNum != null && (obj.mobileNum.replace(/[()\-" ]+/g, '').toLowerCase()).startsWith(s.toLowerCase())) {
                    searchedSchool.push(obj);
                } else if (obj.parentuser.userName != null && (obj.parentuser.userName.toLowerCase()).startsWith(s.toLowerCase())) {
                    searchedSchool.push(obj);
                }
            });
            this.setState({ data: searchedSchool });
        }
        else {
            this.setState({ data: searchedSchool.length == 0 ? filteredData : searchedSchool });
        }
    };    
    getDataByGrade=(gradeName)=> {
        let teachers = [];
        let studentsByGrade = [];
        const {selectedSchoolYear}=this.state
        this.setState({ loading: true });
        let schoolId = sessionStorage.getItem('SchoolId');
        if(Object.keys(selectedSchoolYear||{}).length===0){
            return false;
        }
        
        get('/studentUsers/search/findByIsActiveAndMealSchoolSchoolIdAndSchoolYear?isActive=true&schoolId=' + schoolId + '&schoolYear=' + (selectedSchoolYear||{}).schoolYear+ '&access_token=')
            .then((response) => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response.json();
            }).then(data => {
                const stData = data['_embedded']['studentUsers'];
                this.setState({ studentsCount: stData.length });
                const gradesGroup=groupBy(getSchoolGrades(),'value');                 
                if((gradeName||'0')=='0'){
                    return stData.map(item => {
                        let _id = item.studentId;
                        item.fullName=item.lastName+', '+item.firstName;
                        item.grade=((gradesGroup[item.gradeName]||[])[0]||{}).label||'';
                        teachers.push(item.teacherName);
                        let mobileNum=item.mobileNo||''
                        return {
                            _id,
                            mobileNum,
                            ...item
                        };
                    });
                }
                else{
                    stData.map(item => { //pushes all students for grade selected into an array
                        let _gradeName = item.gradeName;    
                        if (_gradeName === gradeName) {
                            item.grade=((gradesGroup[item.gradeName]||[])[0]||{}).label||'';
                            studentsByGrade.push(item);
                        }
                    });
                    return studentsByGrade.map(item => {
                        let _id = item.studentId;
                        item.fullName=item.lastName+', '+item.firstName
                        teachers.push(item.teacherName);
                        let mobileNum =item.mobileNo||'';
                        return {
                            _id,
                            mobileNum,
                            ...item
                        };
                    });
                }
            }).then(data => {
                let columns = this.getColumns(data);
                if (gradeName === 0) {
                    teacherNames = [...new Set(teachers)]
                }
                this.setState({
                    students: data,
                    data: data,
                    columns: columns,
                    loading: false,
                    studentCount: data.length,
                    selectAll:false,
                    selection:[]
                },()=>{
                    this.filterSchool();
                })
                
            }).catch(
                (error) => {
                    this.setState({ loading: false })
                    console.log('Get School data response', error)
                }
            );
    }
    buttonFiterGroup=()=>{
        const {selectedButtonGroup}=this.state
        const onChangeButtonGroupSelection=(e)=>{
            this.setState({selectAll:false, selection:[] ,selectedButtonGroup:e.target.name},()=>{
                this.filterSchool()
            })
        }
        return <ButtonGroup>
                    <Button
                    outline 
                    name={enumBtnGroup.All}
                    color="primary"
                    onClick={(e) => {onChangeButtonGroupSelection(e)}}
                    active={selectedButtonGroup===enumBtnGroup.All}>
                    All
                    </Button>
                    { getAccessLevelByModule(modEnum.PR)?<>
                        <Button
                        outline 
                        name={enumBtnGroup.invited}
                        color="primary"
                        onClick={(e) => {onChangeButtonGroupSelection(e)}}
                        active={selectedButtonGroup===enumBtnGroup.invited}>
                        Invited
                        </Button>
                        <Button
                        name={enumBtnGroup.notInvited}
                        outline 
                        color="primary"
                        onClick={(e) => {onChangeButtonGroupSelection(e)}}
                        active={selectedButtonGroup===enumBtnGroup.notInvited}>
                        Not Invited
                        </Button>
                        <Button
                        outline 
                        name={enumBtnGroup.registered}
                        color="primary"
                        onClick={(e) => {onChangeButtonGroupSelection(e)}}
                        active={selectedButtonGroup===enumBtnGroup.registered}>
                        Registered
                        </Button>
                        <Button
                        outline 
                        color="primary"
                        name={enumBtnGroup.notRegistered}
                        onClick={(e) => {onChangeButtonGroupSelection(e)}}
                        active={selectedButtonGroup===enumBtnGroup.notRegistered}>
                        Not Registered
                        </Button>                    
                    </>:null
                    }
                    { getAccessLevelByModule(modEnum.MCS)?
                        <Button
                        outline 
                        name={enumBtnGroup.enrollBC_AC}
                        color="primary"
                        onClick={(e) => {onChangeButtonGroupSelection(e)}}
                        active={selectedButtonGroup===enumBtnGroup.enrollBC_AC}>
                        Enroll B & A.C
                        </Button>:null
                    }
                     { getAccessLevelByModule(modEnum.LETM)?
                     <>
                        <Button
                        outline 
                        name={enumBtnGroup.Free}
                        color="primary"
                        onClick={(e) => {onChangeButtonGroupSelection(e)}}
                        active={selectedButtonGroup===enumBtnGroup.Free}>
                        Free
                        </Button>
                        <Button
                        outline 
                        name={enumBtnGroup.Reduced}
                        color="primary"
                        onClick={(e) => {onChangeButtonGroupSelection(e)}}
                        active={selectedButtonGroup===enumBtnGroup.Reduced}>
                        Reduced
                        </Button>
                        <Button
                        outline 
                        name={enumBtnGroup.Regular}
                        color="primary"
                        onClick={(e) => {onChangeButtonGroupSelection(e)}}
                        active={selectedButtonGroup===enumBtnGroup.Regular}>
                        Regular
                        </Button>
                     </>:null
                    }
                    {
                        getAccessLevelByModule(modEnum.BACM)?
                        <>
                            <Button
                            outline 
                            name={enumBtnGroup.BC}
                            color="primary"
                            onClick={(e) => {onChangeButtonGroupSelection(e)}}
                            active={selectedButtonGroup===enumBtnGroup.BC}>
                            Before Care
                            </Button>
                            <Button
                            outline 
                            name={enumBtnGroup.AC}
                            color="primary"
                            onClick={(e) => {onChangeButtonGroupSelection(e)}}
                            active={selectedButtonGroup===enumBtnGroup.AC}>
                            After Care
                            </Button>                                    
                        </> 
                        :null
                    }
                </ButtonGroup>
    }
    changeB_ACare=(isBeforeCare)=>{
        let selectedRows = this.state.selection.map(s=>{
            return s.replace('select-','');
        });
        const {selectedSchoolYear}=this.state
       let data = {};
       let schoolId = sessionStorage.getItem('SchoolId');
       if (this.state.selectAll && this.state.activeTab === 0 && this.state.studentCount === (this.state.selection).length) {
        data= {
                "schoolId":schoolId,
                "schoolYear":(selectedSchoolYear||{}).schoolYear,
                "isFreeLunch":null,
                "isBeforeCare":isBeforeCare
            };
       }
       else if (this.state.selectAll && this.state.activeTab !== 0 && this.state.studentCount === (this.state.selection).length) {
            data= {
                "schoolId":schoolId,
                "schoolYear":(selectedSchoolYear||{}).schoolYear,
                "gradeName":this.state.tabIndex,
                "isFreeLunch":null,
                "isBeforeCare":isBeforeCare
            };
       } else{
            selectedRows = this.state.selection.map(s=>{
                return s.replace('select-','');
            });;
            if(selectedRows.length !== 0){
                data = {
                    "schoolId": schoolId,
                    "schoolYear":(selectedSchoolYear||{}).schoolYear,
                    "isFreeLunch":null,
                    "isBeforeCare":isBeforeCare,             
                    "studentIds": selectedRows
                }
            }else{                
                toast.error('Please select atleast one student.');
                return false;
            }
       }
       let headers = {
        'Content-Type': 'application/json'
        };
    postWithHeaders('/freeReducedLunchEligUpdate?access_token=', JSON.stringify(data), headers).then((response) => {
        if (response.status === 200) {
            
            this.setState({ loading: false,selection:[],selectionStuList:{},selectAll:false });
            let _message=isBeforeCare?'Successfully updated before care status.':'Successfully updated after care status.'
            toast.success(_message);            
            this.getDataByGrade(this.state.activeTab);
        } else if (!response.ok) {
            throw Error(response.statusText);
        }
    }).catch(
        (error) => {
            toast.error('Failed to send link ! Try again.');
            console.log('Send Notification Error', error)
        }
    );

    }


    changeFreeOrRedPrice=(isFreeLunch)=>{
       let selectedRows = this.state.selection.map(s=>{
            return s.replace('select-','');
        });
       const {selectedSchoolYear}=this.state
       let data = {};
       let schoolId = sessionStorage.getItem('SchoolId');
       if (this.state.selectAll && this.state.tabIndex === 0 && this.state.studentCount === (this.state.selection).length) {
            data= {
                    "schoolId":schoolId,
                    "schoolYear":(selectedSchoolYear||{}).schoolYear,
                    "isFreeLunch":isFreeLunch
                };
       }
       else if (this.state.selectAll && this.state.tabIndex !== 0 && this.state.studentCount === (this.state.selection).length) {
            data= {
                "schoolId":schoolId,
                "schoolYear":(selectedSchoolYear||{}).schoolYear,
                "gradeName":this.state.tabIndex,
                "isFreeLunch":isFreeLunch
            };
       } else{
            selectedRows = this.state.selection.map(s=>{
                return s.replace('select-','');
            });;
            if(selectedRows.length !== 0){
                data = {
                    "schoolId": schoolId,
                    "schoolYear":(selectedSchoolYear||{}).schoolYear,
                    "isFreeLunch":isFreeLunch,                
                    "studentIds": selectedRows
                }
            }else{                
                toast.error('Please select atleast one student.');
                return false;
            }
       }
        let headers = {
            'Content-Type': 'application/json'
            };
        postWithHeaders('/freeReducedLunchEligUpdate?access_token=', JSON.stringify(data), headers).then((response) => {
            if (response.status === 200) {
                
                this.setState({ loading: false,selection:[],selectionStuList:{},selectAll:false });
                let _message=isFreeLunch?'Succesfully updated free lunch eligibility status.':'Succesfully updated reduced price lunch eligibility status.'
                toast.success(_message);            
                this.getDataByGrade(this.state.tabIndex);
            } else if (!response.ok) {
                throw Error(response.statusText);
            }
        }).catch(
            (error) => {
                this.setState({ loading: false })
                toast.error('Failed to send link ! Try again.');
                console.log('Send Notification Error', error)
            }
        );
    }

    sendNotification=(action, row)=> {
        const {selectedSchoolYear}=this.state
        this.setState({ loading: true })
        let selectedRows = [];
        let data = {};
        let schoolId = sessionStorage.getItem('SchoolId');
        if (action === 'single') {
            selectedRows = [row.studentId];
            data = {
                "schoolId": schoolId,
                "notificationType": "Registration",
                "studentIds": selectedRows,
                "sendStatus": "true",
                "schoolYear": (selectedSchoolYear||{}).schoolYear,
            }
        }
        else if (action === 'multiple') {
            if (this.state.selectAll && this.state.activeTab === 0 && this.state.studentCount === (this.state.selection).length) {
                data = {
                    "schoolId": schoolId,
                    "notificationType": "Registration",
                    "sendStatus": "true",
                    "schoolYear": (selectedSchoolYear||{}).schoolYear,
                }
            }
            else if (this.state.selectAll && this.state.activeTab !== 0 && this.state.studentCount === (this.state.selection).length) {
                data = {
                    "schoolId": schoolId,
                    "notificationType": "Registration",
                    "gradeName": this.state.activeTab,
                    "schoolYear": (selectedSchoolYear||{}).schoolYear,
                    "sendStatus": "true"
                }
            }
            else {
                selectedRows = this.state.selection.map(s=>{
                    return s.replace('select-','');
                });;
                selectedRows.length !== 0 ? data = {
                    "schoolId": schoolId,
                    "notificationType": "Registration",
                    "studentIds": selectedRows,
                    "schoolYear": (selectedSchoolYear||{}).schoolYear,
                    "sendStatus": "true"
                } : toast.error('Please select students to send link.');
            }
        }
        let headers = {
            'Content-Type': 'application/json'
        };

        postWithHeaders('/sendNotificationParents?access_token=', JSON.stringify(data), headers).then((response) => {
            if (response.status === 200) {
                this.setState({ loading: false })
                toast.success('Registration invite has been successfully sent!!');
                this.getDataByGrade(this.state.tabIndex);
            } else if (!response.ok) {
                throw Error(response.statusText);
            }
        }).catch(
            (error) => {
                this.setState({ loading: false })
                toast.error('Failed to send link ! Try again.');
                console.log('Send Notification Error', error)
            }
        );

    }
    editRec=(rec)=>{
        let data={...rec};
        let mobileNo=data.mobileNo||'';
            mobileNo=mobileNo.substr(-this.state.mobileLength);
            data.defaultNotifyEmail=data.defaultNotifyEmail||parentEmailsEnum.primary;
            data.parentuser.parentAltEmail=((data.parentuser.parentAltEmail=='N/A' || data.parentuser.parentAltEmail=='NA')?undefined:data.parentuser.parentAltEmail)
            data.mobileNo=mobileNo;
        this.props.history.push(`/schoolAdmin/manage/school/studentRec`,{ state: data});
    }
    render() {
        gradeList= getSchoolGrades();
        const {activeTab, selectedSchoolYear}=this.state;
        return (<>
            <Card className="mb-3">
                <FalconCardHeader title={`Manage Students Info For: ${(selectedSchoolYear||{}).name}`} >
                <div className="fs--1">
                    <Button className="mr-2" color="falcon-primary" size="sm" onClick={() => {
                        this.props.history.push(`/schoolAdmin/manage/school/studentRec`);
                    }}>
                        <FontAwesomeIcon icon={'plus'} className={"text-danger fs-1"} /> Add Student                                      
                    </Button>
                    <Button color="falcon-primary" size="sm" onClick={() => {}}>
                        <FontAwesomeIcon icon={'file-excel'} className={"text-success fs-1"} />                                       
                    </Button>                    
                </div>
                </FalconCardHeader>
                <CardBody className="fs--1">
                    <Row className="mb-1">
                        <Col>
                        {
                            this.buttonFiterGroup()
                        }
                        </Col>
                    </Row>
                    <Nav tabs>                        
                    {
                        gradeList.map((item,i)=>{
                            return <NavItem className='cursor-pointer'>
                                    <NavLink
                                        className={classnames({ active: activeTab === i })}
                                        onClick={() => { this.toggle(i); }}>
                                    {item.label}
                                    </NavLink>
                                </NavItem>
                        })
                    }
                    </Nav>
                    <TabContent activeTab={activeTab}>
                    {
                        gradeList.map((item,i)=>{
                            return <TabPane tabId={i}>
                                <Row className="mb-1 mt-1">
                                    <Col xs={3}>
                                        <input type="text" className="form-control" value={this.state.search} autocomplete="off"
                                            name="search" placeholder="Search.." onChange={(e) => {
                                                this.setState({search:e.target.value},()=>{
                                                    this.filterSchool();
                                                })
                                            }}/> 
                                    </Col>                                    
                                    <Col className="text-right">
                                        <div className="fs--1">
                                            {
                                            getAccessLevelByModule(modEnum.LETM)?<>
                                                <Button color={'primary'} className="mr-1" onClick={() => this.changeFreeOrRedPrice(false)}>Reduced Price</Button>
                                                <Button color={'secondary'} className="mr-1" onClick={() => this.changeFreeOrRedPrice(true)}>Free Lunch</Button>
                                            </>:null
                                            }
                                            {
                                                getAccessLevelByModule(modEnum.PR)?
                                                    <Button color={'success'} className="mr-1" onClick={() => this.sendNotification('multiple')}>Send Link</Button>:null
                                            }
                                            {
                                                getAccessLevelByModule(modEnum.BACM)?<>
                                                    <Button color={'warning'} className="mr-1" onClick={() => this.changeB_ACare(true)}>Before Care</Button>
                                                    <Button color={'info'} onClick={() => this.changeB_ACare(false)}>After Care</Button>
                                                </>:null
                                            }
                                            
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <RTable
                                            selectAll={this.state.selectAll}
                                            selection={this.state.selection}
                                            ref={r => (this.checkboxTable = r)}
                                            isCheckBoxTable={true}
                                            sortable
                                            resizable
                                            
                                        // data={_.orderBy(this.state.data,['fullName'],['asc'])}
                                            data={this.state.data}
                                            columns={this.state.columns}
                                            defaultPageSize={10}
                                            setSelection={(selectedList)=>{
                                                this.setState({selection:selectedList})
                                            }}
                                            setSelectAll={(isSelectedAll)=>{
                                                this.setState({selectAll:isSelectedAll})
                                            }}
                                            />
                                    </Col>
                                </Row>
                            </TabPane>
                        })
                    }
                    </TabContent>
                </CardBody>
            </Card>
            <Card className="mb-3">

            </Card>
        </>
        );
    }
}

export default withRouter(ManageStudents);