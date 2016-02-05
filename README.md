# node-cassandra-demo
Demo - create login form with Cassandra DB.
##Quick start
1. Clone - `git clone git@github.com:manhtt23091992/node-cassandra-demo.git`
1. Install Cassandra => http://cassandra.apache.org/download/
2. Create Keyspace with name "nodetest"
3. Open `/scripts/database.js`. Then changing connectionstring with your cassandra connection. It will create table, function, insert data automatically
4. Run command `node database.js`
5. Open `/routes/index.js` and changing connectionstring
6. Run app with command `npm start`
7. Login with username: admin and password: 123456

![main](https://raw.githubusercontent.com/manhtt23091992/node-postgresql-demo/master/public/admin/images/login.PNG)
##Note
*Using module
  ```javascript
  "body-parser": "~1.13.2",
    "cookie-parser": "~1.3.5",
    "debug": "~2.2.0",
    "express": "~4.13.1",
    "jade": "~1.11.0",
    "morgan": "~1.6.1",
    "serve-favicon": "~2.3.0"
    ```;
  
