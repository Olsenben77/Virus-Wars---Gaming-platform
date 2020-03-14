# Project-2---Ben-Remy-Owen ---💊Virus Wars💊

## Table of contents

- [Application Interface](#Application-Interface)
- [User Story](#User-Story)
- [General Info](#General-Info)
- [Deployment](#Deployment)
- [Technologies](#Technologies)
- [Future Functionality](#Future-Functionality)
- [Summary](#Summary)
- [UML](#UML)
- [Database](#Database)
- [Bugs and Feature Requests](#Bugs-And-Feature-Requests)
- [Authors](#Authors)
- [License](#License)

## Application Interface

This is the main page after the user runs "npm run start" in their server. It gives them options to see highscores, game controls, or start the game. There are also links under the title to share their experience on social media.
![Home](assets/img/mainpage.png)

The highscores page shows user generated names and their best score at Virus Wars.
![Event](assets/img/highscore.png)

The controls page demonstrates how to play the game
![Pub](assets/img/controller.png)

The username page prompts the user to input their name, which will trigger the database when they are done playing.
![Dinner](assets/img/username.png)

The game page is the main feature of the application. User can play Virus Wars and see their score projected at the top of the screen.
![Dinner](assets/img/game.png)

## User Story

AS A player

I WANT to play through a side-scrolling platformer

SO THAT I can enjoy a seamless game experience

## General Info

"Virus Wars" is an interactive gaming application that leads the user through a series of instructional and informational pages on highscores and controls. It features an active database that saves a Username input and projects their alloted score after the game has been completed. The game itself is a side-scrolling canvas, where users click to jump and collect pills while avoiding viruses. This project features several express.handlebars pages, that are routed to the main server.js. The layout of the repository includes all of the needed files including the database schema where information is stored.

## Deployment

-Git clone and download the Repository "Project-2" from Github
-In terminal, cd to "Project 2" folder and npm install all of the dependencies
-In your Mysql workbench, create a database following the example in the "db" folder in VSCode
-Change the connection info in "connection.js" under the "config.js" folder to your information
-In terminal run using "npm run start"
-Local browser website will be: localhost:3000

## Technologies

Project is created with:

- [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)
- [Express-Handlebars](https://www.npmjs.com/package/express-handlebars)
- [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [JavaScript](https://www.javascript.com/)
- [Bootstrap](https://getbootstrap.com/)
- [Mysql](https://www.mysql.com/)
- [Phaser](https://phaser.io/)

## Future Functionality

-Added features to the Leaderboard table such as "platforms jumped" or a flag that denotes the user's country
-Additional obstacles within the game
-A shooting aspect
-Possible control schema with more options -
-We are running into problems coming up with all the tests, mostly because we got most of the game we developed from a 3rd party, and we got the impression that testing routes with sequalize was not a direction we should go. We want to keep polishing at this point but didn't want to overlook the importance of testing.

## Summary

- "Virus Wars" is a side scrolling platform game, leading the user to input their own data and effectively log their personal competitive progress.

## UML

- ![UML](assets/img/UML.png)

## Database

- This project was completed using Mysql workbench, populating the database with the user's ID, name, and score. We linked this database to JawsDB and is available as an application on Heroku.

## Bugs And Feature Requests

Have a bug or a feature request? Please contact us at "olsenben1992@gmail.com"

## Authors

- Owen Chanthala
- Remy Guts
- Ben Olsen

## License

- Open Source
- Created for the University of Washington Code-Boot Camp 2020: Project #2
