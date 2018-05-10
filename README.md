# Form Core C\#

The C# + React + Ant Design implementation of https://github.com/rails-engine/form_core -- a Rails engine providing abilities to generate dynamic forms.

[![NuGet](https://img.shields.io/nuget/dt/FormCore.svg?style=flat-square)](https://www.nuget.org/packages/FormCore)
[![NPM version][npm-image]][npm-url]
[![NPM quality][quality-image]][quality-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![NPM download][download-image]][download-url]
[![Gitter][gitter-image]][gitter-url]

[npm-image]: https://img.shields.io/npm/v/antd-formcore.svg?style=flat-square
[npm-url]: https://npmjs.org/package/antd-formcore
[quality-image]: http://npm.packagequality.com/shield/antd-formcore.svg?style=flat-square
[quality-url]: http://packagequality.com/#?package=antd-formcore
[travis-image]: https://img.shields.io/travis/pmq20/antd-formcore.svg?style=flat-square
[travis-url]: https://travis-ci.org/pmq20/antd-formcore
[codecov-image]: https://img.shields.io/codecov/c/github/pmq20/antd-formcore.svg?style=flat-square
[codecov-url]: https://codecov.io/gh/pmq20/antd-formcore
[david-image]: https://img.shields.io/david/pmq20/antd-formcore.svg?style=flat-square
[david-url]: https://david-dm.org/pmq20/antd-formcore
[snyk-image]: https://snyk.io/test/npm/antd-formcore/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/antd-formcore
[download-image]: https://img.shields.io/npm/dm/antd-formcore.svg?style=flat-square
[download-url]: https://npmjs.org/package/antd-formcore
[gitter-image]: https://img.shields.io/gitter/room/pmq20/antd-formcore.svg?style=flat-square
[gitter-url]: https://gitter.im/pmq20/antd-formcore

## Usage

### Backend

    PM> Install-Package FormCore

Let your EF Context class inherit from `FormCore.Context` and add migrations.

    PM> add-migration

Revise the migration file that was automatically generated, removing foreign key constraints.

Finally apply the migration against your database,

    PM> update-database

### Frontend

    npm install --save antd-formcore

## License

MIT

## See Also

- [form_core](https://github.com/rails-engine/form_core): a Rails engine providing abilities to generate dynamic forms.
- [React](https://github.com/facebook/react/): A declarative, efficient, and flexible JavaScript library for building user interfaces.
- [Ant Design](https://github.com/ant-design/ant-design/): A UI Design Language.
