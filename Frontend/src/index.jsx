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
import { FieldType } from './Constants';

const { Option } = Select;
const { RangePicker } = DatePicker;

function IsFieldHidden(y) {
  switch (y.Type) {
    case FieldType.Hidden:
      return true;
    default:
      return false;
  }
}

export function RenderField(y, getFieldDecorator) {
  switch (y.Type) {
    case FieldType.Input:
      return (
        <Form.Item key={y.Id} label={y.Label} help={y.Help}>
          {getFieldDecorator(y.Column, {
            initialValue: y.DefaultValue,
          })(<Input placeholder={y.PlaceHolder} />)}
        </Form.Item>
      );
    case FieldType.InputNumber:
      return (
        <Form.Item key={y.Id} label={y.Label} help={y.Help}>
          {getFieldDecorator(y.Column, {
            initialValue: y.DefaultValue,
          })(
            <InputNumber
              formatter={value => (y.Formatter ? y.Formatter.replace('___', value) : value)}
              style={{ width: '100%' }}
            />
          )}
        </Form.Item>
      );
    case FieldType.Select:
      return (
        <Form.Item key={y.Id} label={y.Label} help={y.Help}>
          {getFieldDecorator(y.Column, {
            initialValue: y.DefaultValue,
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
      );
    case FieldType.RangePicker:
      return (
        <Form.Item key={y.Id} label={y.Label} help={y.Help}>
          {getFieldDecorator(y.Column, {
            initialValue: y.DefaultValue,
          })(<RangePicker placeholder={y.PlaceHolder} style={{ width: '100%' }} />)}
        </Form.Item>
      );
    case FieldType.Hidden:
      return (
        <Form.Item key={y.Id} label={y.Label} help={y.Help}>
          {getFieldDecorator(y.Column, {
            initialValue: y.DefaultValue,
          })(<Input placeholder={y.PlaceHolder} style={{ display: 'none' }} />)}
        </Form.Item>
      );
    case FieldType.MoneyInput:
      return (
        <Form.Item key={y.Id} label={y.Label} help={y.Help}>
          {getFieldDecorator(y.Column, {
            initialValue: y.DefaultValue,
          })(<MoneyInput style={{ width: '100%' }} />)}
        </Form.Item>
      );
    default:
      throw new Error(
        `FormCore: Unspported field type ${
          y.Type
        }. Pull Requests are welcome: https://github.com/pmq20/form_core_csharp/pulls`
      );
  }
}

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
    const { form, sections, fields, onSubmit, renderExtra } = this.props;
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
              {localFields.map(y => (
                <Col lg={8} md={12} sm={24} key={y.Id} hidden={IsFieldHidden(y)}>
                  {RenderField(y, getFieldDecorator)}
                </Col>
              ))}
            </Row>
          </Form>
        </Card>
      );
    });
    return (
      <Fragment>
        {ret}
        {_.isFunction(renderExtra) ? renderExtra(this) : renderExtra}
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

export default Form.create({
  onValuesChange(props, changedValues, allValues) {
    const { onValuesChange = () => {}} = props;
    onValuesChange(changedValues, allValues);
  },
  onFieldsChange(props, changedFields) {
    const { onFieldsChange = () => {}} = props;
    onFieldsChange(changedFields);
  },
})(AntdFormCore);
