var mysql = require('mysql');
var connection = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'1234',
  database:'opentutorials'
});

connection.connect();

module.exports = connection;
