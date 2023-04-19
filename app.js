//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lodash = require("lodash");
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/blogs')

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const posts = [];

const blogSchema = new mongoose.Schema({
  Title: {
    type: String,
    required: true
  },
  Body:{
    type: String,
    required: true
  }
})

const blog = mongoose.model('blog', blogSchema);

app.get("/", async function (req, res) {
  const allBlogs = await blog.find();
  res.render("home.ejs", {blogs: allBlogs, pageTitle: "Your Blogs"})
  
});

app.get("/about", function (req, res) {
  res.render("about.ejs", { pageTitle: "About", text: "This is about page" });
});

app.get("/contact", function (req, res) {
  res.render("contact.ejs", { pageTitle: "Contact", text: "This is contact page" });
});

app.get("/compose", function (req, res) {
  res.render("compose.ejs");
});

app.post("/compose", async function (req, res) {
  const addBlog = new blog({
    Title: req.body.newTitle,
    Body: req.body.newText,
  });
  // posts.push(blog);
  await addBlog.save();
  res.redirect("/");
  // mongoose.connection.close();
});

app.get("/posts/:id", async function (req, res) {
  const allBlogs = await blog.find({_id: req.params.id});
  allBlogs.forEach(blogList => {
      res.render("post.ejs", {blogs:allBlogs, pageTitle: blogList.Title, pageContent: blogList.Body})
  });
});

app.get("/posts/:id/:request", async function(req, res){
  const allBlogs = await blog.find({_id: req.params.id});
  if(req.params.request === "edit"){
    res.render("edit.ejs", {blogs: allBlogs})
  }
  if(req.params.request === "delete"){
    await blog.deleteOne({ _id: req.params.id});
    res.redirect("/")
  }
});

app.post("/update/:id", async function(req, res){
  // const allBlogs = await blog.find({_id: req.params.id});
  await blog.updateOne({ _id: req.params.id }, { Title: req.body.updatedTitle, Body: req.body.updatedBody });
  res.redirect("/")
})

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
