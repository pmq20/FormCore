import _ from 'lodash';
import React from 'react';
import numeral from 'numeral';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import InputStyle from './Constants/InputStyle';

const { Description } = DescriptionList;

function monthAbbreviation(x) {
  switch (x) {
    case 0:
      return 'Jan';
    case 1:
      return 'Feb';
    case 2:
      return 'Mar';
    case 3:
      return 'Apr';
    case 4:
      return 'May';
    case 5:
      return 'Jun';
    case 6:
      return 'Jul';
    case 7:
      return 'Aug';
    case 8:
      return 'Sep';
    case 9:
      return 'Oct';
    case 10:
      return 'Nov';
    case 11:
      return 'Dec';
    default:
      return '';
  }
}

export function showDate(date) {
  if (!date) return '';
  const dateAt = new Date(date);
  return `${monthAbbreviation(dateAt.getMonth())} ${dateAt.getDate()}, ${dateAt.getFullYear()}`;
}

export default function ShowField(field, data, showProps = {}, showExtra = null) {
  switch (field.InputStyle) {
    case InputStyle.Input:
      return (
        <Description key={field.Id} term={field.Label}>
          {data[field.Column]}
        </Description>
      );
    case InputStyle.InputNumber:
      return (
        <Description key={field.Id} term={field.Label}>
          {data[field.Column] ? `${_.isString(field.Payload.Prefix) ? `${field.Payload.Prefix} ` : ''}${data[field.Column]}${_.isString(field.Payload.Suffix) ? ` ${field.Payload.Suffix}` : ''}` : ''}
        </Description>
      );
    case InputStyle.Select:
      return (
        <Description key={field.Id} term={field.Label}>
          {data[field.Column] ? _.map(data[field.Column], k => _.find(field.Payload.Options, x => x.Value === k).Display).join(', ') : ''}
        </Description>
      );
    case InputStyle.RangePicker:
      return (
        <Description key={field.Id} term={field.Label}>
          {data[field.Column] ? `${showDate(data[field.Column][0])} - ${showDate(data[field.Column][1])}` : ''}
        </Description>
      );
    case InputStyle.Hidden:
      return (
        <Description key={field.Id} term={field.Label} style={{display: 'none'}}>
          {data[field.Column]}
        </Description>
      );
    case InputStyle.MoneyInput:
      return (
        <Description key={field.Id} term={field.Label}>
          {data[field.Column] ? `$${numeral(data[field.Column]).format('0,0.00')}` : ''}
        </Description>
      );
    case InputStyle.DisplayOnly:
      return (
        <Description key={field.Id} term={field.Label}>
          {data[field.Column]}
        </Description>
      );
    default:
      if (showExtra) {
        return showExtra(field, data, showProps);
      }
      throw new Error(
        `FormCore: Unspported input style ${field.InputStyle} of field ${
          field.Id
        }. You might want to consider using customized input styles, cf. the showExtra parameter. Otheriwse pull Requests are welcome: https://github.com/pmq20/FormCore/pulls`
      );
  }
}
