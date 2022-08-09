import React, { useState,useEffect } from 'react';
import { withRouter } from "react-router";
import { Alert, Card, CardBody, Col, CustomInput, Form, FormGroup, Input, Label, Row, Button } from 'reactstrap';
import { 
    AvForm, 
    AvField, 
    AvGroup, 
    AvInput, 
    AvFeedback, 
    AvRadioGroup, 
    AvRadio, 
    AvCheckboxGroup, 
    AvCheckbox } from 'availity-reactstrap-validation';
import { toast } from 'react-toastify';
import FalconCardHeader from '../../../common/FalconCardHeader'
import { get, postWithHeaders, patch } from '../../../../server/actions';

const SchoolRec=(props)=>{
    const [id,setId]=useState(0);
    const [loading,setLoading]=useState(false);
    const [countryList,setCountryList]=useState([]);
    const [schoolTypes,setSchoolTypes]=useState([]);
    const [school,setSchool]=useState({});
    const [errors, setErrors]=useState([]);

    useEffect(()=>{
        let id = parseInt(props.match.params.id||0);
        setId(id);
        getSchoolType();
        getCountryList();
        if(id>0){
            getSchoolDetails(id)
        }        
    },[]);
    const getSchoolType = () => {
        setLoading(true);
        get(`/schoolTypes?access_token=`).then((response) => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        }).then(data => {
            let list=Object.keys(data).map(keyname=>{
                return {label:keyname,value:keyname}
            })
            setSchoolTypes(list);
            setLoading(false);
        }).catch(error => {
            console.log(error)
            setSchoolTypes([]);
            setLoading(false)
        })
    }
    const getSchoolDetails=(id)=>{
        setLoading(true)
        get(`/schools/${id}?access_token=`).then((response) => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            console.log('response', response);
            return response.json();
        }).then(data => {
            setSchool(data)
            setLoading(false);
        }).catch(
                (error) => {
                    setLoading(false)
                    console.log('Onboard School response', error)
                }
            )}
    const getCountryList=()=> {
        setLoading(true);
        get('/countryDetails?&access_token=').then((response) => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            console.log('response', response);
            return response.json();
        }).then(data => {
            let countryList = [];
            data._embedded.countryDetails.forEach(function (val) {
                countryList.push({ country:val.countryName, label: val.countryCode + ' (' + val.countryName + ')', value: val.countryCode });
            });
            setLoading(false);
            setCountryList(countryList);
        }).catch(
                (error) => {
                    setCountryList([]);
                    setLoading(false);
                    console.log('Onboard School response', error)
                }
            )
        }
    const handleSubmit=(event, errors, values)=> {
        if((errors||[]).length===0){  
            let loggedUserInfo = sessionStorage.getItem('loggedInUserInfo');        
            let loggedUser = loggedUserInfo;
            let _schools = {};
            _schools={
                "loggedUser": loggedUser,
                "schoolName": values.schoolName,
                "county": values.county,
                "countryCode": values.countryCode,
                "city": values.city,
                "telephone": values.telephone,
                "fax": values.fax,
                "schoolAddress": values.schoolAddress,
                "ctds": values.ctds,
                "schoolDistrictName": values.schoolDistrictName,
                "schoolType": values.schoolType,
                "state": values.state,
                "cityStateZip": values.cityStateZip,
            }; 
            if(id<=0){                
                let headers = {
                    'Content-Type': 'application/json'
                };
                postWithHeaders('/schools?access_token=', JSON.stringify(_schools), headers).then((response) => {
                    if (response.status !== 201) {
                        throw Error(response.statusText);
                    }
                    return response;
                }).then(data => {
                    toast.success('School Added Successfully.');
                    props.history.push('/SuperAdmin/manageSchool/schools');
                }).catch(
                    (error) => {
                        toast.error('Failed to create new school.');
                    }
                );
            }else{
                patch(`/schools/${id}?access_token=`, JSON.stringify(_schools)).then((response) => {
                    if (response.status !== 200) {
                        throw Error(response.statusText);
                    }
                    return response;
                }).then(data => {
                    toast.success('School updated successfully.');
                    props.history.push('/SuperAdmin/manageSchool/schools');
                }).catch(
                    (error) => {
                        toast.error('Failed to update school.');
                    }
                );

            }
        }
    }      
    return(
        <>        
        <Card className="mb-3">
            <FalconCardHeader title={id<=0?'New School':'Edit School'}>                
            </FalconCardHeader>
            <CardBody>
                <Row noGutters>
                    <Col xs={12} className="mb-3">
                        <Row className="justify-content-center justify-content-sm-between">
                            <Col sm="12">
                                <AvForm onSubmit={handleSubmit} model={school}>
                                    <Row>
                                        <Col>
                                            <AvField name="schoolName" label="SchoolName*" value={school.schoolName}
                                            errorMessage="Please enter school name" required />
                                        </Col>
                                        <Col>
                                            <AvField name="schoolAddress" label="School Address*" value={school.schoolAddress}
                                            errorMessage="Please enter school address" required />
                                        </Col>
                                        <Col>
                                            <AvField name="city" label="City" value={school.city} errorMessage="Please enter city name" required />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <AvField type="select" name="county" label="Country" value={school.county} onChange={(e)=>{
                                                const code=countryList.find(r=>{
                                                    return r.country===e.target.value
                                                });
                                                if(code){
                                                    school.countryCode=code.value;
                                                }else{
                                                    school.countryCode=''

                                                }
                                                setSchool({...school});

                                            }} errorMessage="Please select country" required>
                                                <option key={-1}></option>
                                                {
                                                    countryList.map((ct,i)=>{
                                                        return <option key={i} value={ct.country}>{ct.label}</option>
                                                    })
                                                }
                                            </AvField>
                                        </Col>
                                        <Col>
                                            <AvField name="countryCode" label="Country Code" value={school.countryCode} disabled />
                                        </Col>
                                        <Col>
                                            <AvField name="state" label="State*" value={school.state} errorMessage="Please enter state name" required />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <AvField name="cityStateZip" label="Zip" value={school.cityStateZip} errorMessage="Please enter zip" required />
                                        </Col>
                                        <Col>
                                            <AvField name="schoolDistrictName" value={school.schoolDistrictName} label="School District" />
                                        </Col>
                                        <Col>
                                            <AvField name="telephone" label="Telephone*" value={school.telephone} errorMessage="Please enter Telephone no." required />  
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <AvField name="fax" value={school.fax} label="Fax"/>
                                        </Col>
                                        <Col>
                                            <AvField name="ctds" value={school.ctds} label="Ctds" />
                                            
                                        </Col>
                                        <Col>
                                            
                                            <AvField type="select" name="schoolType"  value={school.schoolType} multiple 
                                            label="School Type*" errorMessage="select school type"  required>
                                            <option key={-1}></option>
                                                {
                                                    schoolTypes.map((ct,i)=>{
                                                        return <option key={i} value={ct.label}>{ct.label}</option>
                                                    })
                                                }
                                            </AvField>
                                        </Col>
                                    </Row>
                                    <FormGroup className="text-right">
                                        <Button type='button' color="secondary" className="mr-2 mb-2" onClick={()=>{
                                            props.history.push('/SuperAdmin/manageSchool/schools');
                                        }}>Cancel</Button>
                                        <Button color="primary" className="mb-2">Submit</Button>
                                        
                                    </FormGroup>
                                </AvForm>                         
                            </Col>
                        </Row>
                    </Col>            
                </Row>                
            </CardBody>
        </Card>
    </>
    )

}

