import React from 'react';
import moment from 'moment';
import { Form, Input, Select, InputNumber, DatePicker } from 'antd';
import InputStyle from './Constants/InputStyle';
import USAStates from './Constants/USAStates';
import MoneyInput from './MoneyInput';

const { Option } = Select;
const { RangePicker } = DatePicker;

export default function RenderField(y, getFieldDecorator, inputProps = {}) {
  let defaultValue = null;
  switch (y.InputStyle) {
    case InputStyle.Input:
      return (
        <Form.Item key={y.Id} label={y.Label} help={y.Help}>
          {getFieldDecorator(y.Column, {
            initialValue: y.DefaultValue,
          })(<Input placeholder={y.PlaceHolder} {...inputProps} />)}
        </Form.Item>
      );
    case InputStyle.InputNumber:
      return (
        <Form.Item key={y.Id} label={y.Label} help={y.Help}>
          {getFieldDecorator(y.Column, {
            initialValue: y.DefaultValue,
          })(
            <InputNumber
              formatter={value =>
                `${y.Payload.Prefix ? `${y.Payload.Prefix} ` : ''}${value}${
                  y.Payload.Suffix ? ` ${y.Payload.Suffix}` : ''
                }`
              }
              style={{ width: '100%' }}
              {...inputProps}
            />
          )}
        </Form.Item>
      );
    case InputStyle.Select:
      return (
        <Form.Item key={y.Id} label={y.Label} help={y.Help}>
          {getFieldDecorator(y.Column, {
            initialValue: y.DefaultValue,
          })(
            <Select
              mode={y.Payload.Mode}
              style={{ width: '100%' }}
              tokenSeparators={y.Payload.TokenSeparators}
              {...inputProps}
            >
              {window.jQuery.map(
                y.Payload.Options === 'USAStates' ? USAStates : y.Payload.Options,
                (val, key) => (
                  <Option key={key} value={key}>
                    {val}
                  </Option>
                )
              )}
            </Select>
          )}
        </Form.Item>
      );
    case InputStyle.RangePicker:
      defaultValue = !y.DefaultValue ? null : y.DefaultValue.map(x => (x ? moment(x) : null));
      if (defaultValue && !defaultValue[0] && defaultValue[1]) {
        [, defaultValue[0]] = defaultValue;
      }
      return (
        <Form.Item key={y.Id} label={y.Label} help={y.Help}>
          {getFieldDecorator(y.Column, {
            initialValue: defaultValue,
          })(<RangePicker placeholder={y.PlaceHolder} style={{ width: '100%' }} {...inputProps} />)}
        </Form.Item>
      );
    case InputStyle.Hidden:
      return (
        <Form.Item key={y.Id} label={y.Label} help={y.Help}>
          {getFieldDecorator(y.Column, {
            initialValue: y.DefaultValue,
          })(
            <Input
              disabled
              placeholder={y.PlaceHolder}
              style={{ display: 'none' }}
              {...inputProps}
            />
          )}
        </Form.Item>
      );
    case InputStyle.MoneyInput:
      return (
        <Form.Item key={y.Id} label={y.Label} help={y.Help}>
          {getFieldDecorator(y.Column, {
            initialValue: y.DefaultValue,
          })(<MoneyInput style={{ width: '100%' }} placeholder={y.PlaceHolder} {...inputProps} />)}
        </Form.Item>
      );
    default:
      throw new Error(
        `FormCore: Unspported input style ${
          y.Type
        }. You might want to consider using customized input styles. Pull Requests are welcome: https://github.com/pmq20/FormCore/pulls`
      );
  }
}
