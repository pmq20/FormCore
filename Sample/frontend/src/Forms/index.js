import React from 'react';
import { Route, Link, Switch, Redirect } from 'react-router-dom';
import { Menu, Row, Col } from 'antd';
import PageHeaderLayout from 'Components/PageHeaderLayout';
import FormsNew from './new';

const { SubMenu } = Menu;
const MenuItemGroup = Menu.ItemGroup;

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
    const { forms } = this.props;
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
              {!forms
                ? null
                : forms.map(x => (
                    <SubMenu key={`forms_${x.ID}`} title={x.Title}>
                      <MenuItemGroup key="g1" title="Item 1">
                        <Menu.Item key="1">Option 1</Menu.Item>
                        <Menu.Item key="2">Option 2</Menu.Item>
                      </MenuItemGroup>
                      <MenuItemGroup key="g2" title="Item 2">
                        <Menu.Item key="3">Option 3</Menu.Item>
                        <Menu.Item key="4">Option 4</Menu.Item>
                      </MenuItemGroup>
                    </SubMenu>
                  ))}
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
