# Minimalist Black and White TinnyApp Project 

TinnyApp is a fullstack web application build with Node and Express JS. 
It allows users to create an account, login. 
Account passwords and cookie sessions are secured using hashing via bcrypt module.
After login users can add URLs to their account and recieve a shortened URL.
Users can veiw a list of all the URLS associated with their unique ID, 
edit and update all urls in their account.
Finally, users can share shortened url links with friends, to be redirected 
to the desired URL.

# Screenshots

[![Screen Shot 2017-06-11 at 3.58.15 PM.png](https://s16.postimg.org/eqo7h5xd1/Screen_Shot_2017-06-11_at_3.58.15_PM.png)](https://postimg.org/image/cm3ug2vq9/)

[![Screen Shot 2017-06-11 at 4.00.19 PM.png](https://s14.postimg.org/sajabhbu9/Screen_Shot_2017-06-11_at_4.00.19_PM.png)](https://postimg.org/image/k518dbnl9/)

# Dependencies
* Node.js
* Express
* EJS
* bcrypt
* body-parser
* cookie-parser
* cookie-sessions
* validator

## Getting Started

* Install all dependences (using the `npm install` command).
* Run the dev web server using the 'npm start` or `node express_server.js` commands.
