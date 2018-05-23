# Form Core C\#

The C# + React + Ant Design implementation of https://github.com/rails-engine/form_core -- a Rails engine providing abilities to generate dynamic forms.

[![NuGet](https://img.shields.io/nuget/v/FormCore.svg)](https://www.nuget.org/packages/FormCore)
[![NPM version][npm-image]][npm-url]
[![NPM quality][quality-image]][quality-url]
[![NuGet](https://img.shields.io/nuget/dt/FormCore.svg)](https://www.nuget.org/packages/FormCore)
[![NPM download][download-image]][download-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![Average time to resolve an issue](http://isitmaintained.com/badge/resolution/pmq20/form_core_csharp.svg)](http://isitmaintained.com/project/pmq20/form_core_csharp")
[![Percentage of issues still open](http://isitmaintained.com/badge/open/pmq20/form_core_csharp.svg)](http://isitmaintained.com/project/pmq20/form_core_csharp)
[![Join the chat at https://gitter.im/form_core_csharp/Lobby](https://badges.gitter.im/form_core_csharp/Lobby.svg)](https://gitter.im/form_core_csharp/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[npm-image]: https://img.shields.io/npm/v/antd-formcore.svg
[npm-url]: https://npmjs.org/package/antd-formcore
[snyk-image]: https://snyk.io/test/npm/antd-formcore/badge.svg
[snyk-url]: https://snyk.io/test/npm/antd-formcore
[download-image]: https://img.shields.io/npm/dm/antd-formcore.svg
[download-url]: https://npmjs.org/package/antd-formcore
[quality-image]: http://npm.packagequality.com/shield/antd-formcore.svg
[quality-url]: http://packagequality.com/#?package=antd-formcore

## Usage

### Backend

    PM> Install-Package FormCore

Let your Entity Framework Context class inherit from `FormCore.Context`. E.g.,

    public class Context : FormCore.Context {}

Then add migrations.

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