/* class SchoolRec extends Component {
    constructor(props){
        super(props);
        this.state={
            id:0,
            loading: false,
            countryList:[],
            SchoolTypes:[],
            school:{

            }
        }
    }
    componentWillMount=()=>{
        let id = parseInt(this.props.match.params.id||0);
        this.setState({id: id },()=>{
            if(id>0){
                this.getSchoolDetails(id);
            }
        });
    }
    componentDidMount=()=>{
        this._notificationSystem = this.refs.notificationSystem;
        this.getCountryList();
        this.getSchoolType();
    }
    getSchoolType = () => {
        this.setState({ loading: true });
        get(`/schoolTypes?access_token=`).then((response) => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            console.log('response', response);
            return response.json();
        }).then(data => {
            let list=Object.keys(data).map(keyname=>{
                return {label:keyname,value:keyname}
            })
            this.setState({ SchoolTypes: list, loading: false })
        }).catch(error => {
            this.setState({ loading: false });
            console.log("Loading Report Failed", error)
        })
    }
    getSchoolDetails=(id)=>{
        this.setState({ loading: true });
        get(`/schools/${id}?access_token=`).then((response) => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            console.log('response', response);
            return response.json();
        }).then(data => {
            this.setState({ 
                loading: false, 
                school: data });
        }).catch(
                (error) => {
                    this.setState({ loading: false });
                    console.log('Onboard School response', error)
                }
            )}
    getCountryList() {
        this.setState({ loading: true });
        get('/countryDetails?&access_token=').then((response) => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            console.log('response', response);
            return response.json();
        }).then(data => {
            let countryList = [];
            data._embedded.countryDetails.forEach(function (val) {
                countryList.push({ country:val.countryName, label: val.countryCode + ' (' + val.countryName + ')', value: val.countryCode });
            });
            this.setState({ 
                loading: false, 
                countryList: countryList },
            )
        }).catch(
                (error) => {
                    this.setState({ loading: false });
                    console.log('Onboard School response', error)
                }
            )
        }
        handleSchoolNameChange = (evt) => {
            const school = this.state.school;
            school['schoolName']=evt.target.value;
            this.setState({school:school });
        };
        handleSchoolAddressChange = (evt) => {
            const school = this.state.school;
            school['schoolAddress']=evt.target.value
            this.setState({school:school });
        };
        handleZipChange = (evt) => {
            const school = this.state.school;
            school['cityStateZip']=evt.target.value;
            this.setState({school:school });
        };        
        handleCityChange = (evt) => {
            const school = this.state.school;
            school['city']=evt.target.value;
            this.setState({school:school });
        };
        handleCtdsChange = (evt) => {
            const school = this.state.school;
            school['ctds']=evt.target.value;
            this.setState({school:school });
        };
        handleTelephoneNoChange = (evt) => { 
            const school = this.state.school;
            school['telephone']=evt.target.value;
            this.setState({school:school });
        }
        handleDistrictNameChange = (evt) => {
            const school = this.state.school;
            school['schoolDistrictName']=evt.target.value;
            this.setState({school:school });
        };
        handleFaxChange = (evt) => {
            const school = this.state.school;
            school['fax']=evt.target.value;
            this.setState({school:school });
        };
        handleCountyChange = (selectedItem) => {
            const school = this.state.school;
            school['country']=selectedItem.countryName;
            school['countryCode']=selectedItem.value;
            this.setState({school:school });
        };
        handleSchoolTypeChange =(selectedItem) => {
            const school = this.state.school;
            school['schoolType']=(selectedItem||[]).map(item=>{
                return item.value
            });
            this.setState({school:school });
        };
        handleStateChange = (evt) => {
            const school = this.state.school;
            school['state']=evt.target.value;
            this.setState({school:school });
        }
        validate=()=>{
            const self=this;
            const {school}=this.state;
            if((school.schoolName||'').trim().length===0){
                _addNotificationError('Please enter school name', self);
                return false
            }
            if((school.schoolAddress||'').trim().length===0){
                _addNotificationError('Please enter school address', self);
                return false
            }
            if((school.city||'').trim().length===0){
                _addNotificationError('Please enter city', self);
                return false
            }
            if((school.countryCode||'').trim().length===0){
                _addNotificationError('Please select country', self);
                return false
            }
            if((school.state||'').trim().length===0){
                _addNotificationError('Please enter state', self);
                return false
            }
            if((school.cityStateZip||'').trim().length===0){
                _addNotificationError('Please enter zip', self);
                return false
            }
            if((school.schoolDistrictName||'').trim().length===0){
                _addNotificationError('Please enter school district name', self);
                return false
            }
            if((school.schoolDistrictName||'').trim().length===0){
                _addNotificationError('Please enter school district name', self);
                return false
            }
            if((school.schoolType||[]).length===0){
                _addNotificationError('Please select school type', self);
                return false
            }
            if((school.telephone||[]).length===0){
                _addNotificationError('Please enter telephone no', self);
                return false
            }
            return true
        }
        onSchoolDetailsSubmit=()=>{
            const self=this;
            const {school}=this.state;
            let loggedUserInfo = sessionStorage.getItem('loggedInUserInfo');        
            let loggedUser = loggedUserInfo;
            let schools = {};
            if(!this.validate()){
                return false
            }
            schools={
                "loggedUser": loggedUser,
                "schoolName": school.schoolName,
                "county": school.county,
                "countryCode": school.countryCode,
                "city": school.city,
                "telephone": school.telephone,
                "fax": school.fax,
                "schoolAddress": school.schoolAddress,
                "ctds": school.ctds,
                "schoolDistrictName": school.schoolDistrictName,
                "schoolType": school.schoolType,
                "state": school.state,
                "cityStateZip": school.cityStateZip,
            }; 
            if(this.state.id<=0){                
                let headers = {
                    'Content-Type': 'application/json'
                };
                postWithHeaders('/schools?access_token=', JSON.stringify(schools), headers).then((response) => {
                    if (response.status !== 201) {
                        throw Error(response.statusText);
                    }
                    return response;
                }).then(data => {
                    _addNotification('School Added Successfully.', self);
                    setTimeout(() =>
                            this.context.router.history.push('/superAdmin/schools')
                        , 3000);
                }).catch(
                    (error) => {
                        _addNotificationError('Failed to create new school.', this);
                    }
                );
            }else{
                patch(`/schools/${this.state.id}?access_token=`, JSON.stringify(schools)).then((response) => {
                    if (response.status !== 200) {
                        throw Error(response.statusText);
                    }
                    return response;
                }).then(data => {
                    _addNotification('School updated successfully.', self);
                    setTimeout(() =>
                            this.context.router.history.push('/superAdmin/schools')
                        , 3000);
                }).catch(
                    (error) => {
                        _addNotificationError(error.message, self);
                    }
                );

            }
        };
    render() {
        const{school}=this.state;
        return (
            <div>
            <section className=" full-width clearfix">
                <div className="container">                    
                    <div className="sectionTitle col-md-12">
                        <div className="row">
                            <div className="col-md-12">
                                <h2 style={{ marginBottom: '5px' }}><span>School</span></h2>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12">
                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-xs-3 col-xs-offset-1">
                                                <div className="form-group">
                                                    <label htmlFor={`School Name`}>School Name*</label>
                                                    <input id={`School Name`}
                                                        value={school.schoolName}
                                                        type="text" className="form-control"
                                                        placeholder={`School Name`}
                                                        style={{ marginRight: '20px' }}
                                                        onChange={(e)=>this.handleSchoolNameChange(e)} />
                                                </div>
                                            </div>
                                            <div className="col-xs-3">
                                                <div className="form-group">
                                                    <label htmlFor={`School Address`}>School Address*</label>
                                                    <input type="text" className="form-control" id={`School Address`}
                                                        value={school.schoolAddress}
                                                        placeholder={`School Address`}
                                                        style={{ marginRight: '20px' }}
                                                        onChange={(e)=>this.handleSchoolAddressChange(e)}
                                                        
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-xs-3 ">
                                                <div className="form-group">
                                                    <label htmlFor={`City`}>City*</label>
                                                    <input
                                                        type="text" className="form-control" id={`City`}
                                                        placeholder={` City`}
                                                        value={school.city}
                                                        onChange={(e)=>this.handleCityChange(e)}
                                                        style={{ marginRight: '20px' }}
                                                        
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-xs-3 col-xs-offset-1"> 
                                                <div className="form-group">
                                                    <label htmlFor={`County`}>Country*</label>
                                                    <Select
                                                    onChange={(e)=>this.handleCountyChange(e)}    
                                                    value={this.state.countryList.find(itm=>{
                                                        return itm.value===school.countryCode
                                                    })}
                                                        closeMenuOnSelect={true}
                                                        options={this.state.countryList}
                                                        //className="basic-multi-select"
                                                        classNamePrefix="select"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-xs-3">
                                                <div className="form-group">
                                                    <label htmlFor={`Country Code`}>Country Code*</label>
                                                    <input
                                                        type="text" className="form-control"
                                                        placeholder={` Country Code`}
                                                        value={school.countryCode}
                                                        style={{ marginRight: '20px' }} disabled
                                                        //onChange={(e)=>this.handleCountryCodeChange(e)}
                                                        
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-xs-3">
                                                <div className="form-group">
                                                    <label htmlFor={`State`}>State*</label>
                                                    <input
                                                        type="text" className="form-control" id={`State`}
                                                        placeholder={` State`}
                                                        value={school.state}
                                                        style={{ marginRight: '20px' }}
                                                        onChange={(e)=>this.handleStateChange(e)}
                                                        
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-xs-3 col-xs-offset-1">
                                                <div className="form-group">
                                                    <label htmlFor={`cityStateZip`}>Zip*</label>
                                                    <input type="text" className="form-control" id={` cityStateZip`}
                                                        value={school.cityStateZip}
                                                        placeholder={`Zip`}
                                                        style={{ marginRight: '20px' }}
                                                        onChange={(e)=>this.handleZipChange(e)}
                                                        
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-xs-3">
                                                <div className="form-group">
                                                    <label htmlFor={`School DistrictName`}>School DistrictName*</label>
                                                    <input type="text"
                                                        className="form-control"
                                                        value={school.schoolDistrictName}
                                                        id="School DistrictName"
                                                        placeholder={'School DistrictName'}
                                                        onChange={(e)=>this.handleDistrictNameChange(e)}
                                                        
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-xs-3">
                                                <div className="form-group">
                                                    <label htmlFor={`school Type`}>School Type*</label>
                                                    <Select
                                                     value={(school.schoolType||[]).map(item=>{
                                                        return {label:item,value:item}
                                                    })}
                                                    onChange={(e)=>this.handleSchoolTypeChange(e)}
                                                        isMulti
                                                        closeMenuOnSelect={false}
                                                        options={this.state.SchoolTypes}
                                                        className="basic-multi-select"
                                                        classNamePrefix="select"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-xs-3 col-xs-offset-1">
                                                <div className="form-group">
                                                    <label htmlFor={`Telephone`}>Telephone*</label>
                                                    <input type="text" className="form-control" id={`Telephone`}
                                                        placeholder={`Telephone`}
                                                        style={{ marginRight: '20px' }}
                                                        value={school.telephone}
                                                        maxLength={this.state.mobileLength}
                                                        onKeyPress={numberOnly}
                                                        onChange={(e)=>this.handleTelephoneNoChange(e)}
                                                        
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-xs-3">
                                                <div className="form-group">
                                                    <label htmlFor={`Fax`}>Fax</label>
                                                    <input type="text"
                                                        className="form-control"
                                                        value={school.fax}
                                                        id="Fax"
                                                        placeholder={'Fax'}
                                                        maxLength={this.state.mobileLength}
                                                        onKeyPress={numberOnly}
                                                        onChange={(e)=>this.handleFaxChange(e)}
                                                        
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-xs-3">
                                                <div className="form-group">
                                                    <label htmlFor={`Ctds`}>Ctds</label>
                                                    <input type="text"
                                                        value={school.ctds}
                                                        className="form-control"
                                                        id="Ctds"
                                                        placeholder={'Ctds'}
                                                        onChange={(e)=>this.handleCtdsChange(e)}
                                                        
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <hr />
                                    </div>
                                <div className="text-right add-schools-footer">
                                    <Link to="/superAdmin/schools">
                                        <button type="button" id="cancelAdd" className="btn btn-primary btn-lg"
                                            style={{ margin: 0, fontSize: 14, marginTop: "10px" }}><i
                                                className="glyphicon glyphicon-remove"
                                                style={{ marginRight: 0, paddingLeft: 0 }}></i> Cancel
                                            </button>
                                    </Link>
                                    <button  
                                className="btn btn-success btn-lg" 
                                style={{
                                    margin: 0,marginLeft: 5,fontSize: 14,marginTop: "10px"
                                }}
                                onClick={(e)=>{
                                    this.onSchoolDetailsSubmit(e);
                                }}>
                            <i className="glyphicon glyphicon-ok" style={{ marginRight: '0', paddingLeft: '0' }}></i> Save
                            </button>
                                </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
        );
    }
} */
export default SchoolRec;