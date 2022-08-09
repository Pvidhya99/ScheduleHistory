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
    FormGroup, 
    Row, 
    Button, 
    Label, 
    } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import FalconDropzone from '../../../common/FalconDropzone';
import Loader from '../../../common/Loader';
import PageHeader from '../../../common/PageHeader';
import ButtonIcon from '../../../common/ButtonIcon'
import FalconCardHeader from '../../../common/FalconCardHeader'
import RTable from '../../../rtable'
import {get, _delete, patch, postResponse } from "../../../../server/actions";
import { toast } from 'react-toastify';
import {_addNotification, _addNotificationError, getModuleEnum, getAccessLevelByModule, dataURLtoFile} from '../../../../server/util';
import {date_format} from '../../../../server/constants';
const ArchiveFilesType={
    dataSync:'Data Sync',
    studentImport:'Student Import'
}
const modEnum=getModuleEnum();
class ImportStudents extends Component {
    constructor(props){
        super(props);
        this.state={
            loading: false,
            archiveFiles:[],
            selectedFiles:[],
            isStudentImport: getAccessLevelByModule(modEnum.SIU)?true: (getAccessLevelByModule(modEnum.SSISI)?false:false)
        }
    }
    componentWillMount=()=>{
        this.getArchiveFiles();
    }
    componentWillReceiveProps=(nextProps)=>{
        console.log(nextProps)
    }
    uploadClick=()=> {
        const {selectedSchoolYear}=this.props        
        let userInfo = JSON.parse(sessionStorage.getItem('loggedInUserInfo'));
        let schoolId = userInfo.schoolId;
        let userName = userInfo.username;
        if(this.state.selectedFiles.length<=0){
            return false;
        }
        const fileRec=this.state.selectedFiles[0];
        let fileInput = dataURLtoFile(fileRec.base64,fileRec.path);
        var data = new FormData();
        data.append('file', fileInput);
        this.setState({loading: true})
        postResponse('/importStudents?schoolId=' + schoolId + '&loggedUser=' + userName + '&schoolYear='+selectedSchoolYear.schoolYear+'&access_token=', data).then((response) => {
            if (response.statusCode!==200) {    
                throw Error(response.statusMessage);
            }
            return response;
        }).then(res => {
            this.setState({loading: false});
            _addNotification('Students added successfully.', this);
            setTimeout(() => {
                this.context.router.history.push('/schoolAdmin/manageSchool')
            }, 3000);
        }).catch(
            (error) => {
                 _addNotificationError(error.message,this);
                this.setState({loading: false});
                console.log('Add School response', error)
            }
        )
    };
    getArchiveFiles() {
        const {selectedSchoolYear}=this.props
        this.setState({loading: true})
        let userInfo = JSON.parse(sessionStorage.getItem('loggedInUserInfo'));
        let schoolId = userInfo.schoolId;
        let archType=this.state.isStudentImport?ArchiveFilesType.studentImport:ArchiveFilesType.dataSync
       get('/studentBkpFileHistories/search/studentBkpHstry?mealSchoolId=' + schoolId + '&schoolYear=' + selectedSchoolYear.schoolYear +'&type='+archType+ '&limitVal=100000&access_token=').then((response) => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        }).then(data => {
            this.setState({
                archiveFiles: data._embedded.studentBkpFileHistories,loading: false
            });
        }).catch(
            (error) => {
                this.setState({
                    archiveFiles: [],loading: false
                });
                console.log('Archive files errors:', error)
            }
        );
    }
    render() {
        const {selectedSchoolYear}=this.props
        return (
            <>            
            <Card className="mb-3">
            <FalconCardHeader title={`Import Students Info For: ${(selectedSchoolYear||{}).name}`}>
                <div className="fs--1">
                </div>
            </FalconCardHeader>
            </Card>
            
            <Row className="mb-3">
            {
                getAccessLevelByModule(modEnum.SIU)?
                <Col xs={12}>
                    <Card>
                        <FalconCardHeader title={`Students Info`}>
                            <div className="fs--1">
                            </div>
                        </FalconCardHeader>
                        <CardBody>
                            <Row noGutters>
                                <Col xs={12} className="mb-3">
                                    <Row className="justify-content-center">
                                        <Col sm="auto" className="text-center">
                                            <p className="lead">
                                                You can setup the school using excel(.xls, .xlsx) file. Upload it to load the student data. <br className='d-md-block d-none' />
                                                Download <a href="https://s3.amazonaws.com/mealmanage-prod/SampleFiles/Students.xlsx">Sample file</a>
                                            </p>
                                            {/* <FormGroup>
                                                <Label htmlFor="schoolFile">
                                                    Upload Excel File
                                                </Label>
                                                <CustomInput 
                                                    type="file" 
                                                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                                    id="schoolFile" 
                                                    name="customFile" 
                                                    onChange={(e)=>{
                                                        let validExts = new Array(".xlsx", ".xls");
                                                        let fileExt = e.target.files[0].name.split('.').pop();
                                                        if (validExts.indexOf('.'+fileExt) < 0) {
                                                            toast.error("Invalid file format. Please select valid file format (" +
                                                                validExts.toString() + ")");
                                                            e.target.value='';
                                                        return false;
                                                        }
                                                        else return true;
                                                   }}
                                                />
                                            </FormGroup>  */}
                                            <FalconDropzone
                                                files={this.state.selectedFiles}
                                                onChange={files => {
                                                    let validExts = new Array(".xlsx", ".xls");
                                                    let fileExt = files[0].path.split('.').pop();
                                                    if (validExts.indexOf('.'+fileExt) < 0) {
                                                        toast.error("Invalid file format. Please select valid file format (" +validExts.toString() + ")");
                                                        this.setState({selectedFiles:[]})
                                                        return false;
                                                    }else{
                                                        this.setState({selectedFiles:files})
                                                    }                                                    
                                                }}
                                                multiple={false}
                                                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                                placeholder={
                                                    <>
                                                        <p className="fs-0 mb-0 text-700"><FontAwesomeIcon icon="upload" className={this.state.selectedFiles.length===0?"text-danger fs-6":"text-success fs-6"} /></p>
                                                    </>
                                                }
                                                />
                                                <ButtonIcon icon="arrow-circle-right" 
                                                color={'primary'} className="mt-2 mr-2"
                                                 disabled={this.state.selectedFiles.length===0} onClick={()=>{
                                                     this.uploadClick()
                                                 }} >Proceed</ButtonIcon> 
                                                <ButtonIcon icon="times-circle" 
                                                color={'secondary'} className="mt-2 mr-2" onClick={()=>{
                                                     this.setState({selectedFiles:[]})
                                                 }} >Cancel</ButtonIcon>

                                        </Col>
                                    </Row>
                                </Col>            
                            </Row>
                        </CardBody>
                    </Card>
                </Col>:null
            }
            </Row>
            <Row>
            <Col xs={12}>
                <Card>
                    <FalconCardHeader title={`Archive Files`}>
                    {
                        getAccessLevelByModule(modEnum.SIU) &&  getAccessLevelByModule(modEnum.SSISI)?
                        <Col sm="auto" className="d-flex flex-center fs--1 mt-1 mt-sm-0">
                                <Label className="mr-2 mb-0" htmlFor="customSwitch1">
                                {ArchiveFilesType.studentImport}
                                </Label>
                                <CustomInput
                                    type="switch"
                                    id="customSwitch1"
                                    label={ArchiveFilesType.dataSync}
                                    checked={(this.state.isStudentImport) ? true : this.state.isStudentImport}
                                    onChange={(e) => {
                                        this.setState({isStudentImport:e.target.checked},
                                        ()=>{this.getArchiveFiles();});                                        
                                    }}
                                />
                            </Col>:null
                    }
                    </FalconCardHeader>
                    <CardBody>
                        <Row>
                            <Col>
                                <RTable 
                                    sortable
                                    resizable
                                    defaultPageSize={10}
                                    data={this.state.archiveFiles}
                                    columns={[
                                        {
                                            Header: 'Date',
                                            style: {textAlign: 'left',fontSize:'14px'},
                                            
                                            Cell: ({row}) => (
                                                 moment(row._original.date).format(date_format()+'  '+'hh:MM a')),
                                            
                                        },
                                        {
                                            Header: 'Processed By',
                                            style: {textAlign: 'left',fontSize:'14px'},
                                           
                                            Cell: ({row}) => (
                                                 row._original.createdBy)                                        
                                            
                                        },
                                        {
                                            Header: 'File',
                                            style: {textAlign: 'center',fontSize:'13px'},
                                            Cell: ({row}) => (
                                                <a title={'Click here download'} href={row._original.fileS3Link}>
                                                 <FontAwesomeIcon icon="file-excel" className={"text-success fs-2"} /></a>)
                                        }
                                    ]} />                       
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Col>
                
        </Row>
    </>
        );
    }
}

export default ImportStudents;