import _ from 'lodash';
import React from 'react';
import { Card, Col, Row } from 'antd';
import RenderField from './RenderField';
import InputStyle from './Constants/InputStyle';

class FormCoreForm extends React.Component {

  getDefaultExpiredAtType = () => {
    var defaultValue = this.props.data ? data["ExpiredAtType"] : _.find(this.props.fields, x => x.Column === "ExpiredAtType").DefaultValue;
    defaultValue = defaultValue || "fixed";
    return defaultValue;
  }

  state={
    expiredAtType:this.getDefaultExpiredAtType()
  }

  handleExpiredAtTypeChange = e => {
    this.setState({
      expiredAtType: e.target.value,
    });
    if (e.target.value === 'indefinite') {
      this.props.form.setFieldsValue({
        ExpiredAt: null,
      });
    }
  };

  render() {
    const { form, data, sections, fields, renderExtra, style } = this.props;
    const defaultValues = {};
    _.each(fields, x => {
      defaultValues[x.Column] = x.DefaultValue;
    });
    return sections.map(x => {
      const localFields = _.filter(fields, y => x.Id === y.SectionId);
      if (x.ParentId > 0) {
        _.forEach(_.filter(fields, y => x.ParentId === y.SectionId), y => {
          if (undefined === _.find(localFields, z => z.ParentId === y.Id)) {
            localFields.push(y);
          }
        });
      }
      const visibleFields = _.filter(localFields, f => f.InputStyle !== InputStyle.Hidden);
      localFields.sort((a, b) => a.Position - b.Position);
      let rowColContent = null;
      if (localFields.length === 1) {
        rowColContent = RenderField(localFields[0], form, data, {}, renderExtra, this.state, {handleExpiredAtTypeChange:(e) => {this.handleExpiredAtTypeChange(e)}});
      } else {
        rowColContent = (
          <Row gutter={16}>
            {localFields.map(y => (
              <Col lg={8} md={12} sm={24} key={y.Id} hidden={InputStyle.Hidden === y.InputStyle}>
                {RenderField(y, form, data, {}, renderExtra, this.state, {handleExpiredAtTypeChange:(e) => {this.handleExpiredAtTypeChange(e)}})}
              </Col>
            ))}
          </Row>
        );
      }
      return (
        <Card
          key={x.Id}
          title={x.Title}
          className="formcore_btm24"
          bordered={false}
          style={style}
          hidden={!(visibleFields && visibleFields.length > 0)}
        >
          {rowColContent}
        </Card>
      );
    });
  }
}

export default FormCoreForm;
