var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080;
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

var urlDatabase = {
  "b2xVn3" : "http://www.lighthouselabs.ca",
   "b2xVn2" : "http://www.google.com"
 };

app.get("/urls", (request, response) => {
  let templateVars = { urls: urlDatabase};
  response.render("urls_index", templateVars);
})

app.get("/urls/new", (request, response) => {
  response.render("urls_new");
});

app.get("/urls/:id", (request, response) => {
  let templateVars = {shortURl: request.params.id,
    longURl: urlDatabase[request.params.id] };
  response.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (request, response) => {
   let longURL = urlDatabase[request.params.shortURL];
  response.redirect(longURL);
});

app.post("/urls", (request, response) => {
  urlDatabase[generateRandomString()] = request.body.longURL;
  response.redirect(301, "http://localhost:8080/urls/")});

function generateRandomString() {
  return Math.random().toString(36).substr(2,6);
}

app.listen(PORT, () =>{
  console.log(`Examine app listening on port ${PORT}!`)
})
