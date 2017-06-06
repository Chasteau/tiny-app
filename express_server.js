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

app.post("/urls", (request, response) => {
  console.log(generateRandomString());
  response.send("Ok");
});

function generateRandomString() {
  return Math.random().toString(36).substr(2,6);
}


app.listen(PORT, () =>{
  console.log(`Examine app listening on port ${PORT}!`)
})
