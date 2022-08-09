import React, { Component } from 'react';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import checkboxHOC from "react-table-6/lib/hoc/selectTable";
import ReactTablePagination from './reactTablePagination'
const CheckboxTable = checkboxHOC(ReactTable);
class RTable extends Component {
  constructor(props){
    super(props);
    this.state={
      selectAll:false,
      selection:[]
    }
  }
  componentWillMount=()=>{
    this.setState({selectAll:this.props.selectAll, selection:this.props.selection});
  }
  componentWillReceiveProps=(nextProps)=>{
    this.setState({selectAll:nextProps.selectAll, selection:nextProps.selection});
  }
    isNumber=(input)=>{
        if(String(input).match(/^-{0,1}\d+$/)){
            return true
          }else if(String(input).match(/^\d+\.\d+$/)){
            return true
          }else{
            return false
          }
    }
    toggleSelection = (key, shift, row) => {
      const {data}=this.props;
      let selection = [...this.state.selection];
      const keyIndex = selection.indexOf(key);
      if (keyIndex >= 0) {
        selection = [
          ...selection.slice(0, keyIndex),
          ...selection.slice(keyIndex + 1)
        ];
      } else {
        selection.push(key);
      }
      const allSelected=((data||[]).length===selection.length) && (data||[]).length>0 ? true:false;      
      //this.setState({selection:[...selection],selectAll:allSelected})
      this.props.setSelection([...selection]);
      this.props.setSelectAll(allSelected);
    }
    toggleAll = () => {
      const _selectAll = this.state.selectAll ? false : true;
      const _selection = [];
      if (_selectAll) {
        const wrappedInstance = this.checkboxTable.getWrappedInstance();
        const currentRecords = wrappedInstance.getResolvedState().sortedData;
        currentRecords.forEach(item => {
          _selection.push(`select-${item._original._id}`);
        });
      }
      //this.setState({selectAll:_selectAll, selection:_selection})
      this.props.setSelection([..._selection]);
      this.props.setSelectAll(_selectAll);
    };
    isSelected = key => {
      const keySelect=`select-${key}`;
      return this.state.selection.includes(keySelect);
    };
    
render(){
  const { toggleSelection, toggleAll, isSelected } = this;
  const { selectAll } = this.state;
  const checkboxProps = {
    selectAll,
    isSelected,
    toggleSelection,
    toggleAll,
    selectType: "checkbox",
    getTrProps: (s, r) => {
      // someone asked for an example of a background color change
      // here it is...
      const selected = this.isSelected(r.original._id);
      return {
        style: {
          backgroundColor: selected ? "lightgreen" : "inherit"
          // color: selected ? 'white' : 'inherit',
        }
      };
    }
  };
    return(<>
    {
      this.props.isCheckBoxTable?
      <CheckboxTable {...this.props}
        ref={(reactTable) => { this.checkboxTable = reactTable; }}
        minRows = {0}
        PaginationComponent={ReactTablePagination}
        defaultFilterMethod={(filter, row)=> {
             const id = filter.pivotId || filter.id;
             return (
               row[id] !== undefined ?
               this.isNumber(row[id])? (row[id].toString()).includes(filter.value):
                 String(row[id].toLowerCase()).includes(filter.value.toLowerCase())
               :
                 true
             )}}
          className="-striped -highlight"
          {...checkboxProps}
        />
        :
        <ReactTable {...this.props} rowsText="" ref={(reactTable) => { this.tmReactTable = reactTable; }} 
        minRows = {0}
        PaginationComponent={ReactTablePagination}
         defaultFilterMethod={(filter, row)=> {
              const id = filter.pivotId || filter.id;
              return (
                row[id] !== undefined ?
                this.isNumber(row[id])? (row[id].toString()).includes(filter.value):
                  String(row[id].toLowerCase()).includes(filter.value.toLowerCase())
                :
                  true
              )}} />
    
    }
        
    </>)
}
}
export default RTable