import _ from 'lodash';
import React, { Fragment } from 'react';
import { Icon, Popover, Card, Form, Button, Col, Row } from 'antd';
import RenderField from './RenderField';
import InputStyle from './Constants/InputStyle';
import FooterToolbar from './FooterToolbar';

function IsFieldHidden(y) {
  switch (y.InputStyle) {
    case InputStyle.Hidden:
      return true;
    default:
      return false;
  }
}

class AntdFormCoreForm extends React.Component {
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
    const { form, sections, fields, onSubmit, renderExtra, skipValidate } = this.props;
    const { submitting } = this.state;
    const { validateFieldsAndScroll, getFieldsError } = form;
    const defaultValues = {};
    const fieldLabels = {};
    _.each(fields, x => {
      defaultValues[x.Column] = x.DefaultValue;
    });
    const validate = () => {
      this.setState({ submitting: true });
      validateFieldsAndScroll((error, values) => {
        if (!error || skipValidate) {
          onSubmit(values, () => {
            this.setState({ submitting: false });
          });
        } else {
          this.setState({ submitting: false });
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
      if (x.ParentId > 0) {
        _.forEach(_.filter(fields, y => x.ParentId === y.SectionId), y => {
          if (undefined === _.find(localFields, z => z.ParentId === y.Id)) {
            localFields.push(y);
          }
        });
      }
      localFields.sort((a, b) => a.Position - b.Position);
      let rowColContent = null;
      if (localFields.length === 1) {
        rowColContent = RenderField(localFields[0], form, {}, renderExtra);
      } else {
        rowColContent = (
          <Row gutter={16}>
            {localFields.map(y => (
              <Col lg={8} md={12} sm={24} key={y.Id} hidden={IsFieldHidden(y)}>
                {RenderField(y, form, {}, renderExtra)}
              </Col>
            ))}
          </Row>
        );
      }
      return (
        <Card
          key={x.Id}
          title={x.Title}
          className="card"
          bordered={false}
          style={{ marginBottom: 24 }}
        >
          <Form layout="vertical" hideRequiredMark>
            {rowColContent}
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

const FormCoreForm = Form.create({
  onValuesChange(props, changedValues, allValues) {
    const { onValuesChange = () => {} } = props;
    onValuesChange(changedValues, allValues);
  },
  onFieldsChange(props, changedFields) {
    const { onFieldsChange = () => {} } = props;
    onFieldsChange(changedFields);
  },
})(AntdFormCoreForm);

export default FormCoreForm;
