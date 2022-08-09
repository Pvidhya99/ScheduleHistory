import React from 'react';

 const formatNumber=(value)=> {
  value += '';
  const list = value.split('.');
  const prefix = list[0].charAt(0) === '-' ? '-' : '';
  let num = prefix ? list[0].slice(1) : list[0];
  let result = '';
  while (num.length > 3) {
    result = `,${num.slice(-3)}${result}`;
    num = num.slice(0, num.length - 3);
  }
  if (num) {
    result = num + result;
  }
  return `${prefix}${result}${list[1] ? `.${list[1]}` : ''}`;
}

class NumericBox extends React.Component {
  onChange = e => {
    const { value } = e.target;
    const reg = /^-?\d*(\.\d*)?$/;
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      this.props.onChange(e,value);
    }
  };

  // '.' at the end or only '-' in the input box.
  onBlur = (e) => {
    const { value, onBlur, onChange } = this.props;
    let valueTemp = (value+'');
    if ((value+'').charAt((value+'').length - 1) === '.' || (value+'') === '-') {
      valueTemp = (value+'').slice(0, -1);
    }
    e.target.value=valueTemp.replace(/0*(\d+)/, '$1');
    onChange(e);
    if (onBlur) {
      onBlur(e);
    }
  };

  render() {
    return (      
        <input
          {...this.props}
          onChange={this.onChange}
          onBlur={this.onBlur}
          placeholder="0.00"
          maxLength={25}
        />
    );
  }
}

export default NumericBox;