const Photo = require("../models/Photo");
const fs = require("fs");

exports.getAllPhotos = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = 3;
  const countPromise = Photo.countDocuments(); //total photos
  const skip = (page - 1) * perPage;
  const photosPromise = Photo.find()
    .skip(skip)
    .limit(perPage)
    .sort({ dateCreated: "desc" });
  const [photos, count] = await Promise.all([photosPromise, countPromise]);
  const pages = Math.ceil(count / perPage);
  if (!photos.length && skip) {
    res.redirect(`/page/${pages}`);
    return;
  }
  res.render("index", {
    photos, //photos
    page, //current page
    pages, //total pages
    count, //total photos
  });
};

exports.getPhoto = async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  res.render("photo", {
    photo,
  });
};

exports.createPhoto = async (req, res) => {
  const uploadDir = "public/uploads";

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  let uploadImage = req.files.image;
  let uploadPath = __dirname + "/../public/uploads/" + uploadImage.name;

  uploadImage.mv(uploadPath, async () => {
    await Photo.create({
      ...req.body,
      image: "/uploads/" + uploadImage.name,
    });
    res.redirect("/");
  });
};

exports.deletePhoto = async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id }); //find the photo
  let deletedImage = __dirname + "/../public" + photo.image; //get the image path
  fs.unlinkSync(deletedImage);
  await Photo.findByIdAndRemove(req.params.id);
  res.redirect("/");
};

exports.updatePhoto = async (req, res) => {
  let photo = await Photo.findById(req.params.id);
  photo.title = req.body.title;
  photo.description = req.body.description;
  await photo.save();
  res.redirect(`/photo/${photo.id}`);
};
