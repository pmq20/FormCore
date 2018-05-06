import React from 'react';
import { Form, Input, Button, Card, InputNumber, message } from 'antd';
import Api from 'Api';

const FormItem = Form.Item;

@Form.create()
export default class FormsFieldsNew extends React.Component {
  state = {};

  componentDidMount() {
    this.props.form.setFieldsValue({
      Position: 0,
    });
  }

  componentWillUnmount() {
    this.api.cancel();
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.api.submitPost(this, `/${this.props.match.params.id}/fields`, values, data => {
          message.success(`The field has been successfully created!`);
          window.AppInstance.reloadForms();
          window.AppInstance.redirectTo(`/${this.props.match.params.id}/fields/${data}`);
        });
      }
    });
  };

  api = new Api();

  render() {
    const { submitting } = this.props;
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    return (
      <Card title="New Field" style={{ marginBottom: 24 }}>
        <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
          <FormItem {...formItemLayout} label="Field Name">
            {getFieldDecorator('Name', {
              rules: [
                {
                  required: true,
                  message: 'Please enter name of the field',
                },
              ],
            })(<Input placeholder="Enter name of the field" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="Position">
            {getFieldDecorator('Position', {
              rules: [
                {
                  required: true,
                  message: 'Please enter field position number',
                },
              ],
            })(<InputNumber min={0} max={999} style={{ width: '100%' }} />)}
          </FormItem>
          <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
            <Button type="primary" htmlType="submit" loading={submitting}>
              Submit
            </Button>
          </FormItem>
        </Form>
      </Card>
    );
  }
}
