import React from 'react';
import moment from 'moment';
import { Form, Input, Select, InputNumber, DatePicker } from 'antd';
import InputStyle from './Constants/InputStyle';
import MoneyInput from './MoneyInput';

const { Option } = Select;
const { RangePicker } = DatePicker;

export default function RenderField(field, form, inputProps = {}, renderExtra = null) {
  let defaultValue = null;
  const { getFieldDecorator } = form;
  switch (field.InputStyle) {
    case InputStyle.Input:
      return (
        <Form.Item key={field.Id} label={field.Label} help={field.Help}>
          {getFieldDecorator(field.Column, {
            initialValue: field.DefaultValue,
          })(<Input placeholder={field.PlaceHolder} {...inputProps} />)}
        </Form.Item>
      );
    case InputStyle.InputNumber:
      return (
        <Form.Item key={field.Id} label={field.Label} help={field.Help}>
          {getFieldDecorator(field.Column, {
            initialValue: field.DefaultValue,
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
      return (
        <Form.Item key={field.Id} label={field.Label} help={field.Help}>
          {getFieldDecorator(field.Column, {
            initialValue: field.DefaultValue,
          })(
            <Select
              mode={field.Payload.Mode}
              style={{ width: '100%' }}
              tokenSeparators={field.Payload.TokenSeparators}
              {...inputProps}
            >
              {window.jQuery.map(field.Payload.Options, option => (
                <Option key={option.Value} value={option.Value}>
                  {option.Display}
                </Option>
              ))}
            </Select>
          )}
        </Form.Item>
      );
    case InputStyle.RangePicker:
      defaultValue = !field.DefaultValue
        ? null
        : field.DefaultValue.map(x => (x ? moment(x) : null));
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
      return (
        <Form.Item key={field.Id} label={field.Label} help={field.Help}>
          {getFieldDecorator(field.Column, {
            initialValue: field.DefaultValue,
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
      return (
        <Form.Item key={field.Id} label={field.Label} help={field.Help}>
          {getFieldDecorator(field.Column, {
            initialValue: field.DefaultValue,
          })(
            <MoneyInput style={{ width: '100%' }} placeholder={field.PlaceHolder} {...inputProps} />
          )}
        </Form.Item>
      );
    default:
      if (renderExtra) {
        return renderExtra(field, form, inputProps);
      } else {
        throw new Error(
          `FormCore: Unspported input style ${field.InputStyle} of field ${
            field.Id
          }. You might want to consider using customized input styles, cf. the renderExtra parameter. Otheriwse pull Requests are welcome: https://github.com/pmq20/FormCore/pulls`
        );
      }
  }
}
