import _ from 'lodash';
import React from 'react';
import { Card, Form, Input, Select, InputNumber, DatePicker } from 'antd';
import MoneyInput from './MoneyInput';
import { USAStates } from './USAStates';

const { Option } = Select;
const { RangePicker } = DatePicker;

class AntdFormCore extends React.Component {
  componentDidMount() {
    const { form, fields } = this.props;
    const vals = {};
    _.each(fields, x => {
      vals[x.Column] = x.DefaultValue;
    });
    form.setFieldsValue(vals);
  }

  componentWillReceiveProps() {
    // TODO what if form, fields props changed?
  }

  render() {
    const { form, sections, fields } = this.props;
    const { getFieldDecorator } = form;
    return sections.map(x => {
      const localFields = _.filter(fields, y => x.Id === y.SectionId);
      return (
        <Card
          key={x.Id}
          title={x.Title}
          className="card"
          bordered={false}
          style={{ marginBottom: 24 }}
        >
          {localFields.map(y => {
            switch (y.Type) {
              case 5:
                return (
                  <Form.Item key={y.Id} label={y.Label} help={y.Help}>
                    {getFieldDecorator(y.Column)(<Input placeholder={y.PlaceHolder} />)}
                  </Form.Item>
                );
              case 6:
                return (
                  <Form.Item key={y.Id} label={y.Label} help={y.Help}>
                    {getFieldDecorator(y.Column)(
                      <InputNumber
                        formatter={value =>
                          y.Formatter ? y.Formatter.replace('___', value) : value
                        }
                        style={{ width: '100%' }}
                      />
                    )}
                  </Form.Item>
                );
              case 10:
                return (
                  <Form.Item key={y.Id} label={y.Label} help={y.Help}>
                    {getFieldDecorator(y.Column)(
                      <Select
                        mode={y.Payload.Mode}
                        style={{ width: '100%' }}
                        tokenSeparators={y.Payload.TokenSeparators}
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
              case 102:
                return (
                  <Form.Item key={y.Id} label={y.Label} help={y.Help}>
                    {getFieldDecorator(y.Column)(
                      <RangePicker placeholder={y.PlaceHolder} style={{ width: '100%' }} />
                    )}
                  </Form.Item>
                );
              case 200:
                return (
                  <Form.Item key={y.Id} label={y.Label} help={y.Help}>
                    {getFieldDecorator(y.Column)(
                      <Input placeholder={y.PlaceHolder} style={{ display: 'none' }} />
                    )}
                  </Form.Item>
                );
              case 201:
                return (
                  <Form.Item key={y.Id} label={y.Label} help={y.Help}>
                    {getFieldDecorator(y.Column)(<MoneyInput style={{ width: '100%' }} />)}
                  </Form.Item>
                );
              default:
                throw new Error(
                  `FormCore: Unspported field type ${
                    y.Type
                  }. Pull Requests are welcome: https://github.com/pmq20/form_core_csharp/pulls`
                );
            }
          })}
        </Card>
      );
    });
  }
}

export default Form.create()(AntdFormCore);
