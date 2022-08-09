import React, {Component} from 'react'
import '../../assets/css/style.css';
import logo from '../../assets/img/logo2.png';

class AppFooter extends Component {
    render() {
        return (

            <footer>
                <div className="container-fluid color-bar clearfix">
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
                <div className="copyRight clearfix">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-7 col-sm-12 col-xs-12">
                                <div className="copyRightText">
                                    <p> <img className="footer-logo" src={logo} alt=""/> Powered by<a
                                        href="https://www.mealmanage.com/" target="_blank"> MealManage LLC</a>.</p>
                                </div>
                            </div>  
                            <div className="col-md-5 col-sm-12 col-xs-12">
                                <div className="copyLeftText" style={{textAlign:"right"}}>
                                    <p><a
                                        href="/privacy-policy" target="_blank"> Privacy Policy</a></p>
                                </div>
                            </div>                           
                        </div>
                    </div>
                </div>
            </footer>

        )
    }
}

export default AppFooter;
