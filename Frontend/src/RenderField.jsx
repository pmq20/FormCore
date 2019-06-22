import _ from 'lodash';
import React from 'react';
import moment from 'moment';
import { Form, Input, Select, InputNumber, DatePicker, Radio } from 'antd';
import InputStyle from './Constants/InputStyle';
import MoneyInput from './MoneyInput';

const { Option } = Select;
const { RangePicker } = DatePicker;

export default function RenderField(field, form, data, inputProps = {}, renderExtra = null, state, handlers) {
  let defaultValue = null;
  const { getFieldDecorator } = form;
  switch (field.InputStyle) {
    case InputStyle.Input:
      defaultValue = data ? data[field.Column] : field.DefaultValue;
      return (
        <Form.Item key={field.Id} label={field.Label} help={field.Help}>
          <div hidden={!field.DisplayOnly}>
            {defaultValue}
          </div>
          <div hidden={field.DisplayOnly}>
              {getFieldDecorator(field.Column, {
                initialValue: defaultValue,
              })(<Input placeholder={field.PlaceHolder} {...inputProps} />)}
          </div>
        </Form.Item>
      );
    case InputStyle.InputNumber:
      defaultValue = data ? data[field.Column] : field.DefaultValue;
      const formatter = value => (
      `${field.Payload.Prefix ? `${field.Payload.Prefix} ` : ''}${value}${
        field.Payload.Suffix ? ` ${field.Payload.Suffix}` : ''
      }`);
      const parser = value => {
        let ret = value;
        if(field.Payload.Prefix) ret = value.replace(`${field.Payload.Prefix} `, '');
        if(field.Payload.Suffix) ret = value.replace(` ${field.Payload.Suffix}`, '');
        return ret;
      };
      return (
        <Form.Item key={field.Id} label={field.Label} help={field.Help}>
          <div hidden={!field.DisplayOnly}>
            {formatter(defaultValue)}
          </div>
          <div hidden={field.DisplayOnly}>
            {getFieldDecorator(field.Column, {
              initialValue: defaultValue,
            })(
              <InputNumber
                formatter={formatter}
                parser={parser}
                style={{ width: '100%' }}
                disabled={field.Disabled}
                {...inputProps}
              />
            )}  
          </div>
        </Form.Item>
      );
    case InputStyle.Select:
      defaultValue = data ? data[field.Column] : field.DefaultValue;
      defaultValue = defaultValue === null ? undefined : defaultValue;

      const defaultValues = _.isArray(defaultValue) ? defaultValue : [defaultValue];
      return (
        <Form.Item key={field.Id} label={field.Label} help={field.Help}>
          <div hidden={!field.DisplayOnly} style={{minHeight: 39.2}}>
            {_.filter(field.Payload.Options, o => _.includes(defaultValues, o.Value) ).map(o => o.Display).join(", ")}
          </div>
          <div hidden={field.DisplayOnly}>
            {getFieldDecorator(field.Column, {
              initialValue: defaultValue,
            })(
              <Select
                className="formcore_select"
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
          </div>
        </Form.Item>
      );
    case InputStyle.DatePicker:
      defaultValue = data ? data[field.Column] : field.DefaultValue;
      defaultValue = defaultValue ? moment(defaultValue).local() : null;
      return(
        <Form.Item key={field.Id} label={field.Label}>
          {getFieldDecorator(field.Column, {
            initialValue:defaultValue
          })(<DatePicker style={{ width: '100%' }} />)}
        </Form.Item>
      );
    case InputStyle.InfiniteOrFixedDateRadioGroup:
      defaultValue = data ? data[field.Column] : field.DefaultValue;
      defaultValue = defaultValue || "fixed";
      return (
        <Form.Item key={field.Id} label={field.Label}>
          <Radio.Group
            defaultValue={defaultValue}
            onChange={handlers.handleExpiredAtTypeChange}
          >
            <Radio.Button value="fixed">Fixed</Radio.Button>
            <Radio.Button value="indefinite">Indefinite</Radio.Button>
          </Radio.Group>
        </Form.Item>
      );
      case InputStyle.InfiniteOrFixedDateDatePicker:
        defaultValue = data ? data[field.Column] : field.DefaultValue;
        defaultValue = defaultValue ? moment(defaultValue).local() : null;
        return (
          <Form.Item key={field.Id} label={field.Label}>
            {getFieldDecorator('ExpiredAt', {
              initialValue: defaultValue,
            })(
              <DatePicker
                style={{ width: '100%' }}
                disabled={state.expiredAtType === 'indefinite'}
              />
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
    case InputStyle.RangeLatterHalfPicker:
      var ph = _.split(field.PlaceHolder,",");
      defaultValue = data[field.Column];
      return (
      <Form.Item key={field.Id} label={field.Label} help={field.Help}>
        <span hidden={field.DisplayOnly}>
          { defaultValue[0].format('YYYY-MM-DD') +" ~ "}
        </span>
        <span hidden={field.DisplayOnly}>
            {getFieldDecorator(field.Column, {
            })(<DatePicker disabledDate={current => {
              const MinExpiredAt = _.get(field, 'Payload.MinExpiredAt', null);            
              return current && current < MinExpiredAt;
            }}
            placeholder={ph[1]}
            style={{ width: '50%' }} {...inputProps} />)}
        </span>
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
          <div hidden={!field.DisplayOnly}>
            {`$ ${defaultValue}`}
          </div>
          <div hidden={field.DisplayOnly}>
            {getFieldDecorator(field.Column, {
              initialValue: defaultValue,
            })(
              <MoneyInput style={{ width: '100%' }} placeholder={field.PlaceHolder} {...inputProps} />
            )}
          </div>
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
