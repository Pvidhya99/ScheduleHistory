import React, {Fragment} from "react";
class RadioMenu extends React.Component {
     constructor(props){
        super(props);
      }
      
  render() {
    return (
        <div>
        {
        (this.props.radioMenuList||[]).map((type,i)=>{
          return <div style={{marginLeft:"14px"}} className="styled-input-single col-md-4">
              <input type="radio" key={i}   onChange={(e) =>{this.props.onOptionSelect(type)}} name="All" 
          checked={false} checked={this.props.selectedOption==type}
           />
          <label style={{fontSize:"xx-small"}}>{type}</label></div>
          })
        }
        </div>
    );
  }
}
export default RadioMenu