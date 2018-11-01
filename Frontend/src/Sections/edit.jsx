import React, { PureComponent } from 'react';
import { Select, Icon, Form, Input, Button, Card, InputNumber, Tooltip } from 'antd';

const FormItem = Form.Item;

class InnerFormCoreSectionsEdit extends PureComponent {
  state = {
    loading: true,
    form: {},
    parents: [],
  };

  componentDidMount() {
    this.fetch(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const { location } = nextProps;
    const { location: rawLocation } = this.props;

    if (location.pathname !== rawLocation.pathname) {
      this.fetch(nextProps);
    }
  }

  fetch = props => {
    this.setState({
      loading: true,
    });
    props.fetch(data0 => {
      this.setState({
        form: data0,
      });
      if (data0.Parents.length > 0) {
        data0.Parents.forEach(form0 => {
          props.fetchSpecific(form0.Id, data1 => {
            this.setState(prevState => {
              const oldParents = prevState.parents || [];
              return {
                parents: oldParents.concat(data1.Sections),
                loading: false,
              };
            });
          });
        });
      } else {
        this.setState({
          loading: false,
        });
      }
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.submit(values);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading, form, parents } = this.state;
    const entity =
      form && form.Sections
        ? form.Sections.find(x => `${x.Id}` === this.props.sectionId)
        : {};

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
      <Card
        className="formcore-card-button-fix"
        bordered={false}
        loading={loading}
        title={entity.Title ? `Section: ${entity.Title}` : 'Section'}
      >
        <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
          {form && form.Parents && form.Parents.length > 0 ? (
            <FormItem
              {...formItemLayout}
              help={<span>{this.props.providedBy(form)}</span>}
              label={
                <span>
                  Copy and Modify
                  <em className="formcore_optional"> (Optional)</em>
                  &nbsp;
                  <em className="formcore_optional">
                    <Tooltip title="Select a section if you intend to copy and modify an existing section; otherwise leave it blank.">
                      <Icon type="info-circle-o" style={{ marginRight: 4 }} />
                    </Tooltip>
                  </em>
                </span>
              }
            >
              {getFieldDecorator('ParentId', {
                initialValue: entity.ParentId > 0 ? entity.ParentId : null,
              })(
                <Select
                  allowClear
                  showSearch
                  placeholder="Select an existing section or leave it blank"
                >
                  {parents.map(x => (
                    <Select.Option key={x.Id} value={x.Id}>
                      {x.Title}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </FormItem>
          ) : null}
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
              initialValue: entity.Title,
            })(<Input placeholder="Title of the section" />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="Position"
            help="The higher the number is, the lower on the page will the section be displayed."
          >
            {getFieldDecorator('Position', {
              rules: [
                {
                  required: true,
                  message: 'Please enter the position of the section',
                },
              ],
              initialValue: entity.Position,
            })(<InputNumber style={{ width: '100%' }} />)}
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

const FormCoreSectionsEdit = Form.create()(InnerFormCoreSectionsEdit);
export default FormCoreSectionsEdit;
