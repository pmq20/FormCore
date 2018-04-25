import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import Api from 'Api';

const FormItem = Form.Item;

@Form.create()
export default class FormsNew extends React.Component {
  state = {};

  componentWillUnmount() {
    this.api.cancel();
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.api.submitPost(this, '/forms', values, data => {
          message.success(`The form has been successfully created!`);
          window.AppInstance.reloadForms();
          window.AppInstance.redirectTo(`/forms/${data}`);
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
      <Card title="New Form" style={{ marginBottom: 24 }}>
        <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
          <FormItem {...formItemLayout} label="Form Title">
            {getFieldDecorator('Title', {
              rules: [
                {
                  required: true,
                  message: 'Please enter the form title',
                },
              ],
            })(<Input placeholder="Enter a form title" />)}
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
