import React, { Component,Fragment } from 'react';
import ReactExport from 'react-data-export';
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

class TmExportExcel extends Component {
    render() {
        return(<Fragment>
        <ExcelFile {...this.props}>
                    <ExcelSheet dataSet={this.props.dataSet} name={this.props.name}/>
                </ExcelFile>
        </Fragment>)
    }
}
export default TmExportExcel