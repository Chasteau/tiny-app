// require module
const express = require("express");
const PORT = process.env.PORT || 8080;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cookieSession = require('cookie-session');
const validator = require('validator');
const bcrypt = require('bcrypt');
const app = express();

// initialiaze middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cookieSession({
  name: 'user_id',
  keys: ["Key1"],
}));
app.set("view engine", "ejs");

// urls database
const urlsDB = [
  {
    shorter: "b2xVn3",
    original: "http://www.lighthouselabs.ca",
    userID: "user1"
  },
  {
    shorter: "b2xVn2",
    original: "https://www.google.com",
    userID: "user2"
  }
];

const pass1 = "purple";
const hashed_pass1 = bcrypt.hashSync(pass1, 10);
const pass2 = "funk";
const hashed_pass2 = bcrypt.hashSync(pass2, 10);
// Users database
const usersDB = {
  "user1": {
    id: "user1",
    email: "user1@x.com",
    password: hashed_pass1
  },
 "user2": {
    id: "user2",
    email: "user2@x.com",
    password: hashed_pass2
  }
}

// Error messages
const errorMessage =  {
  login: "Please check email or password!"
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
  if(userInDB) {
    if ((bcrypt.compareSync(passToCheck, userInDB.password)) &&
    (!(bcrypt.compareSync(passToCheck, "This-Returns-Fake")))) {
      return userInDB.id;
      }
    }
    return false;
  };

// check urls for userId return urls object
function urlsForUser(id) {
  let usersURL = [];
  urlsDB.forEach((url) => {
    if(url.userID == id) {
      usersURL.push(url);
    }
  });
  return usersURL;
}

// display urls index page
app.get("/urls", (request, response) => {
  //check user id, and show users list alone
  if(!request.cookies) {
    return response.redirect(302,"/login");
  }
  let templateVars = {
    urls: urlsForUser(request.session.user_id),
    userID: usersDB[request.session.user_id]
  };
  response.render("urls_index", templateVars)
});

//display page to add new url
app.get("/urls/new", (request, response) => {
  //check user id, and show users list alone
  if(!request.session.user_id) {
    return response.redirect( 302,"/login");
  }
  let templateVars = {
    urls: urlsForUser(request.session.user_id),
    userID: usersDB[request.session.user_id]
    }
    return response.render("urls_new", templateVars);
});

// show short url by id
app.get("/u/:id", (request, response) => {
  urlsDB.forEach( (url) => {
    if(request.params.id == url.shorter) {
    return response.redirect(302, url.original);
    }
  });
    return response.status(404).send("404 Error <br><strong>URL Not Found!</strong>");
 //  let templateVars = {
 //    urls: urlsForUser(request.session.user_id),
 //    userID: usersDB[request.session.user_id]
 //  };
 //   response.render("urls_show", templateVars)
 // });
 });

// render registration page
app.get("/register", (request, response) => {
  let templateVars = {
    userID: usersDB[request.session.user_id]
  };
  response.render("register", templateVars);
});

// render login page
app.get("/login", (request, response) => {
  if(request.session.user_id) {
    // let templateVars = {
    //   userID: usersDB[request.cookies["user_id"]]
    // };
    return response.redirect(302, "/urls");
  }
  return response.render("login", {userID: null});
});

//display specific short url and long url by id
app.get("/urls/:id", (request, response) => {
  if(!request.cookies) {
    return response.redirect(302, "/urls");
  } let templateVars = {
    urls: urlsForUser(request.session.user_id),
    userID: usersDB[request.session.user_id]
  }
    return response.render('urls_show', templateVars)
});

//Add new url
app.post("/urls", (request, response) => {

  //check if input is empty string -> else redirect to same page
  let checkForEmpty = validator.isEmpty(request.body.longURL);
  if(checkForEmpty) {
    return response.redirect(302,"/urls/new");
  }
  //check if inpur is valid url .com/.ca etc -> else redirect to same page
  let chechIfValidURL = validator.isURL(request.body.longURL);
  if(!chechIfValidURL) {
    return response.redirect(302,"/urls/new");
  }
  //check if input is empty string -> else add to valid url
  let checkForHTTPS = validator.contains(request.body.longURL,"https://");
  let checkForWWW = validator.contains(request.body.longURL,"www");
  let validURL;
  if(checkForHTTPS && checkForWWW) {
    validURL = request.body.longURL;
  } else if(!checkForHTTPS && !checkForWWW){
    validURL = `https://www.${request.body.longURL}`
  } else if(!checkForHTTPS) {
    validURL = `https://${request.body.longURL}`
  } else {
    validURL = request.body.longURL;
  }
  //add new url to db -> redirect to urls page
  let newUrl = {
      shorter: generateRandomString(),
      original: validURL,
      userID: request.session.user_id
  }
  urlsDB.push(newUrl);
  response.redirect(301, "/urls")
});

// Delete Url
app.post('/urls/:id/delete', (request, response) => {
  // check if user logged in

  // check which user url belongs to user id

  // find if url is in db
  let url = findURL(request.params.id);

  // if not found return a 404
  if(!url) {
    response.status(404).send(" URL not found!");
    return;
  }
  //remove from urlsDB
  let index = urlsDB.indexOf(url);
  urlsDB.splice(index, 1);
  //redirect to "/urls" index
  response.redirect(302,"/urls" )
});

// Update Url
app.post("/urls/:id/update", (request, response) => {
  // check if url belongs to users
  if(!request.cookies) {
    return response.redirect(302,"/urls" );
  }
  // Check if empty, then return to urls
  let checkForEmpty = validator.isEmpty(request.body.name);
  if(checkForEmpty) {
    return response.redirect(302,"/urls");
  }
  // check if url in db
  let url = findURL(request.params.id);
  if(!url) {
    return response.status(404).send('Url not found');
  }
  //if yes, then update original url
  url.original = request.body.name;
  response.redirect(302, "/urls")
 });

// user login
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
          request.session.user_id = userId;
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
       id: newUserId,
       email: request.body.email,
       //generate cryto pass
       password: bcrypt.hashSync(request.body.password, 8)
     }
     // generate an example url for new user
    let newUrl = {
         shorter: generateRandomString(),
         original: "https://www.example.com" ,
         userID: newUserId
     }
     urlsDB.push(newUrl);
      // set cookie "user_id"  and redirect to urls page
      request.session.user_id = newUserId;
     return response.redirect(302, "/urls");
   } return response.redirect(302, "/urls");
 });

// turn on server on port and display message to console
app.listen(PORT, () =>{
  console.log(`TinyApp is listening on port ${PORT}!`)
});
