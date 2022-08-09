import React, { Component, Fragment } from 'react';
import * as qs from 'query-string';
import './paymobCallback.css'


export default class PaymobCallback extends Component {
    constructor(props){
        super(props);
        this.state={
            respObject:{}
        }
    }
    componentWillMount=()=>{
        console.log(this)
        const parsed = qs.parse(this.props.location.search)||{};
        this.setState({respObject:parsed})
        console.log(parsed);
    }
    render() {
        const {respObject}=this.state
        return (
            <Fragment>
                <section className="full-width clearfix" style={{marginTop:'20px'}}>
                    <div className="container parent-container" style={{minHeight:445}}>
                    {
                        ((respObject||{}).error_occured||'true')=='true'?
                        <div className="row">
                            <div className="col-md-12">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div id='card' class="animated fadeIn">
                                            <div className='upper-side bg-color-1'>
                                                <i className="fa fa-exclamation-triangle fa-5x"></i>
                                                <h3 id='statusError'>
                                                Payment Failed
                                                </h3>
                                            </div>
                                            <div id='lower-side'>
                                                <p id='message'>
                                                Your payment could not be processed.
                                                </p>
                                                <div id="contBtn" className="bg-color-1" onClick={()=>{
                                            window.location.href='/parent';
                                        }}>Back to dashboard</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>                                
                            </div>
                        </div>:
                        <div className="row">
                            <div className="col-md-12">
                                <div id='card' class="animated fadeIn">
                                    <div className='upper-side'>
                                        <i className="fa fa-check-circle-o fa-5x"></i>
                                        <h3 id='status'>
                                        Success
                                        </h3>
                                    </div>
                                    <div id='lower-side'>
                                        <p id='message'>
                                        Congratulations, Payment process completed successfully.
                                        </p>
                                        <div id="contBtn" onClick={()=>{
                                            window.location.href='/parent';
                                        }}>Back to dashboard</div>
                                    </div>
                                    </div>
                            </div>
                        </div>
                    }
                    </div>
                </section>
                   
            </Fragment>
        )
    }
}
