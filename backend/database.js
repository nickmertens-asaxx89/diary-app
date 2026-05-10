const sqlite3 = require("sqlite3").verbose();

// Create or open database file
const db = new sqlite3.Database("./database.db");

// Create table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      date TEXT NOT NULL
    )
  `);
});

module.exports = db;