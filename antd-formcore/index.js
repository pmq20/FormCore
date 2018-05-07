import React from 'react';
import { Card, Form, Input } from 'antd';
import styles from './style.less';

const { TextArea } = Input;

@Form.create()
export default class AntdFormCore extends React.Component {
  render() {
    const { form, sections, fields } = this.props;
    const { getFieldDecorator } = form;
    return sections.map(x => {
      const localFields = fields.filter(y => x.ID === y.SectionID);
      return (
        <Card title={x.Title} className={styles.card} bordered={false}>
          {localFields.map(y => {
            switch (y.Type) {
              case 1:
                return (
                  <Form.Item label={y.Label} help={y.Help}>
                    {getFieldDecorator(y.Name, {
                      rules: [{ required: y.Required, message: y.RequiredMessage }],
                    })(<Input placeholder={y.PlaceHolder} />)}
                  </Form.Item>
                );
              case 2:
                return (
                  <Form.Item label={y.Label} help={y.Help}>
                    {getFieldDecorator(y.Name, {
                      rules: [{ required: y.Required, message: y.RequiredMessage }],
                    })(<TextArea placeholder={y.PlaceHolder} rows={y.Rows} />)}
                  </Form.Item>
                );
              default:
                throw new Error(`Bad Type ${y.Type}`);
            }
          })}
        </Card>
      );
    });
  }
}
