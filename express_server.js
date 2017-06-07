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

 function generateRandomString() {
   return Math.random().toString(36).substr(2,6);
 }


 function findURL(name){
   let foundURL;
   urlsDB.forEach((url) => {
     if(url.shorter == name) {
       foundURL = url;
     }
   });
   return foundURL;
 }

app.get("/urls", (request, response) => {
  let templateVars = {urls: urlsDB};
  response.render("urls_index", templateVars)
});

app.get("/urls/new", (request, response) => {
  response.render("urls_new");
});

app.get("/urls/:id", (request, response) => {
  let obj = findURL(request.params.id);
  response.render('urls_show', obj)
  // // find url from db
  // let url = findURL(request.params.id);
  //
  // if(!url) {
  //   response.status(404).send("Url Not Found");
  //   return;
  // }
  // // update name on output
  // url.original = request.body.original;
  //
  // const newDB = urlsDB.map((u) => {
  //   if(u.shorter == url.shorter){
  //     return url;
  //   }
  //   return u;
  // });
  // urlsDB = newDB;
  // response.redirect('/urls/' + reqquest.params.id);
});
//
// app.post("/urls/")

app.get("/u/:id", (request, response) => {
  //  let longURL = urlsDB.original[request.params.shortURL];
  //  let templateVars = {shortURL: request.params.id,
  //    longURL: urlsDB.original[request.params.id] };
   response.render("urls_show")
 });

//Add new url
app.post("/urls", (request, response) => {
  const newUrl = {
      shorter: generateRandomString(),
      original: request.body.longURL
  }
  urlsDB.push(newUrl);
  console.log(urlsDB);
  response.redirect(301, "/urls")
});

// Delete Url
app.post('/urls/:id/delete', (request, response) => {
  // find if url is in db
  const url = findURL(request.params.id);
  console.log(url);
  // if not found return a 404
  if(!url) {
    response.status(404).send(" URL not found!");
    return;
  }
  //remove from urlsDB
  const index = urlsDB.indexOf(url);
  urlsDB.splice(index, 1);

  //redirect to "/urls" index
  response.redirect(302,"/urls" )
});

// Update Url
app.post("/urls/:id/update", (request, response) => {
  // check if url in db
  const url = findURL(request.params.id);
  console.log(url);

  if(!url) {
    response.status(404).send('Url not found');
    return;
  }
  //if yes, then update original url
  url.original = request.body.name;
  //replace oringal url with new longURL
  const updatedDB = urlsDB.map((u) => {
    if(u.shorter == url.shorter) {
      return url;
    }
    return u;
  });

  urlsDB = updatedDB;

  response.redirect(302, "/urls")
 });

app.listen(PORT, () =>{
  console.log(`TinyApp is listening on port ${PORT}!`)
});
