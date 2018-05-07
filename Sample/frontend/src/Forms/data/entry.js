import React from 'react';
import { Spin } from 'antd';
import AntdFormCore from 'antd-formcore';
import Api from 'Api';

export default class FormsDataEntry extends React.Component {
  state = {
    loading: true,
    sections: [],
    fields: [],
  };

  componentDidMount() {
    this.load(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.id !== this.props.match.params.id) {
      this.load(nextProps);
    }
  }

  componentWillUnmount() {
    this.api.cancel();
  }

  load(props) {
    this.setState({ loading: true });
    this.api.get(`/${props.match.params.id}/sections`, {}, sections => {
      this.api.get(`/${props.match.params.id}/fields`, {}, fields => {
        this.setState({ loading: false, sections, fields });
      });
    });
  }

  api = new Api();

  render() {
    const { loading, sections, fields } = this.state;
    if (loading) {
      return <Spin />;
    } else {
      return <AntdFormCore sections={sections} fields={fields} />;
    }
  }
}
