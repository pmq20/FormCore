# Form Core C\#

The C# + React + Ant Design implementation of https://github.com/rails-engine/form_core -- a Rails engine providing abilities to generate dynamic forms.

## Usage

### Frontend

    npm install --save antd-formcore

### Backend

    PM> Install-Package FormCore

Let your EF Context class inherit from `FormCore.Context` and add migrations.

    PM> add-migration

Revise the migration file that was automatically generated, removing foreign key constraints.

Finally apply the migration against your database,

    PM> update-database

## License

MIT

## See Also

- [form_core](https://github.com/rails-engine/form_core): a Rails engine providing abilities to generate dynamic forms.
- [React](https://github.com/facebook/react/): A declarative, efficient, and flexible JavaScript library for building user interfaces.
- [Ant Design](https://github.com/ant-design/ant-design/): A UI Design Language.
