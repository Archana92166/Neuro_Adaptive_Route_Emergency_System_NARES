const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/ping", (req, res) => {
  res.json({ ok: true });
});

app.post("/api/navigation/routes", (req, res) => {
  res.json({ routes: [] });
});

module.exports = app;
