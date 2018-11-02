import _ from 'lodash';
import React from 'react';
import { Card, Col, Row } from 'antd';
import RenderField from './RenderField';
import InputStyle from './Constants/InputStyle';

function IsFieldHidden(y) {
  switch (y.InputStyle) {
    case InputStyle.Hidden:
      return true;
    default:
      return false;
  }
}

class FormCoreForm extends React.Component {
  render() {
    const { form, sections, fields, renderExtra, needCardMarginBottom = true } = this.props;
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
          className="formcore_card"
          bordered={false}
          style={{ marginBottom: needCardMarginBottom ? 24 : 'unset' }}
          hidden={!(visibleFields && visibleFields.length > 0)}
        >
          {rowColContent}
        </Card>
      );
    });
  }
}

export default FormCoreForm;
