import React from 'react';
import { Route, Link, Switch, Redirect } from 'react-router-dom';
import { Menu, Row, Col } from 'antd';
import PageHeaderLayout from 'Components/PageHeaderLayout';
import FormsNew from './new';

export default class Forms extends React.Component {
  parseIdTab() {
    let id = null;
    const patt = new RegExp('^/(.*)');
    const match = this.props.location.pathname.match(patt);
    if (match && match[1]) {
      [, id] = match;
    }
    return { id };
  }

  render() {
    const { id } = this.parseIdTab();
    return (
      <PageHeaderLayout
        location={this.props.location}
        breadcrumbNameMap={this.props.breadcrumbNameMap}
      >
        <Row gutter={24}>
          <Col xl={6} lg={24} md={24} sm={24} xs={24}>
            <Menu
              onClick={this.handleClick}
              selectedKeys={[id]}
              mode="inline"
              style={{ marginBottom: 24 }}
            >
              <Menu.Item key="new">
                <Link to="/new">New Form</Link>
              </Menu.Item>
            </Menu>
          </Col>
          <Col xl={18} lg={24} md={24} sm={24} xs={24}>
            <Switch>
              <Route
                exact
                path="/new"
                render={props => <FormsNew routes={this.props.routes} {...props} />}
              />
              <Route
                exact
                path="/new"
                render={props => <FormsNew routes={this.props.routes} {...props} />}
              />
              <Redirect to="/new" />
            </Switch>
          </Col>
        </Row>
      </PageHeaderLayout>
    );
  }
}
