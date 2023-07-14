# IBM - Peripherals Loan

### Local Installation of the Web App

#### `Step 1` - clone the repo

```bash
$ git clone https://github.com/CarlosChivas/ibm-users.git
```

#### `Step 2` - install dependencies in the ibm-front, ibm-peripherals and ibm-users directories

```bash
$ npm install
```

#### `Step 3` - create .env file in the ibm-peripherals and ibm-users directories and add the following variables with your corresponding IBM DB2 Database connection information

```
DATABASE_STRING = "DATABASE=;HOSTNAME=;PORT=;PROTOCOL=;UID=;PWD=;Security="
JWT_SECRETKEY = ""
```
#### `Step 4` - run application

#### ibm-front
```bash
$ npm run start
```

#### ibm-peripherals and ibm-users
```bash
$ node .
```

ibm-front will be running on [http://localhost:4200](http://localhost:4200) and it should show the app login in the browser.

ibm-users will be running on [http://localhost:4000](http://localhost:4000) and it should show the message "ibm-users working!" in the browser.

ibm-peripherals will be running on [http://localhost:4001](http://localhost:4001) and it should show the message "ibm-peripherals working!" in the browser.
