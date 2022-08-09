import React, { useEffect, useState } from "react";
import {
    useTable, usePagination
} from "react-table";

import { Row, Col,
  Button, Spinner,
  Table,
  Label,
  Input,
  CustomInput,
  FormGroup,
  Pagination,
  PaginationItem,
  PaginationLink
} from "reactstrap";
import{matchSorter} from "match-sorter";
import classNames from "classnames";
import "./table.css";


const EditableCell = ({
    value: initialValue,
    row: { index },
    column: { id },
    updateMyData, // This is a custom function that we supplied to our table instance
  }) => {
    // We need to keep and update the state of the cell normally
    const [value, setValue] = React.useState(initialValue)
  
    const onChange = e => {
      setValue(e.target.value)
    }
  
    // We'll only update the external data when the input is blurred
    const onBlur = () => {
      updateMyData(index, id, value)
    }
  
    // If the initialValue is changed external, sync it up with our state
    React.useEffect(() => {
      setValue(initialValue)
    }, [initialValue])
  
    return <input className="form-control form-control-sm" value={value} onChange={onChange} onBlur={onBlur} />
  }
  const EditableTextAreaCell = ({
    value: initialValue,
    row: { index },
    column: { id },
    updateMyData, // This is a custom function that we supplied to our table instance
  }) => {
    // We need to keep and update the state of the cell normally
    const [value, setValue] = React.useState(initialValue)
  
    const onChange = e => {
      setValue(e.target.value)
    }
  
    // We'll only update the external data when the input is blurred
    const onBlur = () => {
      updateMyData(index, id, value)
    }
  
    // If the initialValue is changed external, sync it up with our state
    React.useEffect(() => {
      setValue(initialValue)
    }, [initialValue])
  
    return <textarea className="form-control form-control-sm" value={value} onChange={onChange} onBlur={onBlur} ></textarea>
  }
  const EditableNumberCell=({
    value: initialValue,
    row: { index },
    column: { id },
    updateMyData, // This is a custom function that we supplied to our table instance
  }) => {
    // We need to keep and update the state of the cell normally
    const [value, setValue] = React.useState(initialValue)
  
    const onChange = e => {
      setValue(e.target.value)
    }
  
    // We'll only update the external data when the input is blurred
    const onBlur = () => {
      updateMyData(index, id, value)
    }
  
    // If the initialValue is changed external, sync it up with our state
    React.useEffect(() => {
      setValue(initialValue)
    }, [initialValue])
  
    return <input type="number" className="form-control form-control-sm" value={value} onChange={onChange} onBlur={onBlur} />
  }
  
  // Set our editable cell renderer as the default Cell renderer
  const defaultColumn = {
    editableCell: EditableCell,
    editableTextAreaCell:EditableTextAreaCell,
    editableNumberCell:EditableNumberCell
  }

const REditTable = ({ columns, data, updateMyData, skipPageReset, loading = true, }) => {
 
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      // use the skipPageReset option to disable page resetting temporarily
      autoResetPage: !skipPageReset,
      // updateMyData isn't part of the API, but
      // anything we put into these options will
      // automatically be available on the instance.
      // That way we can call this function from our
      // cell renderer!
      updateMyData,
    },
    usePagination
  )

  return (
    <> <Table {...getTableProps()} hover bordered striped responsive>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()} className="theader">
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                    if(cell.column.editable){                        
                        return cell.column.type==='TEXTAREA'?<td {...cell.getCellProps()}>{cell.render('editableTextAreaCell')}</td>: 
                        cell.column.type==='NUMBER'?<td {...cell.getCellProps()}>{cell.render('editableNumberCell')}</td>:
                        <td {...cell.getCellProps()}>{cell.render('editableCell')}</td>
                    }else{
                        return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    }                  
                })}
              </tr>
            )
          })}
        </tbody>
      </Table>
      {page.length > 0 && (
        <div className={classNames("div-pagination", { "d-none": loading })}>
          <div className="d-flex justify-content-between">
                <select className="selectan"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                  }}
                >
                  {[10, 20, 30, 50, 100].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      {pageSize}
                    </option>
                  ))}
                </select>

                <div style={{flexWrap: 'nowrap'}}>
                <span>Page</span>
                <input type="number" className="inputan" defaultValue={pageIndex + 1} onChange={(e) => {
                    const page = e.target.value ? Number(e.target.value) - 1 : 0;
                    gotoPage(page);
                  }} />
                <span >{`of ${pageOptions.length}`}</span>
              </div>
          
            <Pagination className="pagina">
              <PaginationItem disabled={!canPreviousPage}>
                <PaginationLink onClick={() => gotoPage(0)}>
                  {"<<"}
                </PaginationLink>
              </PaginationItem>
              <PaginationItem disabled={!canPreviousPage}>
                <PaginationLink onClick={() => previousPage()}>
                  {"<"}
                </PaginationLink>
              </PaginationItem>
              <PaginationItem disabled={!canNextPage}>
                <PaginationLink onClick={() => nextPage()}>
                  {">"}
                </PaginationLink>
              </PaginationItem>
              <PaginationItem disabled={!canNextPage}>
                <PaginationLink onClick={() => gotoPage(pageCount - 1)}>
                  {">>"}
                </PaginationLink>
              </PaginationItem>
            </Pagination>
          </div>
        </div>
      )}
    </>
  )
}
export default REditTable