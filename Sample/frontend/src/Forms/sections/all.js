import React from 'react';
import { Link } from 'react-router-dom';
import { Table, Card, Divider, Icon, Button } from 'antd';
import Api from 'Api';

export default class FormsSectionsAll extends React.Component {
  state = {
    loading: true,
    data: [],
  };

  componentDidMount() {
    this.load(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.load(nextProps);
  }

  componentWillUnmount() {
    this.api.cancel();
  }

  load(props) {
    this.setState({ loading: true });
    this.api.get(`/${props.match.params.id}/sections`, {}, data => {
      this.setState({ loading: false, data });
    });
  }

  api = new Api();

  render() {
    const columns = [
      {
        title: 'Title',
        dataIndex: 'Title',
        key: 'Title',
        render: (text, record) => (
          <Link to={`/${this.props.match.params.id}/Sections/${record.ID}`}>{text}</Link>
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

    return (
      <Card
        className="minqi-pan-card-button-fix"
        title="Sections"
        style={{ marginBottom: 24 }}
        extra={
          <Link to={`/${this.props.match.params.id}/sections/new`}>
            <Button icon="plus">New Section</Button>
          </Link>
        }
        loading={this.state.loading}
      >
        <Table columns={columns} dataSource={this.state.data} />
      </Card>
    );
  }
}
