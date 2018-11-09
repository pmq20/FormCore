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
      return data[field.Column] ? (
        <Description key={field.Id} term={field.Label}>
          {data[field.Column]}
        </Description>
      ) : null;
    case InputStyle.InputNumber:
      return data[field.Column] ? (
        <Description key={field.Id} term={field.Label}>
          {`${_.isString(field.Payload.Prefix) ? `${field.Payload.Prefix} ` : ''}${data[field.Column]}${_.isString(field.Payload.Suffix) ? ` ${field.Payload.Suffix}` : ''}`}
        </Description>
      ) : null;
    case InputStyle.Select:
      return data[field.Column] ? (
        <Description key={field.Id} term={field.Label}>
          {
            ['multiple', 'tags'].indexOf(field.Payload.Mode) !== -1 ? (
              _.map(data[field.Column], k => _.find(field.Payload.Options, x => x.Value === k).Display).join(', ')
            ) : (
              _.find(field.Payload.Options, x => x.Value === data[field.Column]).Display
            )
          }
        </Description>
      ) : null;
    case InputStyle.RangePicker:
      return data[field.Column] && _.isArray(data[field.Column]) ? (
        data[field.Column].length === 2 && data[field.Column][0] && data[field.Column][1] ? (
          <Description key={field.Id} term={field.Label}>
            {showDate(data[field.Column][0])} - {showDate(data[field.Column][1])}
          </Description>
        ) : null
      ) : null;
    case InputStyle.Hidden:
      return null;
    case InputStyle.MoneyInput:
      return data[field.Column] ? (
        <Description key={field.Id} term={field.Label}>
          {`$${numeral(data[field.Column]).format('0,0.00')}`}
        </Description>
      ) : null;
    case InputStyle.DisplayOnly:
      return data[field.Column] ? (
        <Description key={field.Id} term={field.Label}>
          {data[field.Column]}
        </Description>
      ) : null;
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
