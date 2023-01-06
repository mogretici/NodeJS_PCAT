const mongoose = require("mongoose");
const express = require("express");
const ejs = require("ejs");
const path = require("path");
const Photo = require("./models/Photo");

const app = express();
const port = 3000;

//dbConnect
mongoose.set("strictQuery", false);
mongoose.connect("mongodb://localhost/pcat-test-db");

//templateEngine
app.set("view engine", "ejs");

//middlewares
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//routes
app.get("/", async (req, res) => {
  const photos = await Photo.find();
  res.render("index", {
    photos,
  });
});
app.get("/about", (req, res) => {
  res.render("about");
});
app.get("/add", (req, res) => {
  res.render("add");
});
app.get("/photo/:id", async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  res.render("photo", {
    photo,
  });
});
app.post("/add", async (req, res) => {
  await Photo.create(req.body);
  res.redirect("/");
});
app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
