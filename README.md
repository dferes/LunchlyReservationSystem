## Lunchly

A simple app for making reservations, built with Node.js, Express, PostgreSQL, Nunjucks, HTML and CSS.

Deployed with heroku here: https://dylan-feres-lunchly.herokuapp.com/


## Installation and Setup Instructions

Clone this repository. You will need `node`, `npm` and `postgresql` installed globally on your machine.

Installation:

`npm install`  

To create the database: 

`createdb lunchly`

To create the test database: 

`createdb lunchly_test`

To seed the database (make sure you are in the root directory):

`psql lunchly < data.sql`

To start the server:

`npm start`  

To run the tests:

`jest -i`  

To visit the app (at http://localhost:3000/):

`npm start`  
