

# Prerequisites

To run this application, you will need to install:

* [npm](https://docs.npmjs.com/getting-started/installing-node)
* [gulp](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md)
* [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

# One time set up

Download the source code to a new directory, then cd to that directory:

```
git clone https://github.com/avitevet/udacity-meetup avitevet-udacity-meetup
cd avitevet-udacity-meetup
```

Install the dependencies

```
npm install
```

# Start the application

## Development mode

Start the web server and open a browser window to the front page of the application:

```
gulp serve
```

## Production mode

Start the web server and open a browser window to the front page of the application:

```
gulp serve:dist
```

# Notable aspects of the application

## Persistence of data

The data is persisted in sessionStorage, therefore all entered data will be lost
when the browser window is closed.  

## Authentication

The "sign up" and "login" features are not secure so please do not reuse
a password from any secure service.

## Event creation

Please follow the (hopefully) clear workflow to create an event.

## Inviting guests

The application supports bulk email import, which allows users to (for example)
copy and paste a cc list from an email.

# License

This project is provided under the [MIT License](http://choosealicense.com/licenses/mit/)
