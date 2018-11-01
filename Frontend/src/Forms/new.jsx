import React, { PureComponent } from 'react';
import { Form, Input, Select, Card, Icon, Tooltip, Button } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
class FormCoreFormsNew extends PureComponent {
  state = {
    loading: true,
    parents: [],
    parentId: null,
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
    this.setState({
      loading: true,
    });
    this.props.fetchParents(
      data => {
        this.setState({
          loading: false,
          parents: data,
        });
      }
    );
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.clearAjaxError(values);
        const h = {
          ...values,
        };
        if (h.ParentId) {
          h.ParentIds = [h.ParentId];
        } else {
          h.ParentIds = [];
        }
        delete h.ProductId;
				this.props.submit(h);
      }
    });
  };

  clearAjaxError = origValues => {
    const fields = {
      Title: { value: origValues.Name, errors: null },
    };
    fields.ParentId = { value: origValues.ParentId, errors: null };
    this.props.form.setFields(fields);
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading, parents, parentId } = this.state;

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

    let parent = null;
    if (parentId && parentId > 0) {
      parent = parents.find(x => x.Id === parentId);
    }

    return (
      <Card bordered={false} loading={loading} title="New Product Offer">
        <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
          <FormItem
            {...formItemLayout}
            help={this.props.parentsHelp}
            label={
              <span>
                Based on&nbsp;
                <em className="formcore_optional">
                  <Tooltip title="The existing components and sections of the base will be referenced and never need to be created again.">
                    <Icon type="info-circle-o" style={{ marginRight: 4 }} />
                  </Tooltip>
                </em>
              </span>
            }
          >
            {getFieldDecorator('ParentId', {
              rules: [{ required: true, message: 'Please select an existing product offer' }],
            })(
              <Select
                showSearch
                onChange={x => this.setState({ parentId: x })}
                placeholder="Select an existing product offer"
              >
                {parents.map(x => (
                  <Option key={x.Id} value={x.Id}>
                    {x.Title}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
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
              initialValue: parent ? parent.Title : null,
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

export default FormCoreFormsNew;
