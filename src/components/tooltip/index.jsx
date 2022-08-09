import React, { useState } from "react";
import { Button, Tooltip } from "reactstrap";

const TooltipItem = props => {
  const { item,children} = props;
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const toggle = () => {
      setTooltipOpen(!tooltipOpen);
    }

  return (<>{
    (item.text||'')!=='' &&<>
        {
            children||<span className="cursor-pointer" id={"Tooltip-" + item.id}>
            {item.text}
            </span>
        }
      
      <Tooltip
        placement={item.placement}
        isOpen={tooltipOpen}
        target={"Tooltip-" + item.id}
        toggle={toggle}
      >
        {item.tooltipContent}
      </Tooltip>
    
    </>}</>
  );
};

export default TooltipItem