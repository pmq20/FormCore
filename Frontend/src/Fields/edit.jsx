import _ from 'lodash';
import moment from 'moment';
import React, { PureComponent, Fragment } from 'react';
import {
  DatePicker,
  Select,
  Radio,
  Icon,
  Form,
  Input,
  Button,
  Modal,
  Card,
  InputNumber,
  Tooltip,
  Table,
} from 'antd';
import FieldType from '../Constants/FieldType';
import OptionType from '../Constants/OptionType';
import InputStyle from '../Constants/InputStyle';
import MoneyInput from '../MoneyInput';

const FormItem = Form.Item;
const { Option } = Select;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const InputGroup = Input.Group;
const DefaultOptionType = OptionType.Custom;

class InnerFormCoreFieldsEdit extends PureComponent {
  state = {
    loading: true,
    form: {},
    parents: [],
    entity: {},
    inputStyle: null,
    fieldType: null,
    inputSelectOptions: [],
    selectOptions: [],
    selectOptionEditing: false,
    selectOptionVisible: false,
    selectOptionRecord: null,
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
      let entity = data0.Fields.find(x => `${x.Id}` === props.fieldId);
      if (entity.Payload) {
        entity = {
          ...entity,
          ...entity.Payload,
        };
      }
      this.setState({
        form: data0,
        inputStyle: entity.InputStyle,
        fieldType: entity.FieldType,
        inputSelectOptions: this.props.availableOptions(entity.Column.split('__FORMCORE__')),
        entity,
      });
      if (entity.Options && _.isArray(entity.Options)) {
        this.setState({
          selectOptions: _.map(entity.Options, (option, i) => Object.assign({ ID: i }, option)),
        });
      }
      if (data0.Parents.length > 0) {
        data0.Parents.forEach(form0 => {
          this.props.fetchSpecific(form0.Id, data => {
            const section = data0.Sections.find(x => `${x.Id}` === this.props.sectionId);
            const formParent = data;
            let parents = [];
            if (section.ParentId > 0) {
              parents = _.filter(formParent.Fields, y => section.ParentId === y.SectionId);
            }
            this.setState(prevState => {
              const oldParents = prevState.parents || [];
              return {
                loading: false,
                parents: oldParents.concat(parents),
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
    const { selectOptions } = this.state;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const data = {
          ...values,
        };
        delete data.ModalOptionType;
        delete data.ModalValue;
        delete data.ModalDisplay;
        if (data.Column && Array.isArray(data.Column) && data.Column.length === 1) {
          [data.Column] = data.Column;
        }
        if (InputStyle.RangePicker === data.InputStyle) {
          data.DefaultValue = [data.DefaultValue0, data.DefaultValue1];
          data.PlaceHolder = [data.PlaceHolder0, data.PlaceHolder1];
          delete data.DefaultValue0;
          delete data.DefaultValue1;
          delete data.PlaceHolder0;
          delete data.PlaceHolder1;
        }
        if (InputStyle.InputNumber === data.InputStyle) {
          data.Payload = {
            Prefix: data.Prefix,
            Suffix: data.Suffix,
          };
          delete data.Prefix;
          delete data.Suffix;
        }
        if (InputStyle.Select === data.InputStyle) {
          data.Payload = {
            Mode: data.Mode,
            TokenSeparators: [','],
            Options: selectOptions,
          };
        }
        if (this.props.handleSubmit) {
          this.props.handleSubmit(data, selectOptions);
        }
        this.props.submit(data);
      }
    });
  };

  handleOptionOk = () => {
    this.setState(prevState => {
      const { selectOptionEditing, selectOptionRecord, selectOptions, entity } = prevState;
      const newSelectOptions = _.clone(selectOptions);
      let recordValue = null;
      if (selectOptionEditing) {
        const record = newSelectOptions.find(x => x.ID === selectOptionRecord.ID);
        record.Display = this.props.form.getFieldValue('ModalDisplay');
        record.OptionType = this.props.form.getFieldValue('ModalOptionType');
        if (OptionType.Custom === record.OptionType) {
          recordValue = record.Display;
        } else {
          recordValue = this.props.form.getFieldValue('ModalValue');
        }
        record.Value = recordValue;
      } else {
        const maxID = _.max(_.map(selectOptions, o => o.ID)) || 0;
        recordValue = this.props.form.getFieldValue(
          OptionType.Custom === this.props.form.getFieldValue('ModalOptionType')
            ? 'ModalDisplay'
            : 'ModalValue'
        );
        newSelectOptions.push({
          ID: maxID + 1,
          Value: recordValue,
          Display: this.props.form.getFieldValue('ModalDisplay'),
          FieldType: this.props.form.getFieldValue('ModalOptionType'),
        });
      }
      this.props.form.setFieldsValue({
        ModalOptionType: DefaultOptionType,
        ModalValue: null,
        ModalDisplay: null,
      });

      if (this.props.handleOptionOk) {
        this.props.handleOptionOk(entity, recordValue, this.props.form.getFieldValue);
      }

      return {
        entity,
        selectOptions: newSelectOptions,
        selectOptionRecord: {},
        selectOptionEditing: false,
        selectOptionVisible: false,
      };
    });
  };

  handleOptionCancel = () => {
    this.setState({
      selectOptionRecord: {},
      selectOptionEditing: false,
      selectOptionVisible: false,
    });
    this.props.form.setFieldsValue({
      ModalOptionType: DefaultOptionType,
      ModalValue: null,
      ModalDisplay: null,
    });
  };

  handleDeleteOption = option => {
    const { ID } = option;
    this.setState(prevState => {
      const { selectOptions } = prevState;
      const newSelectOptions = _.clone(selectOptions);
      _.remove(newSelectOptions, o => o.ID === ID);
      return {
        selectOptions: newSelectOptions,
      };
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      loading,
      form,
      parents,
      entity,
      inputStyle,
      fieldType,
      inputSelectOptions,
    } = this.state;

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

    const formItemLayoutModal = {
      labelCol: {
        xs: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 18 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    const inputDefaultValue = (
      <FormItem
        {...formItemLayout}
        label={
          <span>
            Default Value
            <em className="formcore_optional"> (Optional)</em>
          </span>
        }
      >
        {getFieldDecorator('DefaultValue', {
          initialValue: entity.DefaultValue,
        })(<Input placeholder="Default value of the field" />)}
      </FormItem>
    );

    const inputPlaceholder = (
      <FormItem
        {...formItemLayout}
        label={
          <span>
            Placeholder
            <em className="formcore_optional"> (Optional)</em>
          </span>
        }
      >
        {getFieldDecorator('PlaceHolder', {
          initialValue: entity.PlaceHolder,
        })(<Input placeholder="Text displayed when the field is blank" />)}
      </FormItem>
    );

    const rangeDefaultValue = (
      <FormItem
        {...formItemLayout}
        label={
          <span>
            Default Value
            <em className="formcore_optional"> (Optional)</em>
          </span>
        }
        style={{ margin: 0 }}
      >
        <InputGroup compact>
          <FormItem style={{ width: 'calc(50% - 15px)' }}>
            {getFieldDecorator('DefaultValue0', {
              initialValue:
                entity.DefaultValue && Array.isArray(entity.DefaultValue) && entity.DefaultValue[0]
                  ? moment(entity.DefaultValue[0])
                  : null,
            })(<DatePicker className="formcore_range" placeholder="Left" />)}
          </FormItem>
          <Input
            style={{
              width: 30,
              pointerEvents: 'none',
              backgroundColor: '#fff',
              position: 'relative',
              top: 4,
              border: 0,
            }}
            placeholder="~"
            disabled
          />
          <FormItem style={{ width: 'calc(50% - 15px)' }}>
            {getFieldDecorator('DefaultValue1', {
              initialValue:
                entity.DefaultValue && Array.isArray(entity.DefaultValue) && entity.DefaultValue[1]
                  ? moment(entity.DefaultValue[1])
                  : null,
            })(<DatePicker className="formcore_range" placeholder="Right" />)}
          </FormItem>
        </InputGroup>
      </FormItem>
    );

    const rangePlaceholder = (
      <FormItem
        {...formItemLayout}
        label={
          <span>
            Placeholder
            <em className="formcore_optional"> (Optional)</em>
          </span>
        }
        style={{ margin: 0 }}
      >
        <InputGroup compact>
          <FormItem style={{ width: 'calc(50% - 15px)' }}>
            {getFieldDecorator('PlaceHolder0', {
              initialValue:
                entity.PlaceHolder && Array.isArray(entity.PlaceHolder)
                  ? entity.PlaceHolder[0]
                  : null,
            })(<Input className="formcore_range" placeholder="Left" />)}
          </FormItem>
          <Input
            style={{
              width: 30,
              pointerEvents: 'none',
              backgroundColor: '#fff',
              position: 'relative',
              top: 4,
              border: 0,
            }}
            placeholder="~"
            disabled
          />
          <FormItem style={{ width: 'calc(50% - 15px)' }}>
            {getFieldDecorator('PlaceHolder1', {
              initialValue:
                entity.PlaceHolder && Array.isArray(entity.PlaceHolder)
                  ? entity.PlaceHolder[1]
                  : null,
            })(<Input className="formcore_range" placeholder="Right" />)}
          </FormItem>
        </InputGroup>
      </FormItem>
    );

    const moneyDefaultValue = (
      <FormItem
        {...formItemLayout}
        label={
          <span>
            Default Value
            <em className="formcore_optional"> (Optional)</em>
          </span>
        }
      >
        {getFieldDecorator('DefaultValue', {
          initialValue: entity.DefaultValue,
        })(<MoneyInput />)}
      </FormItem>
    );

    const selectDefaultValue = (
      <FormItem
        {...formItemLayout}
        label={
          <span>
            Default Value
            <em className="formcore_optional"> (Optional)</em>
          </span>
        }
      >
        {getFieldDecorator('DefaultValue', {
          initialValue: entity.DefaultValue,
        })(
          <Select mode={entity.Mode} tokenSeparators={entity.TokenSeparators}>
            {_.map(this.state.selectOptions || entity.Options || [], option => (
              <Option key={option.Value} value={option.Value}>
                {option.Display}
              </Option>
            ))}
          </Select>
        )}
      </FormItem>
    );

    const numberDefaultValue = (
      <FormItem
        {...formItemLayout}
        label={
          <span>
            Default Value
            <em className="formcore_optional"> (Optional)</em>
          </span>
        }
      >
        {getFieldDecorator('DefaultValue', {
          initialValue: entity.DefaultValue,
        })(<InputNumber />)}
      </FormItem>
    );

    const inputNumberPrefix = (
      <FormItem
        {...formItemLayout}
        label={
          <span>
            Prefix
            <em className="formcore_optional"> (Optional)</em>
          </span>
        }
      >
        {getFieldDecorator('Prefix', {
          initialValue: entity.Prefix,
        })(<Input placeholder="Text displayed before the number" />)}
      </FormItem>
    );

    const inputSelectMode = (
      <FormItem {...formItemLayout} label="Mode">
        {getFieldDecorator('Mode', {
          initialValue: entity.Mode,
        })(
          <Select
            placeholder="Pick a select input box style"
            onChange={x => {
              if (entity) {
                entity.Mode = x;
              }
            }}
          >
            <Option key="" value="">
              Dropdown
            </Option>
            <Option key="tags" value="tags">
              Tags
            </Option>
            <Option key="multiple" value="multiple">
              Multiple
            </Option>
            <Option key="combobox" value="combobox">
              Combo-box
            </Option>
          </Select>
        )}
      </FormItem>
    );

    const inputSelectValues = (
      <Fragment>
        <FormItem {...formItemLayout} label="Options">
          <Table
            scrollWidth={350}
            style={{ maxHeight: 300, overflowY: 'auto' }}
            size="small"
            rowKey="ID"
            columns={[
              {
                title: 'Option',
                dataIndex: 'Display',
                key: 'Display',
                width: 'calc(100% - 80px)',
                render: text => text,
              },
              {
                title: (
                  <Button
                    type="primary"
                    icon="plus"
                    style={{ float: 'right' }}
                    onClick={() => {
                      this.setState({
                        selectOptionRecord: {
                          OptionType: DefaultOptionType,
                        },
                        selectOptionEditing: false,
                        selectOptionVisible: true,
                      });
                    }}
                  />
                ),
                dataIndex: '',
                key: 'ID',
                width: 80,
                render: (text, record) => (
                  <Button
                    icon="edit"
                    onClick={() => {
                      this.props.form.setFieldsValue({
                        ModalOptionType: record.OptionType,
                        ModalValue: record.Value,
                        ModalDisplay: record.Display,
                      });
                      this.setState({
                        selectOptionRecord: record,
                        selectOptionEditing: true,
                        selectOptionVisible: true,
                      });
                    }}
                  />
                ),
              },
            ]}
            dataSource={this.state.selectOptions}
            pagination={false}
          />
        </FormItem>
        <Modal
          title={
            this.state.selectOptionEditing
              ? `Edit: ${this.state.selectOptionRecord.Display}`
              : 'New Option'
          }
          visible={this.state.selectOptionVisible}
          onOk={this.handleOptionOk}
          onCancel={this.handleOptionCancel}
        >
          <FormItem {...formItemLayoutModal} label="Option Type">
            {getFieldDecorator('ModalOptionType', {
              initialValue: this.state.selectOptionEditing
                ? this.state.selectOptionRecord.OptionType
                : DefaultOptionType,
            })(
              <RadioGroup
                onChange={e => {
                  if (this.state.selectOptionRecord) {
                    this.setState(st => ({
                      selectOptionRecord: {
                        ...st.selectOptionRecord,
                        OptionType: e.target.value,
                      },
                    }));
                  } else {
                    this.setState({
                      selectOptionRecord: {
                        OptionType: e.target.value,
                      },
                    });
                  }
                  return true;
                }}
              >
                <Fragment>
                  <RadioButton value={OptionType.BuiltIn}>Built-in</RadioButton>
                  <RadioButton value={OptionType.Custom}>Custom</RadioButton>
                </Fragment>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem
            {...formItemLayoutModal}
            label="Built-in Option"
            style={{
              display:
                this.state.selectOptionRecord &&
                OptionType.BuiltIn === this.state.selectOptionRecord.OptionType
                  ? 'block'
                  : 'none',
            }}
          >
            {getFieldDecorator('ModalValue', {
              initialValue: this.state.selectOptionRecord
                ? this.state.selectOptionRecord.Value
                : null,
            })(
              <Select
                style={{ width: '100%' }}
                placeholder="Select a built-in option"
                onChange={x => {
                  this.props.form.setFieldsValue({
                    ModalDisplay: inputSelectOptions[x],
                  });
                  if (this.state.selectOptionRecord) {
                    this.setState(st => ({
                      selectOptionRecord: {
                        ...st.selectOptionRecord,
                        Value: x,
                        Display: inputSelectOptions[x],
                      },
                    }));
                  } else {
                    this.setState({
                      selectOptionRecord: {
                        Value: x,
                        Display: inputSelectOptions[x],
                      },
                    });
                  }
                }}
              >
                {_.map(_.keys(inputSelectOptions), key => (
                  <Option key={key} value={key}>
                    {inputSelectOptions[key]}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayoutModal} label="Displayed As">
            {getFieldDecorator('ModalDisplay', {
              initialValue: this.state.selectOptionRecord
                ? this.state.selectOptionRecord.Display
                : null,
            })(<Input placeholder="How should this option be displayed" />)}
          </FormItem>
        </Modal>
      </Fragment>
    );

    const inputNumberSuffix = (
      <FormItem
        {...formItemLayout}
        label={
          <span>
            Suffix
            <em className="formcore_optional"> (Optional)</em>
          </span>
        }
      >
        {getFieldDecorator('Suffix', {
          initialValue: entity.Suffix,
        })(<Input placeholder="Text displayed after the number" />)}
      </FormItem>
    );

    return (
      <Card
        className="formcore-card-button-fix"
        bordered={false}
        loading={loading}
        title={entity.Label ? `Field: ${entity.Label}` : 'Field'}
      >
        <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
          {form && form.Parents && form.Parents.length > 0 && parents && parents.length > 0 ? (
            <FormItem
              {...formItemLayout}
              help={this.props.providedBy(form)}
              label={
                <span>
                  Copy and Modify
                  <em className="formcore_optional"> (Optional)</em>
                  &nbsp;
                  <em className="formcore_optional">
                    <Tooltip title="Select a field if you intend to copy and modify an existing field; otherwise leave it blank.">
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
                  placeholder="Select an existing field or leave it blank"
                >
                  {parents.map(y => (
                    <Select.Option key={y.Id} value={y.Id}>
                      {y.Label}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </FormItem>
          ) : null}
          <FormItem {...formItemLayout} label={<span>Type</span>}>
            {getFieldDecorator('FieldType', {
              initialValue: entity.FieldType,
            })(
              <RadioGroup
                onChange={e => {
                  this.setState({
                    fieldType: e.target.value,
                  });
                  return true;
                }}
              >
                <RadioButton value={FieldType.BuiltIn}>Built-in</RadioButton>
                <RadioButton value={FieldType.Custom}>Custom</RadioButton>
              </RadioGroup>
            )}
          </FormItem>
          {FieldType.BuiltIn !== fieldType ? null : (
            <FormItem {...formItemLayout} label="Built-in Handlers">
              {getFieldDecorator('Column', {
                rules: [
                  {
                    required: true,
                    message: 'Built-in fields require at least one built-in handler',
                  },
                ],
                initialValue: `${entity.Column}`.split('__FORMCORE__'),
              })(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  placeholder="Select built-in handlers for this field"
                  onChange={handlers => {
                    const availableOptions = this.props.availableOptions(handlers);
                    const calcSelectOptions = [];
                    let i = 0;
                    _.each(availableOptions, (val, key) => {
                      i += 1;
                      calcSelectOptions.push({
                        ID: i,
                        Value: key,
                        Display: val,
                        OptionType: OptionType.BuiltIn,
                      });
                    });
                    let h = {
                      inputSelectOptions: availableOptions,
                      selectOptions: calcSelectOptions,
                    };
                    handlers.forEach(handler => {
                      const info = this.props.availableHandlers.find(x => x[0] === handler);
                      if (info) {
                        h = {
                          ...h,
                          ...info[3],
                        };
                      }
                    });
                    this.setState(h);
                  }}
                >
                  {this.props.availableHandlers.map(x => (
                    <Option value={x[0]} key={x[0]}>
                      <Tooltip placement="bottom" title={x[2]}>
                        {x[1]}
                      </Tooltip>
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          )}
          <FormItem
            {...formItemLayout}
            label={
              <span>
                Label
                <em className="formcore_optional"> (Optional)</em>
              </span>
            }
          >
            {getFieldDecorator('Label', {
              initialValue: entity.Label,
            })(<Input placeholder="Label of the field" />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="Position"
            help="The higher the number is, the lower on the page will the field be displayed."
          >
            {getFieldDecorator('Position', {
              rules: [
                {
                  required: true,
                  message: 'Please enter the title of the field',
                },
              ],
              initialValue: entity.Position,
            })(<InputNumber style={{ width: '100%' }} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="Input Style">
            {getFieldDecorator('InputStyle', {
              initialValue: entity.InputStyle,
            })(
              <Select
                placeholder="Select the style of the field's input box"
                onChange={x => {
                  this.setState(pervState => {
                    const h = {
                      inputStyle: x,
                    };
                    if (this.props.onInputStyleChange) {
                      this.props.onInputStyleChange(x, pervState, h);
                    }
                    return h;
                  });
                }}
              >
                {_.map(_.keys(this.props.availableInputStyle), key => (
                  <Option
                    key={this.props.availableInputStyle[key]}
                    value={this.props.availableInputStyle[key]}
                  >
                    {key}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>

          {InputStyle.Hidden !== inputStyle ? null : inputDefaultValue}
          {InputStyle.Input !== inputStyle ? null : inputDefaultValue}
          {InputStyle.Input !== inputStyle ? null : inputPlaceholder}
          {InputStyle.RangePicker !== inputStyle ? null : rangeDefaultValue}
          {InputStyle.RangePicker !== inputStyle ? null : rangePlaceholder}
          {InputStyle.MoneyInput !== inputStyle ? null : moneyDefaultValue}
          {InputStyle.MoneyInput !== inputStyle ? null : inputPlaceholder}
          {InputStyle.InputNumber !== inputStyle ? null : numberDefaultValue}
          {InputStyle.InputNumber !== inputStyle ? null : inputPlaceholder}
          {InputStyle.InputNumber !== inputStyle ? null : inputNumberPrefix}
          {InputStyle.InputNumber !== inputStyle ? null : inputNumberSuffix}
          {InputStyle.Select !== inputStyle ? null : inputSelectMode}
          {InputStyle.Select !== inputStyle ? null : inputSelectValues}
          {InputStyle.Select !== inputStyle ? null : selectDefaultValue}

          {this.props.fieldRender &&
            this.props.fieldRender(
              entity,
              inputStyle,
              this.props.form.setFieldsValue,
              getFieldDecorator,
              formItemLayoutModal,
              formItemLayout,
              this.handleOptionOk,
              this.handleOptionCancel,
              this.state,
              this.setState
            )}

          <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
            <Button htmlType="submit" type="primary">
              Submit
            </Button>
            {this.props.cancelButton}
          </FormItem>
        </Form>
      </Card>
    );
  }
}

const FormCoreFieldsEdit = Form.create()(InnerFormCoreFieldsEdit);
export default FormCoreFieldsEdit;
