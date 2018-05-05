# Form Core C\#

The C# + React implementation of https://github.com/rails-engine/form_core -- a Rails engine providing abilities to generate dynamic forms.

## Usage

    PM> Install-Package FormCore

Let your EF Context class inherit from `FormCore.Context` and add migrations.

    PM> add-migration

Revise the migration file that was automatically generated, removing foreign key constraints.

Finally apply the migration against your database,

    PM> update-database

## Running the Sample code

First `cd` into `Sample`.

### Create a DB in MSSQL

Name the DB as `form_core_csharp`. Note that the default connection string is

    server=(local);Trusted_Connection=true;Integrated Security=SSPI;Connection Timeout=120;database=form_core_csharp

You could add the following section to `<configuration />` of `Web.config` if you wanted to change the DB connection string.

    <appSettings>
      <add key="ConnectionString" value="server=(local);Trusted_Connection=true;Integrated Security=SSPI;Connection Timeout=120;database=form_core_csharp" />
    </appSettings>

### Migrate DB

    cd Sample\backend\bin
    ..\..\..\packages\EntityFramework.6.2.0\tools\migrate.exe FormCoreSample.dll /startUpDirectory=. /verbose

### Start the back-end app via port 81

Load the solution file `form_core_csharp.sln` in VS. Change the Debug settings and start debugging.
Make sure that http://localhost:81/ is reachable by the front end app.

Note that http://localhost:81/ itself should return HTTP Error 403.14 - Forbidden.

### Restore YARN packages

    cd frontend
    yarn

### Start the frontend development server

Make sure that you are in the `frontend` directory and execute the following command

    yarn start

### Access the front-end app via port 8881

Open your browser and navigate to http://localhost:8881

## License

MIT
