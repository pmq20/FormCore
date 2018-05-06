import React from 'react';
import { Form, Input, Button, Card, InputNumber, Select, message } from 'antd';
import Api from 'Api';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
export default class FormsFieldsNew extends React.Component {
  state = {
    loading: true,
    sections: [],
  };

  componentDidMount() {
    this.loadSections(this.props);
    this.props.form.setFieldsValue({
      Position: 0,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.id !== this.props.match.params.id) {
      this.loadSections(nextProps);
    }
  }

  componentWillUnmount() {
    this.api.cancel();
  }

  loadSections(props) {
    this.setState({ loading: true });
    this.api.get(`/${props.match.params.id}/sections`, {}, data => {
      this.setState({ loading: false, sections: data });
    });
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
    const { loading, sections } = this.state;

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
      <Card title="New Field" style={{ marginBottom: 24 }} loading={loading}>
        <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
          <FormItem {...formItemLayout} label="Section">
            {getFieldDecorator('SectionID', {
              rules: [
                {
                  required: true,
                  message: 'Please select a section for this field',
                },
              ],
            })(
              <Select>
                {sections.map(x => (
                  <Option key={x.ID} value={x.ID}>
                    {x.Title}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="Name">
            {getFieldDecorator('Name', {
              rules: [
                {
                  required: true,
                  message: 'Please enter name of the field',
                },
              ],
            })(<Input placeholder="Enter name of the field" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="Type">
            {getFieldDecorator('Type', {
              rules: [
                {
                  required: true,
                  message: 'Please select the type of the field',
                },
              ],
            })(
              <Select>
                <Option key="1" value="1">
                  Input
                </Option>
                <Option key="2" value="2">
                  Text Area
                </Option>
              </Select>
            )}
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
