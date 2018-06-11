<h1 align="center" style="border-bottom: none;">Form Core C#</h1>
<h3 align="center">.NET + React + Ant Design infrastructure for dynamic forms</h3>
<p align="center">
<a href="https://travis-ci.org/pmq20/FormCore">
  <img alt="Build Status" src="https://travis-ci.org/pmq20/FormCore.svg?branch=master" />
</a>
<a href="https://ci.appveyor.com/project/pmq20/form-core-csharp/branch/master">
  <img alt="Build status" src="https://ci.appveyor.com/api/projects/status/9030m3bc55r401rf/branch/master?svg=true" />
</a>
<a href="https://codecov.io/gh/pmq20/FormCore">
  <img alt="codecov" src="https://codecov.io/gh/pmq20/FormCore/branch/master/graph/badge.svg" />
</a>
<a href="https://www.nuget.org/packages/FormCore">
  <img alt="NuGet" src="https://img.shields.io/nuget/v/FormCore.svg" />
</a>
<a href="https://npmjs.org/package/antd-formcore">
  <img alt="NPM version" src="https://img.shields.io/npm/v/antd-formcore.svg" />
</a>
<a href="http://packagequality.com/#?package=antd-formcore">
  <img alt="NPM quality" src="http://npm.packagequality.com/shield/antd-formcore.svg" />
</a>
<a href="https://www.nuget.org/packages/FormCore">
  <img alt="NuGet" src="https://img.shields.io/nuget/dt/FormCore.svg" />
</a>
<a href="https://npmjs.org/package/antd-formcore">
  <img alt="NPM download" src="https://img.shields.io/npm/dm/antd-formcore.svg" />
</a>
<a href="https://snyk.io/test/github/pmq20/FormCore?targetFile=Frontend%2Fpackage.json">
  <img src="https://snyk.io/test/github/pmq20/FormCore/badge.svg?targetFile=Frontend%2Fpackage.json" alt="Known Vulnerabilities" data-canonical-src="https://snyk.io/test/github/pmq20/FormCore?targetFile=Frontend%2Fpackage.json" style="max-width:100%;">
</a>
<a href="http://isitmaintained.com/project/pmq20/FormCore">
  <img alt="Average time to resolve an issue" src="http://isitmaintained.com/badge/resolution/pmq20/FormCore.svg" />
</a>
<a href="http://isitmaintained.com/project/pmq20/FormCore">
  <img alt="Percentage of issues still open" src="http://isitmaintained.com/badge/open/pmq20/FormCore.svg" />
</a>
<a href="https://gitter.im/antd-formcore/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge">
  <img alt="Join the chat at https://gitter.im/antd-formcore/Lobby" src="https://badges.gitter.im/antd-formcore/Lobby.svg" />
</a>
</p>

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

## Contributing    

Please use [EditorConfig](http://editorconfig.org/#download) to format your codes.

## Team

| [![Minqi Pan](https://github.com/pmq20.png?size=100)](https://github.com/pmq20) | [![Xiang Yan](https://github.com/debbbbie.png?size=100)](https://github.com/debbbbie) |
|---------------------------------------------------------------------------------|---------------------------------------------------------------------------------------|
| [Minqi Pan](https://github.com/pmq20)                                           | [Xiang Yan](https://github.com/debbbbie)                                              |

## License

MIT

## See Also

- [.NET Framework](https://microsoft.com/net): a software framework developed by Microsoft.
- [React](https://github.com/facebook/react/): a declarative, efficient, and flexible JavaScript library for building user interfaces.
- [Ant Design](https://github.com/ant-design/ant-design/): a UI Design Language.
