const express = require("express");
const path = require("path");
const ejs = require("ejs");
const app = express();
const port = 3000;

//template engine
app.set("view engine", "ejs");

//middlewares
app.use(express.static("public"));

//routes
app.get("/", (req, res) => {
  res.render("index");
});
app.get("/about", (req, res) => {
  res.render("about");
});
app.get("/add", (req, res) => {
  res.render("add");
});

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
