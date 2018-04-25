import _ from 'lodash';
import { message } from 'antd';
import { getAccessToken } from './Utils';

let loading = null;

class Api {
  xhrObjects = {};
  xhrObjectsCnt = 0;
  apiCancelled = false;

  request(method, uri, data, success, failure) {
    const index = this.xhrObjectsCnt;
    const that = this;
    const options = {
      method,
      url: window.ApiEndpoint + uri,
      headers: { Authorization: getAccessToken() },
      success: (response, textStatus, jqXHR) => {
        success(response, jqXHR);
      },
      error: (jqXHR, textStatus, errorThrown) => {
        if (failure && jqXHR.responseJSON) {
          if (failure(jqXHR.status, jqXHR.responseJSON)) {
            // this means that failure() can handle it
            // otherwise, go on with normal error handling
            return;
          }
        }
        if (jqXHR.responseJSON && jqXHR.responseJSON.ErrMsg) {
          message.warning(jqXHR.responseJSON.ErrMsg);
          return;
        }
        if (textStatus === 'abort') {
          return;
        }
        let msg = `${textStatus}`;
        if (errorThrown) {
          msg += `: ${errorThrown}`;
        }
        message.error(msg);
      },
      beforeSend: jqXHR => {
        this.apiCancelled = false;
        that.xhrObjects[index] = jqXHR;
        that.xhrObjects[index].loadingInterval = setInterval(() => {
          if (that.xhrObjects[index]) {
            if (!loading) {
              loading = message.loading('Loading...', 0);
            }
          }
        }, 1000);
      },
      complete: () => {
        if (loading) {
          loading();
          loading = null;
        }
        if (that.xhrObjects[index]) {
          const x = that.xhrObjects[index];
          that.xhrObjects[index] = null;
          if (x.loadingInterval) {
            clearInterval(x.loadingInterval);
            x.loadingInterval = null;
          }
        }
      },
    };
    if (data != null) {
      options.dataType = 'json';
      options.contentType = 'application/json';
      if (options.method === 'GET') {
        options.data = window.jQuery.param(data);
      } else {
        options.data = JSON.stringify(data);
      }
    }
    this.xhrObjectsCnt += 1;
    return window.jQuery.ajax(options);
  }

  get(uri, params, success, failure) {
    if (typeof params === 'function') {
      return this.request('GET', uri, null, params, success);
    } else {
      return this.request('GET', uri, params, success, failure);
    }
  }

  delete(uri, success, failure) {
    return this.request('DELETE', uri, null, success, failure);
  }

  post(uri, data, success, failure) {
    return this.request('POST', uri, data, success, failure);
  }

  put(uri, data, success, failure) {
    return this.request('PUT', uri, data, success, failure);
  }

  cancel() {
    this.apiCancelled = true;

    if (loading) {
      loading();
      loading = null;
    }
    for (let i = 0; i < this.xhrObjectsCnt; i += 1) {
      if (this.xhrObjects[i]) {
        const x = this.xhrObjects[i];
        this.xhrObjects[i] = null;
        if (x.loadingInterval) {
          clearInterval(x.loadingInterval);
          x.loadingInterval = null;
        }
        x.abort();
      }
    }
  }

  submitPost(component, uri, data, success, failure) {
    Api.assertComponent(component);

    component.setState({ submitting: true });
    const ajax = this.request('POST', uri, data, success, failure).always(() => {
      if (component && !this.apiCancelled) {
        component.setState({ submitting: false });
      }
    });
    return ajax;
  }

  submitPut(component, uri, data, success, failure) {
    Api.assertComponent(component);

    component.setState({ submitting: true });
    const ajax = this.request('PUT', uri, data, success, failure).always(() => {
      if (component && !this.apiCancelled) {
        component.setState({ submitting: false });
      }
    });
    return ajax;
  }

  static assertComponent(component) {
    if (!component.state) {
      throw Error('submit ajax first argument must be a component');
    }
  }
}

export default Api;
