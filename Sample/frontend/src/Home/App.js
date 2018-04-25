import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { LocaleProvider } from 'antd';
import { getRouterData } from 'Router';
import Api from 'Api';
import enUS from 'antd/lib/locale-provider/en_US';
import Main from './Main';

class App extends React.Component {
  state = {
    redirectTo: null,
    forms: null,
  };

  componentDidMount() {
    if (!this.state.forms) {
      this.reloadForms();
    }
    window.AppInstance = this;
  }

  componentDidUpdate() {
    if (this.state.redirectTo) {
      this.setState({ redirectTo: null }); // eslint-disable-line
    }
  }

  componentWillUnmount() {
    this.api.cancel();
  }

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

  reloadForms() {
    this.api.get('/forms', data => {
      this.setState({ forms: data });
    });
  }

  api = new Api();

  render() {
    const { forms } = this.state;
    const routerData = getRouterData();
    return (
      <LocaleProvider locale={enUS}>
        <Router>
          {this.state.redirectTo ? (
            <Redirect to={this.state.redirectTo} />
          ) : (
            <Route
              path="/"
              render={props => <Main routerData={routerData} forms={forms} {...props} />}
            />
          )}
        </Router>
      </LocaleProvider>
    );
  }
}

export default App;
