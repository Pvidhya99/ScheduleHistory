import React from "react"

const CardWithLegend = ({title,children})=>{

return (
    <div>
        
    <fieldset className="card-field">
      <legend className="card-legend">{title}</legend>
      {children}

    </fieldset>
    
    </div>
)

}

export default CardWithLegend