const mysql = require('mysql');

const conn = mysql.createConnection({
  host: "voip.bankstreet.gompels.com",
  port: "3306",
  user: "admin",
  password: "k1QP4ulgawAmQlFV0uT6WGbPXSKPnfrkZuqPr2KTJBXWzNbYaaTJUoRGuwwaHP67XDzQo9h6z93GFsk3pPWXqxVyBAfNcQW1kT8Bn7Zq5kqUmsKprpmmUGx5elCzd8ha",
  database: "qstats"
});

conn.connect(function(err){
  if(err) throw err;
  console.log("Connected Successfully!");
});

global.conn = conn;
