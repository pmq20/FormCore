import numeral from 'numeral';
import React from 'react';
import { Input, Tooltip } from 'antd';
// eslint-disable-next-line no-unused-vars
import styles from './index.less';

function isNumber(obj) {
  return typeof obj === 'number' && !isNaN(obj);
}

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
    const { onBlur, onChange } = this.props;
    let { value } = this.props;
    if (isNumber(value)) value = value.toString();

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
    );
  }
}
