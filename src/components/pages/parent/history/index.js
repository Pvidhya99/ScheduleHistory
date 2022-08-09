import React, {  useState, useEffect, useContext,useRef } from 'react';
import { Card, CardBody, Col,  DropdownItem, DropdownMenu, DropdownToggle, Row } from 'reactstrap';
import { enumDateFilterOptions, numberFormatter, paymentType} from '../../../../helpers/utils';
import MDropdown from '../../../m-dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import RTable from '../../../table';
import ReportDateFilters, {calculateDateRange} from'../../../reportDateFilters';
import { hideMenuTypeTabs, hideSchoolDrowdown, showMenuTypeTabs } from '../../../actions/menuTypeAction';
import {getDepositFile, getDepositReportData} from '../../../actions/reportsActions';
import {useMenuTypeDispatch, useMenuTypeState} from './../../../../context/MenuTypeContext';
import moment from 'moment-timezone';
import "flatpickr/dist/themes/material_green.css";
import { useAuthState } from '../../../../context/Context';
const StudentHistory =()=>{
const dispatch=useMenuTypeDispatch();  
    const [selectedPeriod, setSelectedPeriod]=useState(enumDateFilterOptions.ThisWeek)
    const [dateFilter,setDateRange]=useState(calculateDateRange(selectedPeriod));
    const [rowData] = useState([]);
    const [loading]=useState(false)
    const {otherInfo} = useAuthState();
    const {selectedSchool, selectedMenuType}=useMenuTypeState();
    useEffect(()=>{
        getDeposits();
},[dateFilter, selectedSchool]);

useEffect(()=>{
    hideMenuTypeTabs(dispatch);
    return async() => {
        await showMenuTypeTabs(dispatch);
      }
},[]);
    const getCols=()=>{
        let cols=[];
        if(((selectedSchool||{}).schoolId||0)===0){
            cols.push({
                Header: 'School',
                accessor: 'school'
            });
        }
        cols=[...cols,
            { Header: 'Student', id:'Student', 
            Cell:({row})=>(`${row.original.studentLName} ${row.original.studentFName}`)},
                { Header: 'Pin', accessor: 'pin',width: 50 },
                { Header: 'Date', accessor: 'transactionDate',width: 150 },
                { Header: 'Time', accessor: 'transactionTime',width: 50},
                { Header: 'Type', accessor: 'paymentType',width: 150 },
                { Header: 'Amount', accessor: 'amount', width: 150, Cell:({row})=>`${otherInfo.currencySymbol} ${numberFormatter(row.original.amount)}` },
                { Header: 'Check/CC TX. No./TX. ID', Cell:({row})=>row.original.paymentType===paymentType.Check? `${row.original.checkNum}`: `${row.original.transferId}`},
                { Header: 'User', accessor: 'user',width: 150 }
        ]
       return cols;
    }
}
const getDeposits=async()=>{        
       const defaultSchoolYear=((otherInfo.schools||[])[0]||{}).activeSchoolYear||moment().format('YYYY');
       setLoading(true);
       const res=await getDepositReportData({
           mealSchoolId:(selectedSchool||{}).schoolId||0, 
           catererId:otherInfo.catererId,
           schoolYear:((selectedSchool||{}).schoolId||0)===0?defaultSchoolYear: (selectedSchool||{}).activeSchoolYear,
           startDate:moment(dateFilter.fromDate).utc().format('YYYY-MM-DDThh:mm:ss'), endDate:moment(dateFilter.toDate).utc().format('YYYY-MM-DDThh:mm:ss')
       });
       setLoading(false);
       let data=[];
       if(res.error){            
           await setRowData(data);
       }else{
           if(((selectedSchool||{}).schoolId||0)>0){
               data=((res||{}).data||{}).transactionReportsDetails||[];
           }else{
               Object.keys(((res||{}).data||{}).resp||{}).map(school=>{
                   let schoolWiseData=(res.data.resp[school]||[]).map(r=>{
                       return {...r, school}
                   })
                   data=[...data,...schoolWiseData];
               })
           }
           await setRowData(data);
       }
   
    const depositReportFile=async(fileType)=>{
       const defaultSchoolYear=((otherInfo.schools||[])[0]||{}).activeSchoolYear||moment().format('YYYY');
       await setLoading(true);
       const resp=await getDepositFile({
           mealSchoolId:(selectedSchool||{}).schoolId||0, 
           catererId:otherInfo.catererId,
           schoolYear:((selectedSchool||{}).schoolId||0)===0?defaultSchoolYear: (selectedSchool||{}).activeSchoolYear,
           startDate:moment(dateFilter.fromDate).utc().format('YYYY-MM-DDThh:mm:ss'), endDate:moment(dateFilter.toDate).utc().format('YYYY-MM-DDThh:mm:ss'),
           fileType:fileType
       });
       await setLoading(false);
       if(!resp.error){
       }else{
           toast.error(resp.errorMessage);
       }
   } 
  
    return(
        <>
        <Card className='shadow-none border mb-2 mt-2'>
            <CardBody className='py-2'>
                <Row>
                    <Col className='align-self-center'>
                        <h5 className='text-primary fw-bold mb-0'>Student Report<code>-StudentName_Grade</code></h5>
                    </Col>
                    <Col className='d-flex justify-content-end'>
                    <MDropdown direction="left" className="btn btn-link btn-sm">  
                                <DropdownToggle>
                                    <FontAwesomeIcon icon="fa-solid fa-file-export" className='fs-1 text-primary' /> Export
                                </DropdownToggle>
                                <DropdownMenu end>                                    
                                    <DropdownItem onClick={()=>depositReportFile('pdf')}>
                                        <FontAwesomeIcon icon="file-pdf" className='fs-1 text-primary' />  Pdf
                                    </DropdownItem>
                                    <DropdownItem onClick={()=>depositReportFile('Excel')}>
                                        <FontAwesomeIcon icon="file-excel" className='fs-1 text-primary' />  Excel
                                    </DropdownItem>
                                </DropdownMenu> 
                                </MDropdown>                            
                    </Col>
               </Row>  
            </CardBody>
        </Card> 
        <Row>
            <Col>
                <ReportDateFilters {...{
                    setSelectedPeriod, 
                    selectedPeriod, 
                    outline:true, 
                    color:'primary',
                    setDateRange
                    }} />
            </Col>
        </Row> 
        <Row>
          <Col xs={14} md={14}>
              <RTable loading={loading} columns={getCols()} data={rowData} minRows="10" defaultPageSize={10} showSearch={true} />
           </Col>
        </Row>
       </>
    )
}


export default StudentHistory