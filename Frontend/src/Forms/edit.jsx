import React, { PureComponent } from 'react';
import { Form, Button, Input, Card } from 'antd';

const FormItem = Form.Item;

class InnerFormCoreFormsEdit extends PureComponent {
  state = {
    loading: true,
    entity: {},
  };

  componentDidMount() {
    this.fetch();
  }

  componentWillReceiveProps(nextProps) {
    const { location } = nextProps;
    const { location: rawLocation } = this.props;

    if (location.pathname !== rawLocation.pathname) {
      this.fetch();
    }
  }

  fetch = () => {
    this.setState({ loading: true });

    this.props.fetch(entity => {
      const newEntity = Object.assign({ ParentId: entity.ParentIds[0] }, entity);
      this.setState({ loading: false, entity: newEntity });
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.clearAjaxError(values);
        const newValues = Object.assign({ ParentIds: [values.ParentId] }, values);
        this.props.submit(newValues);
      }
    });
  };

  clearAjaxError = origValues => {
    const fields = {
      Title: { value: origValues.Name, errors: null },
    };
    fields.ParentId = { value: origValues.Name, errors: null };
    this.props.form.setFields(fields);
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading, entity } = this.state;

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
      <Card bordered={false} loading={loading} title={entity.Title ? entity.Title : null}>
        <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
          <FormItem
            {...formItemLayout}
            label={
              <span>
                Title
                <em className="formcore_optional"> (Optional)</em>
              </span>
            }
          >
            {getFieldDecorator('Title', {
              rules: [
                { required: true, message: 'Please enter the title of the new product offer' },
              ],
              initialValue: entity.Title,
            })(<Input placeholder="Title of the new product offer" />)}
          </FormItem>
          <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
            <Button type="primary">Submit</Button>
						{ this.props.cancelButton }
          </FormItem>
        </Form>
      </Card>
    );
  }
}

const FormCoreFormsEdit = Form.create()(InnerFormCoreFormsEdit);
export default FormCoreFormsEdit;
