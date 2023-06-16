const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database(':memory:',(err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
  
    db.run("CREATE TABLE IF NOT EXISTS contactos (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, phone TEXT NOT NULL, email TEXT NOT NULL, comment TEXT NOT NULL, date TEXT NOT NULL, ip TEXT NOT NULL, country TEXT NOT NULL)");
  });
  
  module.exports = {
    insert: function (name, phone, email, comment, Datetime, myIP, country) {
        db.run("INSERT INTO contactos (name, phone, email,  comment, date, ip, country) VALUES (?, ?, ?, ?, ?, ?, ?)", [name, phone, email, comment, Datetime, myIP, country], function (err) {
            if (err) {
                return console.log(err.message);
            }
            // get the last insert id
            console.log(`A row has been inserted with rowid ${this.lastID}`);
        });
    },
    select: function (callback) {
        db.all("SELECT * FROM contactos", [], (err, rows) => {
            if (err) {
                throw err;
            }
            callback(rows);
        });
    }
  }