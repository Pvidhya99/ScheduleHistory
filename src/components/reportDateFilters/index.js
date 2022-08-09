import { useEffect } from "react";
import { Button, ButtonGroup, Card, CardHeader } from "reactstrap";
import moment from 'moment-timezone';
import { enumDateFilterOptions } from "../../helpers/utils";
export const calculateDateRange=(selectedPeriod)=>{
    switch(selectedPeriod.value){
        case enumDateFilterOptions.Today.value:
            return {fromDate:moment().startOf('D'), toDate:moment().endOf('D')};
        case enumDateFilterOptions.Yesterday.value:
            return {fromDate:moment().subtract(1,'d').startOf('D'), toDate:moment().subtract(1,'d').endOf('D')};
        case enumDateFilterOptions.ThisWeek.value:
            return {fromDate:moment().startOf('W'), toDate:moment().endOf('W')};
        case enumDateFilterOptions.LastWeek.value:
            return {fromDate:moment().subtract(1,'w').startOf('W'), toDate:moment().subtract(1,'w').endOf('W')};
        case enumDateFilterOptions.ThisMonth.value:
            return {fromDate:moment().startOf('M'), toDate:moment().endOf('M')};
        case enumDateFilterOptions.LastMonth.value:
            return {fromDate:moment().subtract(1,'m').startOf('M'), toDate:moment().subtract(1,'m').endOf('M')};
        case enumDateFilterOptions.ThisYear.value:
            return {fromDate:moment().startOf('y'), toDate:moment().endOf('y')};
        default:
            return undefined
    }
}
const ReportDateFilters=(props)=>{
    const {color, outline, selectedPeriod, setSelectedPeriod, size, setDateRange}=props;

    useEffect(()=>{
            setDateRange(calculateDateRange(selectedPeriod));
    },[selectedPeriod])
    const onDateFilterOptionClick=(opt)=>{
        setSelectedPeriod(opt);
    }

    return (
        <Card>
            <CardHeader className="p-2">
                <ButtonGroup className="d-flex">
                    {
                        Object.keys(enumDateFilterOptions).map((opt,i)=>{
                            return <Button key={i} size={size}
                            active={selectedPeriod.value===enumDateFilterOptions[opt].value}
                            color={color} 
                            outline={outline}
                            onClick={()=>onDateFilterOptionClick(enumDateFilterOptions[opt])}
                            >{enumDateFilterOptions[opt].text}</Button>
                        })
                    }
                </ButtonGroup>

            </CardHeader>
        </Card>
    )

}

export default ReportDateFilters