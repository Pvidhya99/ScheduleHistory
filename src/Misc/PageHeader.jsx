import React, {Component} from 'react';




class PageHeader extends Component
{
  render(){
    return(
      <div>
        <header>
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
</header>
<div>
<nav className="navbar navbar-default lightHeader">
  <div className= "container">
  <div className="navbar-header">
<ul >
<li >
<a href="javascript:void(0)"  data-toogle= "dropdown" role="button" aria-haspopup="true" aria-expanded="false"><i ></i><span>Button1</span></a>
<ul>
  <li><a ui-sref="home.schoolsetup" href="http://www.admin.ace.mealmanage.com/#/home/schoolsetup"><i class="fa fa-magic"></i>  Option1</a></li>
</ul>
</li>
<li >
<a href="javascript:void(0)"  data-toogle= "dropdown" role="button" aria-haspopup="true" aria-expanded="false"><i ></i><span>Button1</span></a>
<ul>
  <li><a ui-sref="home.schoolsetup" href="http://www.admin.ace.mealmanage.com/#/home/schoolsetup"><i class="fa fa-magic"></i>  Option1</a></li>
</ul>
</li>
<li >
<a href="javascript:void(0)"  data-toogle= "dropdown" role="button" aria-haspopup="true" aria-expanded="false"><i ></i><span>Button1</span></a>
<ul>
  <li><a ui-sref="home.schoolsetup" href="http://www.admin.ace.mealmanage.com/#/home/schoolsetup"><i class="fa fa-magic"></i>  Option1</a></li>
</ul>
</li>

</ul>

  </div>
  </div>
</nav>
</div>
</div>
    )
  }
}

export default PageHeader;
