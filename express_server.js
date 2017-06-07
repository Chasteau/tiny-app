var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080;
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

let urlsDB = [
  {
    shorter: "b2xVn3",
    original: "http://www.lighthouselabs.ca"
  },
  {
    shorter: "b2xVn2",
    original: "http://www.google.com"
  }
];

 // function generateRandomString() {
 //   return Math.random().toString(36).substr(2,6);
 // }

app.get("/urls", (request, response) => {
  let templateVars = {urls: urlsDB};
  response.render("urls_index", templateVars)
})
//
// app.get("/urls/new", (request, response) => {
//   response.render("urls_new");
// })
//
// app.get("/urls/:id", (request, response) => {
//   let templateVars = {shortURl: request.params.id,
//     longURl: urlsDB.original[request.params.id] };
//   response.render("urls_show", templateVars);
// })
//
// app.get("/u/:shortURL", (request, response) => {
//    let longURL = urlsDB.original[request.params.shortURL];
//   response.redirect(longURL);
// })
//
// app.post("/urls", (request, response) => {
//   urlsDB[shorter] = generateRandomString();
//   urlsDB[original] = request.body.longURL;
//   response.redirect(301, "http://localhost:8080/urls/")
// });

app.listen(PORT, () =>{
  console.log(`Examine app listening on port ${PORT}!`)
})
