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
                    <SubMenu key={`forms_${x.ID}`} title={`Form: ${x.Title}`}>
                      <MenuItemGroup key={`forms_${x.ID}_definition`} title="Definition">
                        <Menu.Item key={`forms_${x.ID}_sections`}>
                          <Link to={`/${x.ID}/sections`}>Sections</Link>
                        </Menu.Item>
                        <Menu.Item key={`forms_${x.ID}_fields`}>
                          <Link to={`/${x.ID}/fields`}>Fields</Link>
                        </Menu.Item>
                      </MenuItemGroup>
                      <MenuItemGroup key={`forms_${x.ID}_data`} title="Data">
                        <Menu.Item key={`forms_${x.ID}_data_new`}>
                          <Link to={`/${x.ID}/data/new`}>New Data</Link>
                        </Menu.Item>
                        <Menu.Item key={`forms_${x.ID}_data`}>
                          <Link to={`/${x.ID}/data`}>All Data</Link>
                        </Menu.Item>
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
