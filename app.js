//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
var lodash = require('lodash');
var lowerCase = require('lodash.lowercase');
const ejs = require("ejs");
const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1/blogWebDB");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const blogSchema=new mongoose.Schema({
  title:String,
  contentOfBlog:String,
  truncatedContent:String,
  linkOfContent:String
});

const blogPost=mongoose.model("blogPost",blogSchema);
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

function truncating(stringToBeminimized){
  if(stringToBeminimized.length>100){
    var newSrtring=stringToBeminimized.substring(0,101)+"...";
  }
  else{
    return stringToBeminimized;
  }
  return newSrtring;
}


app.get("/",function(req,res){

  blogPost.find(function(err,result){
    res.render("home",{
      content:homeStartingContent,
      totalPost:result,
    });
  })
})

app.get("/about",function(req,res){
  res.render("about",{
    content:aboutContent,
  });
})

app.get("/contact",function(req,res){
  res.render("contact",{
    content:contactContent,
  });
})


app.get("/compose",function(req,res){
  res.render("compose");
})

app.post("/compose",function(req,res){

  var a=truncating(req.body.composePost);
  var link="/posts/"+req.body.contentTitle;
  
  const blogPost1=new blogPost({
    title:req.body.contentTitle,
    contentOfBlog:req.body.composePost,
    truncatedContent:a,
    linkOfContent:link
  });
  blogPost1.save();
  res.redirect("/");
});


//express routing parameters

app.get("/posts/:idOfPost",function(req,res){
  var a=req.params.idOfPost
  blogPost.findOne({_id:a},function(err,result){
    var temp1=result.contentOfBlog.split("\r\n");
      res.render("post",{
        titleOfThePost:result.title,
        content:temp1,
        id:a
      });
  });
});

app.post("/posts/:idOfPost",function(req,res){
  var a=req.params.idOfPost
  blogPost.deleteOne({_id:a},function(err){
    // console.log("Success");
  });
  res.redirect("/");
});

app.get("/posts/editPost/:idOfPost",function(req,res){
  var a=req.params.idOfPost
  blogPost.findOne({_id:a},function(err,result){
    res.render("editPost",{
      temp:result,
      id:a
    });
  });
});

app.post("/posts/editPost/:idOfPost",function(req,res){
  var a=req.params.idOfPost
  var newtitle=req.body.contentTitle;
  var newContent=req.body.composePost;
  blogPost.updateMany({_id:a},{$set: {title:newtitle,contentOfBlog:newContent}},function(res){
    console.log("Success");
  });
  // console.log('<pre>'+newContent+'</pre>')
  res.redirect("/");
});



app.listen(4000, function() {
  console.log("Server started on port 4000");
});
