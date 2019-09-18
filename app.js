// =========================================================================================
//                                       BASIC APP SETUP
// =========================================================================================

var express = require("express"), 
	mongoose = require("mongoose"), 
	passport = require("passport"), 
	bodyParser = require("body-parser"), 
	User = require("./models/user"), 
	LocalStrategy = require("passport-local"), 
	passportLocalMongoose = require("passport-local-mongoose");

mongoose.connect("mongodb://localhost/fancy_auth", {useNewUrlParser: true, useUnifiedTopology: true}); 	

var app = express(); 

app.set('view engine', 'ejs'); 
app.use(bodyParser.urlencoded({extended: true})); 

// =========================================================================================
//                                       PASSPORT SETUP
// =========================================================================================

app.use(require("express-session")({
	secret: "Obra como si Epicuro estuviese viendo...", 
	resave: false, 
	saveUninitialized: false
})); 

app.use(passport.initialize());
app.use(passport.session());  

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());  
passport.deserializeUser(User.deserializeUser()); 

//Middleware to pass to all routes the current logged in user
app.use(function(req, res, next) {
	res.locals.currentUser = req.user; 
	next(); 
}); 

// =========================================================================================
//                                   ROUTES
// =========================================================================================

app.get("/", function(req, res) {
	res.render("home"); 
}); 

app.get("/secret", isLoggedIn, function(req, res) {
	res.render("secret"); 
}); 

//Sign Up Routes

//show signup form 
app.get("/register", function(req, res) {
	res.render("register");  
}); 

//handling user sign up
app.post("/register", function(req, res) {
	User.register(new User({username: req.body.username}), req.body.password, function(err, user) {
		if (err) {
			console.log(err); 
			return res.render("register"); 
		}
		passport.authenticate("local")(req, res, function() {
			res.redirect("secret"); 
		}); 
	}); 
}); 

//Login Routes

//show login form
app.get("/login", function(req, res) {
	res.render("login"); 
}); 

//handle login
app.post("/login", passport.authenticate("local", {
	successRedirect: "/secret", 
	failureRedirect: "/login"
}), function(req, res) {
}); 

//handle logout
app.get("/logout", function(req, res) {
	req.logout(); 
	res.redirect("/"); 
}); 


//Is Logged In? Check
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next(); 
	}  
	res.redirect("/login"); 
}

// =========================================================================================
//                                  SERVER LISTENING
// =========================================================================================

app.listen(3000, function() {
	console.log("Server is listening..."); 
}); 