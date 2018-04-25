# Form Core C\#

C# + React implementation of https://github.com/rails-engine/form_core -- a Rails engine providing ability to generate dynamic form.

## Getting Started

### Create a DB in MSSQL

Name the DB as `form_core_csharp`. Note that the default connection string is

    server=(local);Trusted_Connection=true;Integrated Security=SSPI;Connection Timeout=120;database=form_core_csharp

### Migrate DB

    cd backend\bin
    ..\packages\EntityFramework.6.2.0\tools\migrate.exe form_core_csharp.dll /startUpDirectory=. /verbose

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
