import numeral from 'numeral';
import React from 'react';
import { Input, Tooltip } from 'antd';

export default class MoneyInput extends React.Component {
  onChange = e => {
    const { value } = e.target;
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      this.props.onChange(value);
    }
  };
  // '.' at the end or only '-' in the input box.
  onBlur = () => {
    const { value, onBlur, onChange } = this.props;
    if (value && (value.charAt(value.length - 1) === '.' || value === '-')) {
      onChange({ value: value.slice(0, -1) });
    }
    if (onBlur) {
      onBlur();
    }
  };
  render() {
    const {
      value,
      addonBefore = '$',
      addonAfter,
      placeholder = '0.00',
      formatTooltip = true,
      ...restProps
    } = this.props;
    let title = 'Input an amount';
    if (value) {
      title = value;
      if (formatTooltip)
        title = (
          <span className="numeric-input-title">
            {value !== '-' ? `$${numeral(value).format('0,0.00')}` : '-'}
          </span>
        );
    }

    return (
      <div className="formcore_moneyinput">
        <Tooltip
          trigger={['focus']}
          title={title}
          placement="bottomLeft"
          overlayClassName="numeric-input"
        >
          <Input
            {...restProps}
            value={value}
            onChange={this.onChange}
            onBlur={this.onBlur}
            addonBefore={addonBefore}
            addonAfter={addonAfter}
            placeholder={placeholder}
            maxLength="25"
            autoComplete="off"
          />
        </Tooltip>
      </div>
    );
  }
}
