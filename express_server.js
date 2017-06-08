const express = require("express");
const PORT = process.env.PORT || 8080;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set("view engine", "ejs");

const urlsDB = [
  {
    shorter: "b2xVn3",
    original: "http://www.lighthouselabs.ca"
  },
  {
    shorter: "b2xVn2",
    original: "http://www.google.com"
  }
];

const usersDB = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}

 function generateRandomString() {
   return Math.random().toString(36).substr(2,6);
 }

// checks if url is in db and returns the object with url
 function findURL(name){
   let foundURL;
   urlsDB.forEach((url) => {
     if(url.shorter == name) {
       foundURL = url;
     }
   });
   return foundURL;
 }

 // checks if user is in db, and returns user object
 function isUser(emailToFind) {
   let userInDB;
   for(var id in usersDB){
    if(usersDB[id].email === emailToFind) {
      userInDB = true;
      } else {
        userInDB = false;
      }
    }
   return userInDB;
 };

app.get("/urls", (request, response) => {
  let templateVars = {
    urls: urlsDB,
    username: request.cookies["username"]
  };
  response.render("urls_index", templateVars)
});

app.get("/urls/new", (request, response) => {
  let templateVars = {
  username: request.cookies["username"]
  };
  response.render("urls_new", templateVars);
});

app.get("/urls/:id", (request, response) => {
  let user = findURL(request.params.id);
  let templateVars = {
    username: request.cookies["username"]
  };
  response.render('urls_show', {templateVars, user})
});

app.get("/u/:id", (request, response) => {
  let templateVars = {
    username: request.cookies["username"]
  };
   response.render("urls_show", templateVars)
 });

// render registration page
app.get("/register", (request, response) => {
  // let templateVars = {
  // username: request.cookies["username"]
  // };
  response.render("register");
});

//Add new url
app.post("/urls", (request, response) => {
  const newUrl = {
      shorter: generateRandomString(),
      original: request.body.longURL
  }
  urlsDB.push(newUrl);
  //console.log(urlsDB);
  response.redirect(301, "/urls")
});

// Delete Url
app.post('/urls/:id/delete', (request, response) => {
  // find if url is in db
  const url = findURL(request.params.id);
  // console.log(url);
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
  //console.log(url);

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

 app.post('/login', (request, response) => {
   // set cookie using res.cookie without using options.
   // display username input back to the user
   response.cookie("username", request.body.username);
   // redirect user to urls page
   response.redirect(302, '/urls');

 });

 // log out users
 app.post('/logout', (request, response) => {
     response.clearCookie("username");
     response.redirect(302, '/urls');
 });

 // user registration
 app.post('/register', (request, response) => {
   let user = isUser(request.body.email);
   // check if user exists in usersDB if yes then return, else
   if(!user){
    // generate random user id using random string function
    newUserId = generateRandomString();
     //add newuser to usersDB (email, pass, userid)
     usersDB[newUserId] = {
       Id: newUserId,
       email: request.body.email,
       password: request.body.password
     }
      // set cookie "user_id"  and redirect to urls page
      response.cookie("user_id", newUserId);
     return response.redirect(302, "/urls");
   } return response.redirect(302, "/urls");
 });

app.listen(PORT, () =>{
  console.log(`TinyApp is listening on port ${PORT}!`)
});
