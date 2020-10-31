var express = require("express");
var app = express();
const path = require("path");
var passport = require("passport");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var LocalStrategy = require("passport-local");
//var passportLocalMongoose = require("passport-local-mongoose");
require('dotenv').config();

var User = require("./models/user");
//var expressSession = require("express-session");
//var Campground = require("./models/campgrounds");

var methodOverride = require("method-override");
//var Comment = require("./models/comments");

// ** WARNING ! Cette version de l'App n'utilise que "chapter.route" !!! Les autres routes, views et models sont conservés pour des tests de développements en cours..
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    chapterRoutes = require("./routes/chapter.route"),
    authRoutes = require("./routes/index");

// ** Connexion Mongo
const uri = process.env.ATLAS_URI;
mongoose
  .connect(
    uri,
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connecté à MongoDb Atlas");
  })
  .catch((err) => {
    console.log("Erreur ! : ", err.message);
  });

app.use(bodyParser.urlencoded({
  extended: true
}));

// Gère les requêtes des views aux layouts EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "Views"));

// A définir
app.use(express.static(__dirname + "/public"));
// A définir
app.use(methodOverride("_method"));
// A définir
app.use(flash());

// PASSPORT CONFIG
app.use(
  require("express-session")({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());

app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());

passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use(commentRoutes);
app.use(campgroundRoutes);
app.use(chapterRoutes);
app.use(authRoutes);


app.listen(process.env.PORT || 3000, () => {
  console.log("Serveur en marche PORT 3000");
});
