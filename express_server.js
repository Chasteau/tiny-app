const express = require("express");
const PORT = process.env.PORT || 8080;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const validator = require('validator');
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
//generate random string for user id and short url
 function generateRandomString() {
   return Math.random().toString(36).substr(2,6);
 }

// checks if url is in db and returns the url object
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
 function checkUserEmail(emailToCheck) {
   let userInDB;
   for(var id in usersDB){
    if(usersDB[id].email === emailToCheck) {
      return usersDB[id];
      }
    }
    return null;
 };

 // checks if user is in db, and returns userID
 function checkUserPass(emailToCheck, passToCheck, cb) {
  let userInDB = cb(emailToCheck);
  if (userInDB && userInDB.password === passToCheck) {
      return userInDB.id;
    }
    return false;
  };

// display urls index page
app.get("/urls", (request, response) => {
  let templateVars = {
    urls: urlsDB,
    userID: usersDB[request.cookies["user_id"]]
  };
  response.render("urls_index", templateVars)
});

//display page to add new url
app.get("/urls/new", (request, response) => {
  let templateVars = {
  userID: usersDB[request.cookies["user_id"]]
  };
  response.render("urls_new", templateVars);
});

//display specific short url and long url by id
app.get("/urls/:id", (request, response) => {
  let url = findURL(request.params.id);
  let templateVars = {
    userID: usersDB[request.cookies["user_id"]]
  };
  response.render('urls_show', {templateVars, url})
});

// show short url by id
app.get("/u/:id", (request, response) => {
  let templateVars = {
    userID: usersDB[request.cookies["user_id"]]
  };
   response.render("urls_show", templateVars)
 });

// render registration page
app.get("/register", (request, response) => {
  let templateVars = {
    userID: usersDB[request.cookies["user_id"]]
  };
  response.render("register", templateVars);
});

// render login page
app.get("/login", (request, response) => {
  let templateVars = {
    userID: usersDB[request.cookies["user_id"]]
  };
  response.render("login", templateVars);
});

//Add new url
app.post("/urls", (request, response) => {
  const newUrl = {
      shorter: generateRandomString(),
      original: request.body.longURL
  }
  urlsDB.push(newUrl);
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

  if(!url) {
    return response.status(404).send('Url not found');
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
     // check if email is empty empty string
     let emailEmpty = validator.isEmpty(request.body.email);
     // check if password is empty string
     let passwordEmpty = validator.isEmpty(request.body.password);

     if (emailEmpty || passwordEmpty) {
       return response.redirect(302, "/login")
     }
       //  // return userID for email and pass;
       //  // checkUserPass(emailToCheck, passToCheck, cb)
      let userId = checkUserPass(request.body.email,
        request.body.password, checkUserEmail);
        if(userId) {
          // set cookie "user_id" and redirect to urls page
           response.cookie("user_id", userId);
           return response.redirect(302, "/urls");
        }
      return response.redirect(302, "/login");
 });

 // log out user
 app.post('/logout', (request, response) => {
     response.clearCookie("user_id");
     response.redirect(302, '/login');
 });

 // user registration
 app.post('/register', (request, response) => {
   // check if email is empty empty string
   let emailEmpty = validator.isEmpty(request.body.email);
   // check if password is empty string
   let passwordEmpty = validator.isEmpty(request.body.email);

   if (emailEmpty || passwordEmpty) {
     return response.redirect(302, "/register")
   }
   // check if user exists in usersDB if yes then return, else
   let user = checkUserEmail(request.body.email);
    if (!user){
    // generate random user id using random string function
      let newUserId = generateRandomString();
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
