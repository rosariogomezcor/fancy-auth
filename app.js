var express = require("express"), 
	mongoose = require("mongoose"), 
	passport = require("passport"), 
	bodyParser = require("body-parser"), 
	LocalStrategy = require("passport-local"), 
	passportLocalMongoose = require("passport-local-mongoose"); 

mongoose.connect("mongodb://localhost/fancy_auth", {useNewUrlParser: true}); 	

var app = express(); 

app.set('view engine', 'ejs'); 
app.use(bodyParser.urlencoded({extended: true})); 

app.use(require("express-session")({
	secret: "Obra como si Epicuro estuviese vendo...", 
	resave: false, 
	saveUninitialized: false
})); 


// =========================================================================================
//                                       ROUTES
// =========================================================================================

app.get("/", function(req, res) {
	res.render("home"); 
}); 



app.listen(3000, function() {
	console.log("Server is listening..."); 
}); 