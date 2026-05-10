const express = require("express");
const cors = require("cors");
const db = require("./database");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

/*
  GET all entries
*/
app.get("/entries", (req, res) => {
  db.all("SELECT * FROM entries ORDER BY id DESC", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

/*
  POST new entry
*/
app.post("/entries", (req, res) => {
  const { text } = req.body;
  const date = new Date().toLocaleString();

  db.run(
    "INSERT INTO entries (text, date) VALUES (?, ?)",
    [text, date],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({
        id: this.lastID,
        text,
        date
      });
    }
  );
});

app.put("/entries/:id", (req, res) => {
    const { id } = req.params;
    const { text } = req.body;
  
    db.run(
      "UPDATE entries SET text = ? WHERE id = ?",
      [text, id],
      function (err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
  
        res.json({ message: "Entry updated successfully" });
      }
    );
  });

  app.delete("/entries/:id", (req, res) => {
    const { id } = req.params;
  
    db.run(
      "DELETE FROM entries WHERE id = ?",
      [id],
      function (err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
  
        res.json({ message: "Entry deleted successfully" });
      }
    );
  });

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});