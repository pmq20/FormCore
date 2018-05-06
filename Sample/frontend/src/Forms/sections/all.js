import React from 'react';
import { Table, Card, Divider, Icon, Button } from 'antd';
import Api from 'Api';

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: text => <a href="#">{text}</a>,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
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

export default class FormsSectionsAll extends React.Component {
  state = {};

  componentWillUnmount() {
    this.api.cancel();
  }

  api = new Api();

  render() {
    return (
      <Card
        class="minqi-pan-card-button-fix"
        title="Sections"
        style={{ marginBottom: 24 }}
        extra={<Button icon="plus">New Section</Button>}
      >
        <Table columns={columns} dataSource={data} />
      </Card>
    );
  }
}
