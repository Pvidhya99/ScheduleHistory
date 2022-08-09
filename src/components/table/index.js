import React, { useEffect, useState } from "react";
import { useTable,useRowSelect, useMountedLayoutEffect,useSortBy,usePagination,useFilters,useGlobalFilter
  // useAsyncDebounce,
} from "react-table";

import { Row, Col,
  Button, Spinner,Table,Label,Input,CustomInput, FormGroup,Pagination,PaginationItem,PaginationLink} 
from "reactstrap";
import{matchSorter} from "match-sorter";
import classNames from "classnames";
import "../table";

function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter }
}) {
  return (
    <Input
      type="text"
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
      placeholder="Search..."
      style={{
        fontSize: "10px"
      }}
    />
  );
}

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
}

fuzzyTextFilterFn.autoRemove = (val) => !val;

const RTable = ({ columns, data, loading = true, showFilterSwitch=false, showSearch=false, onSelectedRowsChange, selectedRows }) => {
  const [switchSearch, setSwitchSearch] = useState(showSearch);
  const toggleSwitchSearch = () => {
    setAllFilters([]);
    setSwitchSearch(!switchSearch);
  };
  const filterTypes = React.useMemo(
    () => ({
      fuzzyText: fuzzyTextFilterFn,
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      }
    }),
    []
  );

  const defaultColumn = React.useMemo(
    () => ({
      Filter: DefaultColumnFilter
    }),
    []
  );

  const {
    getTableProps,getTableBodyProps,headerGroups,page,rows,
     prepareRow,canPreviousPage,canNextPage,pageOptions,pageCount,
     gotoPage,nextPage, previousPage,setPageSize,setAllFilters, selectedFlatRows,
    state: { pageIndex, pageSize, selectedRowIds }} = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10, selectedFlatRows: selectedRows||[], selectedRowIds:selectedRows||[] },
      defaultColumn,
      filterTypes
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect
  );
  useMountedLayoutEffect(() => {
    onSelectedRowsChange && onSelectedRowsChange(selectedRowIds);
  }, [onSelectedRowsChange, selectedRowIds]); 

  return (
    <>
    { showFilterSwitch &&
      <div>
        <span className="float-right ">
          <CustomInput
            checked={switchSearch}
            className="table-search-switch"
            type="switch"
            name="customSwitch"
            id="customSwitch"
            onClick={toggleSwitchSearch}
            label="Filter Data"
          />
        </span>
      </div>
}
      <Table className="rtable" {...getTableProps()} hover bordered striped responsive>
        <thead>
          {headerGroups.map((headerGroup,j) => (
            <>
              <tr key={j} className="theader" {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column,k) => (
                  <th key={k} {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render("Header")}
                    <span className="float-right">
                      {!column.notShowSortingDisplay ? (
                        column.isSorted ? (
                          column.isSortedDesc ? (
                            <i className="faCaretDown"></i>                            
                          ) : (
                            <i className="faCaretUp"></i>
                          )
                        ) : (
                          <i></i>
                        )
                      ) : (
                        ""
                      )}
                    </span>
                  </th>
                ))}
              </tr>
              {switchSearch ? (
                <tr style={{ backgroundColor: "aliceBlue" }}>
                  {headerGroup.headers.map((column, index) => (
                    <td key={index} className="tfilter">
                      {column.canFilter ? (
                        <FormGroup className="mb-1">
                          <Label className="divFilter mb-0">
                            Filter {column.render("Header")} :
                          </Label>
                          {column.render("Filter")}
                        </FormGroup>
                      ) : null}
                    </td>
                  ))}
                </tr>
              ) :null
              }
            </>
          ))}
        </thead>
        {loading ? (
          <tbody>
            <tr>
              <td colSpan="10000" className="text-center">
                <Button variant="primary" disabled>
                  <Spinner
                    as="span"
                    animation="grow"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  Loading...
                </Button>
              </td>
            </tr>
          </tbody>
        ) : (
          <>
            {page.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan="10000" className="text-left">
                    No rows found
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody {...getTableBodyProps()}>
                {page.map((row, i) => {
                  prepareRow(row);
                  return (
                    <tr key={i} {...row.getRowProps()}>
                      {row.cells.map((cell) => {
                        return (
                          <td
                            {...cell.getCellProps({
                              className: cell.column.className,
                              style: cell.column.style
                            })}
                          >
                            {cell.render("Cell")}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            )}
          </>
        )}
      </Table>

      {page.length > 0 && (
        <div className={classNames("div-pagination", { "d-none": loading })}>
          <div className="d-flex justify-content-between">
            <span>{`Tot. Rows: ${rows.length} `}</span>
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
  );
};
export default RTable