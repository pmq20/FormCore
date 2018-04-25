import React, { Fragment } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { Layout, Icon } from 'antd';
import DocumentTitle from 'react-document-title';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import { enquireScreen, unenquireScreen } from 'enquire-js';
import NotFound from 'Exception/404';
import { getRoutes } from 'Utils';

const { Content } = Layout;

const getBreadcrumbNameMap = (routerData) => {
  const result = {};
  const childResult = {};
  return Object.assign({}, routerData, result, childResult);
};

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
  },
};

let isMobile;
enquireScreen(b => {
  isMobile = b;
});

class App extends React.Component {
  state = {
    isMobile,
  };

  componentDidMount() {
    this.enquireHandler = enquireScreen(mobile => {
      this.setState({
        isMobile: mobile,
      });
    });
  }

  componentWillUnmount() {
    unenquireScreen(this.enquireHandler);
  }

  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = 'Form Core C#';
    // Minqi: URL is pathname with end slash fixed
    let url = `${pathname}`;
    if (url.length >= 1 && url[url.length - 1] === '/') {
      url = url.substr(0, url.length - 1);
    }
    if (routerData[url] && routerData[url].name) {
      title = `${routerData[url].name} - Form Core C#`;
    } else {
      // Minqi: display titles for individual-object pages
      let routerDataTitle = null;
      Object.keys(routerData).forEach(item => {
        const itemRegExpStr = `^${item.replace(/:[\w-]+/g, '[\\w-]+')}$`;
        const itemRegExp = new RegExp(itemRegExpStr);
        if (itemRegExp.test(url)) {
          const routerDataName = routerData[item].name;
          routerDataTitle =
            typeof routerDataName === 'function' ? routerDataName(url) : routerDataName;
        }
      });
      if (routerDataTitle) {
        title = `${routerDataTitle} - Form Core C#`;
      }
    }
    return title;
  }

  render() {
    const { match, location, routerData } = this.props;
    const { collapsed, fetchingNotices } = this.state;
    const layout = (
      <Content style={{ margin: '24px 24px 0', height: '100%' }}>
        <Switch>
          {getRoutes(match.path, routerData).map(item => (
            <Route
              key={item.key}
              path={item.path}
              render={props => (
                <item.component
                  routerData={routerData}
                  location={this.props.location}
                  breadcrumbNameMap={getBreadcrumbNameMap(
                    this.props.routerData
                  )}
                  {...props}
                />
              )}
              exact={item.exact}
              authority={item.authority}
              redirectPath="/"
            />
          ))}
          <Redirect to="/new" />
          <Route render={NotFound} />
        </Switch>
      </Content>
    );

    return (
      <DocumentTitle title={this.getPageTitle()}>
        <ContainerQuery query={query}>
          {params => <div className={classNames(params)}>{layout}</div>}
        </ContainerQuery>
      </DocumentTitle>
    );
  }
}

export default App;
