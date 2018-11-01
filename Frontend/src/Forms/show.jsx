import _ from 'lodash';
import React, { Fragment, Component } from 'react';
import { Form, Card, Divider, Table } from 'antd';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import RenderField from '../RenderField';

@Form.create()
class FormCoreFormsShow extends Component {
  state = {
    loading: true,
    form: {},
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
    props.fetch(data => {
      this.setState({
        loading: false,
        form: data,
      });
    });
  };

  render() {
    const { loading, form } = this.state;
    const sectionsColumns = [
      {
        title: 'Name',
        dataIndex: 'Id',
        key: 'Id',
        render: (text, row) => {
          if (row.SectionOperation) {
            return this.props.newSectionLink(row.Id);
          }
          if (row.FieldOperation) {
            return this.props.newFieldLink(row.Id, row.SectionId);
          }
          if (row.Title) {
            return this.props.sectionLink(row.Id, row.Id, row.Title);
          }
          return this.props.fieldLink(row.Id, row.SectionId, row.Id.split('_')[1], row.Label);
        },
      },
      {
        title: 'Preview',
        render: (text, row) => {
          if (row.Label) {
            const y = Object.assign({}, row);
            y.Label = null;
            return RenderField(
              y,
              this.props.form,
              {
                style: { width: '100%', display: 'inline-block' },
              },
							this.props.renderExtra
            );
          }
          return null;
        },
      },
    ];
    const sections = !form
      ? []
      : _.filter(form.Sections, x => form.Id === x.FormId)
          .map(x => ({
            ...x,
            children: _.filter(form.Fields, y => x.Id === y.SectionId && form.Id === x.FormId)
              .map(y => ({
                ...y,
                Id: `${x.Id}_${y.Id}`,
              }))
              .concat(
								[{ Id: `${x.Id}_FieldOperation`, FieldOperation: true, SectionId: x.Id }]
              ),
          }))
          .concat(
						[{ Id: 'SectionOperation', SectionOperation: true }]
          );
    return (
      <Card
        className="formcore-card-button-fix"
        title={form.Title ? form.Title : 'Product Offer'}
        loading={loading}
        style={{ marginBottom: 24 }}
        extra={this.props.editFormButton()}
      >
        {form ? (
          <Fragment>
            <DescriptionList size="large" title="Introduction" style={{ marginBottom: 32 }}>
							{this.props.formIntroduction(form)}
            </DescriptionList>
            <Divider style={{ marginBottom: 32 }} />
            <div className="formcore_title">
              {form.Parents && form.Parents.length > 0 ? 'Modifications' : 'Components'}
            </div>
            <Table
              fixLeft={false}
              scrollWidth={350}
              className="formcore_formTable"
              style={{ marginBottom: 24 }}
              pagination={false}
              loading={loading}
              dataSource={sections}
              columns={sectionsColumns}
              rowKey="Id"
            />
          </Fragment>
        ) : null}
      </Card>
    );
  }
}

export default FormCoreFormsShow;
