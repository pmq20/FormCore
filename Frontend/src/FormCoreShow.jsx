import _ from 'lodash';
import React from 'react';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import ShowField from './ShowField';
import InputStyle from './Constants/InputStyle';

class FormCoreShow extends React.Component {
  render() {
    const { data, sections, fields, showExtra, style } = this.props;
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
      const content = _.filter(localFields.map(y => ShowField(y, data, {}, showExtra)), y => !!y);
      return content.length > 0 ? (
        <DescriptionList
          key={x.Id}
          className="formcore_btm24"
          title={x.Title}
          style={style}
          hidden={!(visibleFields && visibleFields.length > 0)}
        >
          { content }
        </DescriptionList>
      ) : null;
    });
  }
}

export default FormCoreShow;
