import _ from 'lodash';
import React from 'react';
import moment from 'moment';
import { Form, Input, Select, InputNumber, DatePicker } from 'antd';
import InputStyle from './Constants/InputStyle';
import MoneyInput from './MoneyInput';

const { Option } = Select;
const { RangePicker } = DatePicker;

export default function RenderField(field, form, data, inputProps = {}, renderExtra = null) {
  let defaultValue = null;
  const { getFieldDecorator } = form;
  switch (field.InputStyle) {
    case InputStyle.Input:
      defaultValue = data ? data[field.Column] : field.DefaultValue;
      return (
        <Form.Item key={field.Id} label={field.Label} help={field.Help}>
          {getFieldDecorator(field.Column, {
            initialValue: defaultValue,
          })(<Input placeholder={field.PlaceHolder} {...inputProps} />)}
        </Form.Item>
      );
    case InputStyle.InputNumber:
      defaultValue = data ? data[field.Column] : field.DefaultValue;
      return (
        <Form.Item key={field.Id} label={field.Label} help={field.Help}>
          {getFieldDecorator(field.Column, {
            initialValue: defaultValue,
          })(
            <InputNumber
              formatter={value =>
                `${field.Payload.Prefix ? `${field.Payload.Prefix} ` : ''}${value}${
                  field.Payload.Suffix ? ` ${field.Payload.Suffix}` : ''
                }`
              }
              style={{ width: '100%' }}
              {...inputProps}
            />
          )}
        </Form.Item>
      );
    case InputStyle.Select:
      defaultValue = data ? data[field.Column] : field.DefaultValue;
      return (
        <Form.Item key={field.Id} label={field.Label} help={field.Help}>
          {getFieldDecorator(field.Column, {
            initialValue: defaultValue,
          })(
            <Select
              mode={field.Payload.Mode}
              style={{ width: '100%' }}
              tokenSeparators={field.Payload.TokenSeparators}
              {...inputProps}
            >
              {_.map(field.Payload.Options, option => (
                <Option key={option.Value} value={option.Value}>
                  {option.Display}
                </Option>
              ))}
            </Select>
          )}
        </Form.Item>
      );
    case InputStyle.RangePicker:
      if (data) {
        defaultValue = data[field.Column];
      } else {
        defaultValue = !field.DefaultValue
        ? null
        : field.DefaultValue.map(x => (x ? moment(x) : null));
      }
      if (defaultValue && !defaultValue[0] && defaultValue[1]) {
        [, defaultValue[0]] = defaultValue;
      }
      return (
        <Form.Item key={field.Id} label={field.Label} help={field.Help}>
          {getFieldDecorator(field.Column, {
            initialValue: defaultValue,
          })(
            <RangePicker
              disabledDate={current => {
                const MinStartedAt = _.get(field, 'Payload.MinStartedAt', null);
                return current && current < MinStartedAt;
              }}
              placeholder={field.PlaceHolder}
              style={{ width: '100%' }}
              {...inputProps}
            />
          )}
        </Form.Item>
      );
    case InputStyle.Hidden:
      defaultValue = data ? data[field.Column] : field.DefaultValue;
      return (
        <Form.Item key={field.Id} label={field.Label} help={field.Help}>
          {getFieldDecorator(field.Column, {
            initialValue: defaultValue,
          })(
            <Input
              disabled
              placeholder={field.PlaceHolder}
              style={{ display: 'none' }}
              {...inputProps}
            />
          )}
        </Form.Item>
      );
    case InputStyle.MoneyInput:
      defaultValue = data ? data[field.Column] : field.DefaultValue;
      return (
        <Form.Item key={field.Id} label={field.Label} help={field.Help}>
          {getFieldDecorator(field.Column, {
            initialValue: defaultValue,
          })(
            <MoneyInput style={{ width: '100%' }} placeholder={field.PlaceHolder} {...inputProps} />
          )}
        </Form.Item>
      );
    case InputStyle.DisplayOnly:
      defaultValue = data ? data[field.Column] : field.DefaultValue;
      return (
        <Form.Item key={field.Id} label={field.Label} help={field.Help}>
          {getFieldDecorator(field.Column, {
            initialValue: defaultValue,
          })(
            <Input
              disabled
              className="formcore_display-only-input"
              style={{ width: '100%' }}
              placeholder={field.PlaceHolder}
              {...inputProps}
            />
          )}
        </Form.Item>
      );
    default:
      if (renderExtra) {
        return renderExtra(field, form, data, inputProps);
      }
      throw new Error(
        `FormCore: Unspported input style ${field.InputStyle} of field ${
          field.Id
        }. You might want to consider using customized input styles, cf. the renderExtra parameter. Otheriwse pull Requests are welcome: https://github.com/pmq20/FormCore/pulls`
      );
  }
}
