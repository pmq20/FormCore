import React, { Component } from 'react';
import { Card } from 'antd';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';

const { Description } = DescriptionList;

export default class FormCoreFormsList extends Component {
  state = {
    loading: true,
    forms: [],
  };

  componentDidMount() {
    this.fetch();
  }

  componentWillReceiveProps(nextProps) {
    const { location } = nextProps;
    const { location: rawLocation } = this.props;

    if (location.pathname !== rawLocation.pathname) {
      this.fetch();
    }
  }

  fetch = () => {
    this.setState({
      loading: true,
    });
    this.props.fetch(data => {
      this.setState({
        loading: false,
        forms: data,
      });
    });
  };

  render() {
    const { loading, forms } = this.state;
    return (
      <Card
        className="formcore-card-button-fix"
        style={{ marginBottom: 24 }}
        title="Product Offers"
        bordered={false}
        extra={this.props.newFormButton}
        loading={loading}
      >
        <DescriptionList size="large">
          {forms && forms.length > 0 ? (
            forms.map(x => <Description key={x.Id}>{this.props.formLink(x)}</Description>)
          ) : (
            <div className="ant-list-empty-text" style={{ paddingBottom: 32 }}>
              No data
            </div>
          )}
        </DescriptionList>
      </Card>
    );
  }
}
