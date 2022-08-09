import React, {Component} from 'react';
// import '../../App.css';
// import '../style.css';

import {Link} from 'react-router-dom';


let headerSchool = {
    marginBottom: '40px'
};

class Table extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: this.props.list,

        };
    }


    componentWillMount = () => {


        //console.log('list',this.state.list)

    }

    getList = (props) => {
        fetch(this.props.url, {
            method: 'get'
        })
            .then((response) => {
                console.log('response', response);
                if (!response.ok) {

                    throw Error(response.statusText);
                }
                return response.json();
            })

            .then(data => {
                console.log('data', data);
                this.setState({list: data[this.props.parObj][this.props.chiObj]});
            })


            .catch(
                (error) => {
                    console.log('Get List response error', error)
                }
            )

    }
    render() {

        //this.setState({list:this.props.list})
        //console.log('list',this.state.list)
        //let list = this.state.list || [];

        function buttonFormatter(cell, row) {
            return '<BootstrapButton type="submit"></BootstrapButton>';
        }

        return (


            <div>

                <div className="sectionTitle text-center">
                    <h2 style={headerSchool}>
                        <span className="shape shape-left bg-color-4"/>
                        <span>{this.props.tableName}</span>
                        <span className="shape shape-right bg-color-4"/>
                    </h2>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-xs-12 button-group-section form-group">
                            <Link className="btn btn-sm btn-outline-success button-sm pull-right add-btn-sm" id="addSchool" onClick={this.props.edit.bind( this,'','ADD' )}   style={{float: 'right'}}
                                  to={this.props.links[0]}><i className="fa fa-plus" /> {this.props.links[1]}</Link>
                            <input type="text" id="search"   style={{float: 'left', marginTop: '25px'}} className="search" name="search" placeholder="Search.." onKeyUp={this.filterSchool} />
                        </div>
                        <div className="col-md-12 col-sm-12 col-xs-12">
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                    <tr className="bg-success base-reverse">
                                        {this.props.colNames.map( col =>
                                            <th width="30%">{col}</th>
                                        )}
                                        <th class="text-center" colspan="2">Action</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.props.list.map( col =>
                                        <tr>
                                            {this.props.colList.map( colName =>
                                                <td width="30%">{col[colName]}</td> )}
                                            <td class="actions text-center">
                                                <Link to={this.props.links[0]}><a class="edit-btn" onClick={this.props.edit.bind( this, col ,"EDIT")} tooltip-placement="top" uib-tooltip="Edit"><i class="fa fa-pencil tbl-rounded-icon bg-color-1"></i></a></Link>
                                            </td>
                                            <td class="actions text-center">
                                                <a class="delete-btn" onClick={this.props.delete.bind( this, col )} tooltip-placement="top" uib-tooltip="Delete"><i class="fa fa-trash-o tbl-rounded-icon bg-color-3"></i></a>
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Table;