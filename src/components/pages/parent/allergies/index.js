import React, { useContext, useEffect } from 'react'
import CardWithLegend from '../../../common/CardWithLegend'
import useAllergeis from '../../../../hooks/useAllergies'
import { useLocation } from 'react-router-dom'
import { Button, Col, FormGroup, Input, Label, Row } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ContainerHeader from '../../../common/ContainerHeader'
import { ParentContext } from '../../../../context/Context'

const AllergiesComponent = ({title})=>{
    const {parentDispatch} = useContext(ParentContext)
 
   useEffect(()=>{
    parentDispatch({ 
        type: 'UPDATE_TITLE',
        payload: title
    }) 
   },[title])
    const {state:{index,schoolId}} = useLocation()

    const {stateData,enableEdit,saveChanges,textHandler} = useAllergeis({index,schoolId})

    const renderStudents = (val) =>{
        return stateData[val].map((item,index)=>{
            return (
                <Row xs="12" key={index} className="align-items-center">
                    <Col md="3" xs="4" className="pb-2">
                        {item.firstName}{' '}{ item.lastName}
                    </Col>
                    <Col md="4" xs="6" className="mt-2">
                    <FormGroup>
                        <Input
                            type="textarea" 
                            value={item.allergies || ''}
                            disabled={!item.isEdit}
                            onChange={(e)=>{textHandler(e,index,val)}}
                        />
                        </FormGroup>
                    </Col>
                    <Col md="4" xs="2" className="pb-2">
                    { !item.isEdit && 
                        <Button color="link"  onClick={()=>{
                            enableEdit(index,val)
                        }}>
                        
                        <FontAwesomeIcon icon="pencil-alt" />
                        </Button>
                    }
                   
                    { item.isEdit && (
                        <>
                            <Button color="link"  onClick={()=>{
                                enableEdit(index,val)
                            }}>
                                 <FontAwesomeIcon icon="times" />
                            </Button>
                            <Button color="link"  onClick={()=>{
                                saveChanges(index,val)
                            }}>
                                 <FontAwesomeIcon icon="check" />
                            </Button>
                        </>
                        )

                        }
                    </Col>
                </Row>
           )
        })
    }
  
    return(
        <>
        <ContainerHeader title=""/>
        <Row >
        
    <Col xs="12" md="12">
          {Object.keys(stateData).map(value=>(
                <CardWithLegend key={value} title={stateData[value][0].schoolName}> 
                    { renderStudents(value)}
                </CardWithLegend>
            ))}
        </Col> 
        
        </Row>
        </>
    )

}
export default AllergiesComponent