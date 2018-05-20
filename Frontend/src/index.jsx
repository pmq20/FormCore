import _ from 'lodash';
import React, { Fragment } from 'react';
import {
  Icon,
  Popover,
  Card,
  Form,
  Input,
  Select,
  InputNumber,
  DatePicker,
  Button,
  Col,
  Row,
} from 'antd';
import FooterToolbar from './FooterToolbar';
import MoneyInput from './MoneyInput';
import { USAStates } from './USAStates';

const { Option } = Select;
const { RangePicker } = DatePicker;

class AntdFormCore extends React.Component {
  state = {
    width: '100%',
    submitting: false,
  };

  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  resizeFooterToolbar = () => {
    const sider = document.querySelectorAll('.ant-layout-sider')[0];
    const width = `calc(100% - ${sider.style.width})`;
    if (this.state.width !== width) {
      this.setState({ width });
    }
  };

  render() {
    const { form, sections, fields, onSubmit } = this.props;
    const { submitting } = this.state;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const defaultValues = {};
    const fieldLabels = {};
    _.each(fields, x => {
      defaultValues[x.Column] = x.DefaultValue;
    });
    const validate = () => {
      this.setState({ submitting: true });
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          onSubmit(values, () => {
            this.setState({ submitting: false });
          });
        }
      });
    };
    const errors = getFieldsError();
    const getErrorInfo = () => {
      const errorCount = Object.keys(errors).filter(key => errors[key]).length;
      if (!errors || errorCount === 0) {
        return null;
      }
      const scrollToField = fieldKey => {
        const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
        if (labelNode) {
          labelNode.scrollIntoView(true);
        }
      };
      const errorList = Object.keys(errors).map(key => {
        if (!errors[key]) {
          return null;
        }
        return (
          <li key={key} className="formcore_errorListItem" onClick={() => scrollToField(key)}>
            <Icon type="cross-circle-o" className="formcore_errorIcon" />
            <div className="formcore_errorMessage">{errors[key][0]}</div>
            <div className="formcore_errorField">{fieldLabels[key]}</div>
          </li>
        );
      });
      return (
        <span className="formcore_errorIcon">
          <Popover
            title="表单校验信息"
            content={errorList}
            overlayClassName="formcore_errorPopover"
            trigger="click"
            getPopupContainer={trigger => trigger.parentNode}
          >
            <Icon type="exclamation-circle" />
          </Popover>
          {errorCount}
        </span>
      );
    };
    const ret = sections.map(x => {
      const localFields = _.filter(fields, y => x.Id === y.SectionId);
      return (
        <Card
          key={x.Id}
          title={x.Title}
          className="card"
          bordered={false}
          style={{ marginBottom: 24 }}
        >
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              {localFields.map(y => {
                switch (y.Type) {
                  case 5:
                    return (
                      <Col lg={8} md={12} sm={24} key={y.Id}>
                        <Form.Item label={y.Label} help={y.Help}>
                          {getFieldDecorator(y.Column, {
                            initialValue: defaultValues[y.Column],
                          })(<Input placeholder={y.PlaceHolder} />)}
                        </Form.Item>
                      </Col>
                    );
                  case 6:
                    return (
                      <Col lg={8} md={12} sm={24} key={y.Id}>
                        <Form.Item label={y.Label} help={y.Help}>
                          {getFieldDecorator(y.Column, {
                            initialValue: defaultValues[y.Column],
                          })(
                            <InputNumber
                              formatter={value =>
                                y.Formatter ? y.Formatter.replace('___', value) : value
                              }
                              style={{ width: '100%' }}
                            />
                          )}
                        </Form.Item>
                      </Col>
                    );
                  case 10:
                    return (
                      <Col lg={8} md={12} sm={24} key={y.Id}>
                        <Form.Item label={y.Label} help={y.Help}>
                          {getFieldDecorator(y.Column, {
                            initialValue: defaultValues[y.Column],
                          })(
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
                      </Col>
                    );
                  case 102:
                    return (
                      <Col lg={8} md={12} sm={24} key={y.Id}>
                        <Form.Item label={y.Label} help={y.Help}>
                          {getFieldDecorator(y.Column, {
                            initialValue: defaultValues[y.Column],
                          })(<RangePicker placeholder={y.PlaceHolder} style={{ width: '100%' }} />)}
                        </Form.Item>
                      </Col>
                    );
                  case 200:
                    return (
                      <Col lg={8} md={12} sm={24} key={y.Id}>
                        <Form.Item label={y.Label} help={y.Help}>
                          {getFieldDecorator(y.Column, {
                            initialValue: defaultValues[y.Column],
                          })(<Input placeholder={y.PlaceHolder} style={{ display: 'none' }} />)}
                        </Form.Item>
                      </Col>
                    );
                  case 201:
                    return (
                      <Col lg={8} md={12} sm={24} key={y.Id}>
                        <Form.Item label={y.Label} help={y.Help}>
                          {getFieldDecorator(y.Column, {
                            initialValue: defaultValues[y.Column],
                          })(<MoneyInput style={{ width: '100%' }} />)}
                        </Form.Item>
                      </Col>
                    );
                  default:
                    throw new Error(
                      `FormCore: Unspported field type ${
                        y.Type
                      }. Pull Requests are welcome: https://github.com/pmq20/form_core_csharp/pulls`
                    );
                }
              })}
            </Row>
          </Form>
        </Card>
      );
    });
    return (
      <Fragment>
        {ret}
        <FooterToolbar style={{ width: this.state.width }}>
          {getErrorInfo()}
          <Button type="primary" onClick={validate} loading={submitting}>
            Submit
          </Button>
        </FooterToolbar>
      </Fragment>
    );
  }
}

export default Form.create()(AntdFormCore);
