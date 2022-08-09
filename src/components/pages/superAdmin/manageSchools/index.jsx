import React, {Component} from 'react';
import { withRouter } from "react-router";
import { Link } from 'react-router-dom';
import { 
    Alert, 
    Card, 
    CardBody, 
    Col, 
    CustomInput, 
    Form, 
    Input, 
    Row, 
    Button, 
    Label, 
    Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Loader from '../../../common/Loader';
import PageHeader from '../../../common/PageHeader';
import ButtonIcon from '../../../common/ButtonIcon'
import FalconCardHeader from '../../../common/FalconCardHeader'
import RTable from '../../../rtable'
import {get, _delete, patch } from "../../../../server/actions";
import {access_token} from '../../../../server/constants';
import { toast } from 'react-toastify';
let loggedUser = ''
class ManageSchool extends Component {
    constructor(props){
        super(props);
        this.state={
            search:'',
            schoolList:[],
            filterSchools:[],
            isActive:true,
            conformDelete:false,
            deleteRow:undefined,
            adminModalisOpen:false,
            adminData:undefined

        }
    }
    componentDidMount=()=>{
        loggedUser = sessionStorage.getItem('loggedInUserInfo') || '';
        this.getSchoolList();
    }
    deleteSchool = () => {
        const {deleteRow}=this.state;
        const mealSchoolId=deleteRow._links.self.href.split('/').pop()
        this.setState({loading: true});
        _delete('/mealSchools/' + mealSchoolId + '?access_token=').then((response) => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            console.log('response', response);
            return response;
        }).then(data => {
            toast.success("School Deleted Successfully.");
            this.getSchoolList();
            this.setState({deleteRow:undefined, loading: false, conformDelete: false});

        })
            .catch(
                (error) => {
                    toast.error('Delete task failed. Please try again later.');
                    this.setState({deleteRow:undefined, loading: false, conformDelete: false});
                    console.log('Delete School response', error)
                }
            )
    }
    restoreSchool = () => {
        const {deleteRow}=this.state;
        this.setState({loading: true});
        let body = JSON.stringify({
            "isActive": true
        });
        let mealSchoolId = deleteRow._links.self.href.split('/').pop();
        patch('/mealSchools/' + mealSchoolId + '?access_token=', body).then((response) => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            console.log('response', response);
            return response.json();
        }).then(data => {
            toast.success("School restored Successfully.")
            this.getSchoolList();
            this.setState({deleteRow:undefined, loading: false, conformDelete: false});
        })
            .catch(
                (error) => {
                    toast.error("Restore task failed. Please try again later.")
                    this.setState({deleteRow:undefined, loading: false, conformDelete: false});
                    console.log('Restore School response', error)
                }
            )
    }
    getSchoolList = () => {
        get(`/mealSchools/search/findByIsActive?isActive=${this.state.isActive}&page=0&size=2147483647&access_token=`).then((response) => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            console.log('response', response);
            return response.json();
        }).then(data => {
            let protocal = window.location.protocol;
            let mainDomain =window.location.host.replace(window.location.host.split('.')[0],'');
            data._embedded.mealSchools.map(obj => {
                return obj.adminurl = protocal+'//'+ obj.subdomain  + mainDomain;
            })
            this.setState({
                schoolList: data._embedded.mealSchools,
                filterSchools: data._embedded.mealSchools
            });
        })
        .catch(
            (error) => {
                this.setState({
                    schoolList: [],
                    filterSchools: []
                });
                console.log('Get SchoolList response', error)
            }
        )
    }
    filterSchoolList=()=>{
        let s = this.state.search;
        let searchedSchool = [];
        if (s.length > 0) {
            this.state.schoolList.forEach(obj => {
                if (obj.schoolName != null && (obj.schoolName.toLowerCase()).startsWith(s.toLowerCase())) {
                    searchedSchool.push(obj);
                } else if (obj.subdomain != null && (obj.subdomain.toLowerCase()).startsWith(s.toLowerCase())) {
                    searchedSchool.push(obj);
                } else if (obj.adminurl != null && (obj.adminurl.toLowerCase()).startsWith(s.toLowerCase())) {
                    searchedSchool.push(obj);
                }
                else if (obj.schoolUsers != null) {
                    let x = false;
                    obj.schoolUsers.forEach(user => {
                        if (user.username.toLowerCase().startsWith(s.toLowerCase())) {
                            x = true;
                        }

                    });
                    if(x === true)
                        searchedSchool.push(obj);
                }
            });
        }
        else {
            searchedSchool=this.state.schoolList;
        }
        this.setState({filterSchools:searchedSchool});
    }
    adminModal = (data, id) => {
        this.setState({adminData:data,adminModalisOpen: true})
    }
    deactivateAdmin = () => {
        const {adminData}=this.state;
        get('/enableDisableSchoolUser?schoolUserName=' + adminData.username + '&activeStatus=false&loggedUser=' + loggedUser + '&access_token=').then((response) => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response;
        }).then(data => {
            toast.success('Successfully deactivated admin.');
            this.getSchoolList();
            this.setState({
                loading: false,
                adminModalisOpen: false,
                adminData:undefined
            });
        })
            .catch(
                (error) => {
                    toast.error('Deactivation failed. Please try again later.');
                    console.log('Send Notification Links response', error)
                }
            )
    }
    reactivateAdmin = () => {
        const {adminData}=this.state
        get('/enableDisableSchoolUser?schoolUserName=' + adminData.username + '&activeStatus=true&loggedUser=' + loggedUser + '&access_token=').then((response) => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response;
        }).then(data => {
            toast.success('Successfully reactivated admin.');
            this.getSchoolList();
            this.setState({
                loading: false,
                adminModalisOpen: false,
                adminData:undefined
            });
        })
            .catch(
                (error) => {
                    toast.error('Deactivation failed. Please try again later.');
                }
            )
    }
    sendAdminLinks = (col,username) => {
        this.setState({loading: true});
        let mealschoolid = col._links.self.href.split('/').pop();
        get('/adminAccActivationInfo?schoolId=' + mealschoolid + '&loggedUser=' + loggedUser +'&schoolUserName='+username+ '&access_token=').then((response) => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response;
            }).then(data => {
                toast.success('Successfully sent emails.');
                this.setState({loading: false});
            }).catch(
                    (error) => {
                        toast.error('Send links failed. Please try again later.');
                        console.log('Send Notification Links response', error)
                    });
    };
    render() {
        const {search, filterSchools, isActive}=this.state;
        return (
            <>        
        <Card className="mb-3">
            <FalconCardHeader title="Schools">
                <div className="fs--1">
                    <ButtonIcon className="mr-2" color="primary" size="sm" icon="plus" transform="shrink-3" onClick={()=>{
                        this.props.history.push(`/SuperAdmin/manageSchool/onboardSchool/0`);

                    }}>
                        Add School
                    </ButtonIcon>
                </div>
            </FalconCardHeader>
            <CardBody>
                <Row noGutters>
                    <Col xs={12} className="mb-3">
                        <Row className="justify-content-center justify-content-sm-between">
                            <Col sm="auto" className="text-center">
                                <input type="text" className="form-control" value={search}
                                name="search" placeholder="Search.." onChange={(e) => {
                                    this.setState({search:e.target.value},()=>{
                                        this.filterSchoolList()
                                    })                                       
                                }}/>                                    
                            </Col>
                            <Col sm="auto" className="d-flex flex-center fs--1 mt-1 mt-sm-0">
                                <Label className="mr-2 mb-0" htmlFor="customSwitch1">
                                    Inactive schools
                                </Label>
                                <CustomInput
                                    type="switch"
                                    id="customSwitch1"
                                    label="Active schools"
                                    checked={isActive}
                                    onChange={() => {
                                        this.setState({isActive:!this.state.isActive},()=>{
                                            this.getSchoolList();
                                        })
                                    }}
                                />
                            </Col>
                        </Row>
                    </Col>            
                </Row>
                <Row>
                    <Col>
                        <RTable 
                            sortable
                            resizable
                            defaultPageSize={10}
                            data={filterSchools}
                            columns={[{
                                Header: "SCHOOL NAME", width: 350,
                                Cell: (props) => {
                                    if(this.state.isActive){
                                    const sid=props.original._links.self.href.split('/').pop();
                                    return <span ><Link to={`/superAdmin/manageSchool/onboardSchool/${sid}`} className="text-info"
                                    >{props.original.schoolName}</Link></span>
                                    }else{
                                       return <span>{props.original.schoolName}</span> 
                                    }
                                }
                            },
                            { Header: "SUBDOMAIN", width: 120, accessor: "subdomain" },
                            { 
                                Header:'URL', 
                                width: 250,
                                Cell:(props)=>{
                                    if(this.state.isActive){
                                        return <div className="text-primary cursor-pointer" onClick={()=>{
                                            const refresh_token = sessionStorage.getItem('refresh_token')||''
                                            window.open(
                                                `${props.original.adminurl}?${btoa(`akey=${access_token()}&rkey=${refresh_token}`)}`,
                                                '_blank' // <- This is what makes it open in a new window.
                                              );
                                        }}><small>{props.original.adminurl}</small></div>
                                    }else{
                                        return <div><small>{props.original.adminurl}</small></div>
                                    }
                                    
                                }
                            },                            
                            { 
                                Header: "ADMIN", 
                                Cell:(props)=>{
                                    if(this.state.isActive){
                                        return<ul className="list-unstyled">
                                            {
                                                (props.original.schoolUsers.filter(usr=>usr.isPrimaryUser)||[]).map((user,i)=>{
                                                    return <li>
                                                        <span className="cursor-pointer" onClick={() => this.adminModal(user, props.original._links.self.href.split('/').pop())}>{(user.isActive === true ? (user.isVerified === true ? <FontAwesomeIcon icon="check-circle" className="text-success fs-1" /> : <FontAwesomeIcon icon="exclamation-circle" className="text-warning fs-1" />) : <FontAwesomeIcon icon="ban" className="text-danger fs-1" />)}
                                                        </span> {user.username} {user.isVerified === true ?null:<span className="cursor-pointer" onClick={
                                                            () => this.sendAdminLinks(props.original,user.username)
                                                            }><FontAwesomeIcon icon={['far', 'paper-plane']} className="text-info fs-1" /></span>}
                                                        </li>
                                                })

                                            }
                                        </ul> 
                                    }else{
                                        return <ul className="list-unstyled">{
                                            (props.original.schoolUsers.filter(usr=>usr.isPrimaryUser)||[]).map((user,i)=>{
                                                return <li>{user.username}</li>
                                            })
                                            }</ul>
                                    }
                                }
                            },
                            { 
                                Header: "ACTION",
                                width: 150,
                                style : {textAlign : 'center'},
                                Cell: (props) =>{
                                    const sid=props.original._links.self.href.split('/').pop();
                                    if(this.state.isActive){
                                        return <>
                                            <Button color="falcon-primary" size="sm" onClick={()=>{
                                               this.props.history.push(`/SuperAdmin/manageSchool/onboardSchool/${sid}`);
                                            }}>
                                                <FontAwesomeIcon icon="pencil-alt" className="text-success fs-1" />                                       
                                            </Button>  
                                            <Button color="falcon-primary" size="sm" onClick={()=>{
                                                this.props.history.push(`/SuperAdmin/manageSchool/datasync`);
                                            }}>
                                                <FontAwesomeIcon icon="database" className="text-warning fs-1" />                                        
                                            </Button>
                                            <Button color="falcon-primary" size="sm" onClick={()=>{
                                                this.setState({deleteRow:props.original,conformDelete:true})
                                            }}>
                                                <FontAwesomeIcon icon="trash-alt" className="text-danger fs-1" />                                        
                                            </Button>                                  
                                        </>
                                    }else{
                                        return <Button color="falcon-primary" size="sm" onClick={()=>{
                                            this.setState({deleteRow:props.original,conformDelete:true})
                                        }}>
                                                <FontAwesomeIcon icon="window-restore" className="text-danger fs-1" />                                        
                                            </Button>
                                    }                                    
                                }
                            }
                            ]} />                       
                    </Col>
                </Row>
            </CardBody>
        </Card>
        <Modal isOpen={this.state.conformDelete}>
            <ModalHeader charCode="X">{this.state.isActive?'Delete Conformation':'Restore School Conformation'} </ModalHeader>
            <ModalBody>
                {
                    this.state.isActive?'Are you sure you want to delete this school from Meal Manage service?':
                    'Are you sure you want to restore this school from Meal Manage service?'
                }                
            </ModalBody>
            <ModalFooter>
            <Button color="primary" onClick={()=>{
                if(this.state.isActive){
                    this.deleteSchool()
                }else{
                    this.restoreSchool()
                }}}>Yes</Button>
            <Button color="secondary" onClick={()=>{
                this.setState({deleteRow:undefined,conformDelete:false})
            }}>No</Button>
            </ModalFooter>
      </Modal>
      <Modal isOpen={this.state.adminModalisOpen} toggle={()=>{
                this.setState({adminData:undefined,adminModalisOpen:false})
            }}>
        <ModalHeader toggle={()=>{
                this.setState({adminData:undefined,adminModalisOpen:false})
            }} charCode="X">Manage Admin</ModalHeader>
        <ModalBody className="text-center">
            { (this.state.adminData||{}).isActive ? 
                <Button color="secondary" onClick={this.deactivateAdmin}>Deactivate </Button> : 
                <Button color="primary" onClick={this.reactivateAdmin}>Reactivate </Button>
            }
        </ModalBody>
    </Modal>
    </>
        );
    }
}

export default withRouter(ManageSchool);