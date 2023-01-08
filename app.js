const mongoose = require("mongoose");
const express = require("express");
const fileUpload = require("express-fileupload");
const methodOverride = require("method-override");
const photoControllers = require("./controllers/photoControllers");
const pageControllers = require("./controllers/pageControllers");
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
app.use(fileUpload());
app.use(
  methodOverride("_method", {
    methods: ["POST", "GET"],
  })
);

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});

//page_routes
app.get("/photo/edit/:id", pageControllers.getEditPage);
app.get("/about", pageControllers.getAboutPage);
app.get("/add", pageControllers.getAddPage);

//photo_routes
app.get("/photo/:id", photoControllers.getPhoto);
app.get("/", photoControllers.getAllPhotos);
app.put("/photo/:id", photoControllers.updatePhoto);
app.delete("/photo/:id", photoControllers.deletePhoto);
app.post("/add", photoControllers.createPhoto);
