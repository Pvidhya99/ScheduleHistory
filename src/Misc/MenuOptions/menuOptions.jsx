import React, {Fragment} from "react";
class MenuOptions extends React.Component {
     constructor(props){
        super(props);
      }
      
  render() {
    return (
    <div id={this.props.id||'menuOptions'} className="btn-group" style={{ margin: '5px 0' }}>
      {
        this.props.isAll && <button type="button" className={this.props.selectedOption=='All'?"btn btn-xs btn-inactive-color active":"btn btn-xs btn-inactive-color"}
        name="All" style={{ margin: 0, marginLeft: 3, fontSize: 12 }}
        onClick={(e) =>{this.props.onOptionSelect('All')}}>
        {'All'}</button>
      }
    {
      (this.props.menuOptionsList||[]).map((type,i)=>{
        return <button type="button" key={i} className={this.props.selectedOption==type?"btn btn-xs btn-inactive-color active":"btn btn-xs btn-inactive-color"}
          name="Lunch" style={{ margin: 0, marginLeft: 3, fontSize: 12 }}
          onClick={(e) =>{this.props.onOptionSelect(type)}}>
          {type}</button>
        })
      }
      </div>
    );
  }
}
export default MenuOptions
