import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import logo from '../../assets/img/logo1.png';

class AppHeader extends Component {    
    render() {
        return (
            <div>
                <header id="pageTop" className="header-wrapper">
                    <div className="container-fluid color-bar top-fixed clearfix">
                        <div className="row">
                            <div className="col-sm-1 col-xs-2 bg-color-1">fix bar</div>
                            <div className="col-sm-1 col-xs-2 bg-color-2">fix bar</div>
                            <div className="col-sm-1 col-xs-2 bg-color-3">fix bar</div>
                            <div className="col-sm-1 col-xs-2 bg-color-4">fix bar</div>
                            <div className="col-sm-1 col-xs-2 bg-color-5">fix bar</div>
                            <div className="col-sm-1 col-xs-2 bg-color-6">fix bar</div>
                            <div className="col-sm-1 bg-color-1 hidden-xs">fix bar</div>
                            <div className="col-sm-1 bg-color-2 hidden-xs">fix bar</div>
                            <div className="col-sm-1 bg-color-3 hidden-xs">fix bar</div>
                            <div className="col-sm-1 bg-color-4 hidden-xs">fix bar</div>
                            <div className="col-sm-1 bg-color-5 hidden-xs">fix bar</div>
                            <div className="col-sm-1 bg-color-6 hidden-xs">fix bar</div>
                        </div>
                    </div>
                    <nav id="menuBar" className="navbar navbar-default lightHeader">
                    <div className="container">
                        <div className="navbar-header">                  
                            <Link className="navbar-brand" id="brand" to=""><img className="super-admin-logo"
                                                                                            src={logo} alt=""/></Link>
                        </div>                       
                    </div>
                </nav>
                </header>
                


            </div>
        )
    }
}

export default AppHeader;
