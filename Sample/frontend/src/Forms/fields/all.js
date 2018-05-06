import React from 'react';
import { Link } from 'react-router-dom';
import { Table, Card, Divider, Icon, Button } from 'antd';
import Api from 'Api';

export default class FormsFieldsAll extends React.Component {
  state = {};

  componentWillUnmount() {
    this.api.cancel();
  }

  api = new Api();

  render() {
    const columns = [
      {
        title: 'Title',
        dataIndex: 'Title',
        key: 'Title',
        render: (text, record) => (
          <Link to={`/${this.props.match.params.id}/Fields/${record.ID}`}>{text}</Link>
        ),
      },
      {
        title: 'Section',
        dataIndex: 'SectionID',
        key: 'SectionID',
        render: (text, record) => (
          <Link to={`/${this.props.match.params.id}/Sections/${record.SectionID}`}>{text}</Link>
        ),
      },
      {
        title: 'Position',
        dataIndex: 'Position',
        key: 'Position',
      },
      {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
          <span>
            <a href="#">Action 一 {record.name}</a>
            <Divider type="vertical" />
            <a href="#">Delete</a>
            <Divider type="vertical" />
            <a href="#" className="ant-dropdown-link">
              More actions <Icon type="down" />
            </a>
          </span>
        ),
      },
    ];

    const data = [
      {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
      },
      {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
      },
      {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
      },
    ];

    return (
      <Card
        class="minqi-pan-card-button-fix"
        title="Fields"
        style={{ marginBottom: 24 }}
        extra={<Button icon="plus">New Field</Button>}
      >
        <Table columns={columns} dataSource={data} />
      </Card>
    );
  }
}
