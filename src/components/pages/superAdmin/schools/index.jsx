import React, {useState, useEffect, useMemo} from 'react';
import { withRouter } from "react-router";
import { Link } from 'react-router-dom';
import { Alert, Card, CardBody, Col, CustomInput, Form, Input, Row, Button } from 'reactstrap';
import Loader from '../../../common/Loader';
import PageHeader from '../../../common/PageHeader';
import ButtonIcon from '../../../common/ButtonIcon'
import FalconCardHeader from '../../../common/FalconCardHeader'
import RTable from '../../../rtable'
import {get } from "../../../../server/actions";

const Schools=(props)=>{
    const [loading, setLoading]=useState(false);
    const [schoolList, setSchoolList]= useState([]);
    const [searchedSchool, setSearchedSchool]=useState([]);
    const [search, setSearch]=useState('');
    const [schoolType, setSchoolType]=useState('all');    
    
    useEffect(()=>{
        getSchoolList();
    },[]);
    
    useEffect(()=>{
        filterSchool();
    },[search]);

    const addSchool=()=>{
        props.history.push('/superAdmin/manageSchool/schoolRecord/0')
    }
    const filterSchool = () => {
        let searchedSchool=[];
        let s = search;
        if (s.length > 0) {
            schoolList.forEach(obj => {
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
                    if(x){
                        searchedSchool.push(obj);
                    }
                }
            });
            setSearchedSchool(searchedSchool)
        }        
        else{
            setSearchedSchool(schoolList)
        }
    };
    const getSchoolList = () => {
        get('/schools?access_token=').then((response) => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        }).then(data => {
           const _schools= data._embedded.schools.map(obj => {                
                    obj.id =obj._links.self.href.split('/').pop();
                    return obj;
            });
            setSchoolList(_schools);
            setSearchedSchool(_schools);
        })
        .catch(
            (error) => {
                console.log('Get SchoolList response', error)
            }
        )
    };
       
      

    return (
        <>        
        <Card className="mb-3">
            <FalconCardHeader title="Schools">
                <div className="fs--1">
                    <ButtonIcon className="mr-2" color="primary" size="sm" icon="plus" transform="shrink-3" onClick={()=>{addSchool()}}>
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
                                        setSearch(e.target.value)
                                        filterSchool()
                                }}/>                                    
                            </Col>
                        </Row>
                    </Col>            
                </Row>
                <Row>
                    <Col>
                         <RTable 
                            filterable
                            sortable
                            resizable
                            defaultPageSize={10}
                            data={searchedSchool}
                            columns={[{
                                Header: "SCHOOL NAME", width: 250,
                                Cell: (props) => {
                                    return <span ><Link to={`/superAdmin/manageSchool/schoolRecord/${props.original.id}`} className="text-info"
                                    >{props.original.schoolName}</Link></span>
                                }
                            },
                            { Header: "SCHOOL ADDRESS", width: 200, accessor: "schoolAddress" },
                            { Header: "COUNTY", width: 200, accessor: "county" },
                            { Header: "TELEPHONE", width: 150, accessor: "telephone" },
                            { Header: "ACTION", width: 200 }
                            ]} />                       
                    </Col>
                </Row>
            </CardBody>
        </Card>
    </>);

}
export default withRouter(Schools);