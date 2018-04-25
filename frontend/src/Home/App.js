import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import Main from './Main';
import { getRouterData } from 'Router';

class App extends React.Component {
  state = {
    redirectTo: null,
  };

  redirectTo(url) {
    this.setState({ redirectTo: url });
  }

  up() {
    const arr = window.location.pathname.split('/');
    if (arr.length > 2) {
      this.redirectTo(arr.splice(0, arr.length - 1).join('/'));
    } else {
      this.redirectTo('/');
    }
  }

  refresh() {
    this.redirectTo(window.location.pathname);
  }

  render() {
    const routerData = getRouterData();
    return (
      <LocaleProvider locale={enUS}>
        <Router>
          {this.state.redirectTo ? (
            <Redirect to={this.state.redirectTo} />
          ) : (
            <Route
              path="/"
              render={props =>
                <Main routerData={routerData} {...props} />
              }
            />
          ) }
        </Router>
      </LocaleProvider>
    );
  }
}

export default App;
