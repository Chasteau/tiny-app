var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080;

app.set("view engine", "ejs");

var urlDatabase = {
  "b2xVn3" : "http://www.lighthouselabs.ca",
   "b2xVn2" : "http://www.google.com"
 };

app.get("/urls", (request, response) => {
  let templateVars = { urls: urlDatabase};
  response.render("urls_index", templateVars);
})

app.get("/urls/:id", (request, response) => {
  let templateVars = {shortURl: request.params.id, longURl: urlDatabase[request.params.id]  };
  response.render("urls_show", templateVars);
});

app.listen(PORT, () =>{
  console.log(`Examine app listening on port ${PORT}!`)
})
