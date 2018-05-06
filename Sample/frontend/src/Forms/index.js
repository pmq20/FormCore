import React from 'react';
import { Route, Link, Switch, Redirect } from 'react-router-dom';
import { Menu, Row, Col } from 'antd';
import PageHeaderLayout from 'Components/PageHeaderLayout';
import FormsNew from './new';
import FormsSectionsNew from './sections/new';
import FormsSectionsAll from './sections/all';
import FormsFieldsNew from './fields/new';
import FormsFieldsAll from './fields/all';
import FormsDataAll from './data/all';
import FormsDataEntry from './data/entry';

const { SubMenu } = Menu;
const MenuItemGroup = Menu.ItemGroup;

export default class Forms extends React.Component {
  render() {
    const { location, forms } = this.props;
    const [, id, sub2, sub3] = location.pathname.split('/');
    return (
      <PageHeaderLayout
        location={this.props.location}
        breadcrumbNameMap={this.props.breadcrumbNameMap}
      >
        <Row gutter={24}>
          <Col xl={6} lg={24} md={24} sm={24} xs={24}>
            <Menu
              onClick={this.handleClick}
              selectedKeys={[id, `forms_${id}_${sub2}`, `forms_${id}_${sub2}_${sub3}`]}
              defaultOpenKeys={[`forms_${id}`]}
              mode="inline"
              style={{ marginBottom: 24 }}
            >
              <Menu.Item key="new">
                <Link to="/new">New Form</Link>
              </Menu.Item>
              {!forms
                ? null
                : forms.map(x => (
                    <SubMenu key={`forms_${x.ID}`} title={`Form #${x.ID}: ${x.Title}`}>
                      <MenuItemGroup key={`forms_${x.ID}_definition`} title="Definition">
                        <Menu.Item key={`forms_${x.ID}_sections`}>
                          <Link to={`/${x.ID}/sections`}>Sections</Link>
                        </Menu.Item>
                        <Menu.Item key={`forms_${x.ID}_fields`}>
                          <Link to={`/${x.ID}/fields`}>Fields</Link>
                        </Menu.Item>
                      </MenuItemGroup>
                      <MenuItemGroup key={`forms_${x.ID}_data`} title="Data">
                        <Menu.Item key={`forms_${x.ID}_data_entry`}>
                          <Link to={`/${x.ID}/data/entry`}>Data Entry</Link>
                        </Menu.Item>
                        <Menu.Item key={`forms_${x.ID}_data_all`}>
                          <Link to={`/${x.ID}/data/all`}>All Data</Link>
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
                path="/:id/sections/new"
                render={props => <FormsSectionsNew routes={this.props.routes} {...props} />}
              />
              <Route
                exact
                path="/:id/sections"
                render={props => <FormsSectionsAll routes={this.props.routes} {...props} />}
              />
              <Route
                exact
                path="/:id/fields/new"
                render={props => <FormsFieldsNew routes={this.props.routes} {...props} />}
              />
              <Route
                exact
                path="/:id/fields"
                render={props => <FormsFieldsAll routes={this.props.routes} {...props} />}
              />
              <Route
                exact
                path="/:id/data/entry"
                render={props => <FormsDataEntry routes={this.props.routes} {...props} />}
              />
              <Route
                exact
                path="/:id/data/all"
                render={props => <FormsDataAll routes={this.props.routes} {...props} />}
              />
              <Redirect to="/new" />
            </Switch>
          </Col>
        </Row>
      </PageHeaderLayout>
    );
  }
}
