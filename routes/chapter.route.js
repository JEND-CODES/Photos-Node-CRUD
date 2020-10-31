var express = require("express");
var router = express.Router();
var Chapter = require("../models/chapter");
var middleware = require("../middleware");

// INDEX -> List of all chapters
router.get("/chapter", (req, res) => {
  //get all chapters from db
  Chapter.find({}, function (err, allChapters) {
    if (err) {
      console.log(err);
    } else {
      res.render("chapter/chapter", { chapters: allChapters });
    }
  });
});

// CREATE ->  Add a new chapter to DB (POST)
router.post("/chapter", middleware.isLoggedIn, (req, res) => {
  //get data from form add it to chapters array
  var title = req.body.title;
  var article = req.body.article;
  var image = req.body.image;
  var video = req.body.video;
  var author = req.body.author;
  var date = req.body.date;
  /*
  var author = {
    id: req.user._id,
    username: req.user.username,
  };
  */

  var newChapter = {
    title: title,
    article: article,
    image: image,
    video: video,
    author: author,
    date: date
  };

  // create a new chapter and save to db
  Chapter.create(newChapter, function (err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      console.log("Created Successfully");
      console.log(newlyCreated);
    }
  });

  res.redirect("/chapter");
});

// NEW -> Display Form to make a new chapter
router.get("/chapter/new", middleware.isLoggedIn, (req, res) => {
  res.render("chapter/new");
});

// SHOW ->  Shows info about one chapter
router.get("/chapter/:id", (req, res) => {
  Chapter.find({}, (err, allChapters) => {
    if (err) {
      console.log(err);
    } else {
      Chapter.findById(req.params.id)
        //.populate("comments")
        .exec((err, foundChapter) => {
          if (err) {
            console.log(err);
          } else {
            res.render("chapter/show", {
              chapter: foundChapter,
              currentUser: req.user,
              allChapters: allChapters,
            });
          }
        });
    }
  });
});

// EDIT -> Chapter
router.get(
  "/chapter/:id/edit", middleware.isLoggedIn, (req, res) => {
    Chapter.findById(req.params.id, (err, foundChapter) => {
      if (err) {
        console.log(err);
      }

      res.render("chapter/edit", { chapter: foundChapter });
    });
  }
);

// UPDATE -> Chapter
router.put(
  "/chapter/:id", 
  middleware.isLoggedIn,
  (req, res) => {
    Chapter.findByIdAndUpdate(
      req.params.id,
      req.body.chapter,
      (err, updatedChapter) => {
        if (err) {
          redirect("/chapter");
        } else {
          res.redirect("/chapter/" + req.params.id);
        }
      }
    );
  }
);

// DESTROY ROUTE -> Delete Chapter
router.delete(
  "/chapter/:id",
  middleware.isLoggedIn,
  (req, res) => {
    Chapter.findByIdAndRemove(req.params.id, (err) => {
      req.flash("success", "Chapter deleted successfully");
      res.redirect("/chapter");
    });
  }
);

module.exports = router;
