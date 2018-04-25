import React, { Fragment } from 'react';
import { Route, Link, Switch, Redirect } from 'react-router-dom';
import { Menu, Icon, Row, Col } from 'antd';
import PageHeaderLayout from 'Components/PageHeaderLayout';
import FormsNew from './new';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const parseIdTab = props => {
  let id = null;
  let patt = new RegExp('^/(.*)');
  let match = props.location.pathname.match(patt);
  if (match && match[1]) {
    [, id] = match;
  }
  return { id };
};

export default class Forms extends React.Component {
  state = {
    id: 'new',
  };

  componentDidMount() {
    const { id } = parseIdTab(this.props);
    this.setState({ id });
  }

  componentWillReceiveProps(nextProps) {
    const { id } = parseIdTab(nextProps);
    this.setState({ id });
  }

  render() {
    return (
      <PageHeaderLayout
        location={this.props.location}
        breadcrumbNameMap={this.props.breadcrumbNameMap}
      >
        <Row gutter={24}>
          <Col xl={6} lg={24} md={24} sm={24} xs={24}>
            <Menu
              onClick={this.handleClick}
              defaultOpenKeys={['configuration', 'execution']}
              selectedKeys={[this.state.id]}
              mode="inline"
              style={{ marginBottom: 24 }}
            >
              <SubMenu
                key="configuration"
                title={
                  <span>
                    <Icon type="check-square" />
                    <span>Form Configuration</span>
                  </span>
                }
              >
                <Menu.Item key="new">
                  <Link to="/new">
                    New Form
                  </Link>
                </Menu.Item>
              </SubMenu>
            </Menu>
          </Col>
          <Col xl={18} lg={24} md={24} sm={24} xs={24}>
            <Switch>
              <Route
                exact
                path="/new"
                render={props => (
                  <FormsNew
                    routes={this.props.routes}
                    {...props}
                  />
                )}
              />
              <Route
                exact
                path="/new"
                render={props => (
                  <FormsNew
                    routes={this.props.routes}
                    {...props}
                  />
                )}
              />
              <Redirect to="/new" />
            </Switch>
          </Col>
        </Row>
      </PageHeaderLayout>
    );
  }
}
