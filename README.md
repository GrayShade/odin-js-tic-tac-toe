# odin-js-tic-tac-toe

## Description

This is a game project made using vanilla technologies HTML, CSS & JavaScript. Module patterns  It is part of [The Odin Project](https://www.theodinproject.com/). At the time of writing, link for this particular project is [Project: Tic Tac Toe](https://www.theodinproject.com/lessons/node-path-javascript-tic-tac-toe).

## File Structure

It consists of an index file `index.html` as starting point of project that links html, CSS & JS files too. `styles` folder in root directory contains CSS files. One is `styles.css` for styles & other is `reset.css` serving as a css reset file for styles. `javascript` folder contains javascript files. There are also `images` & `fonts` directories.

## How it Works

When the page is loaded, first all event listeners are set up for first & only time. User has to click on `NEW GAME` for the game to begin. User is presented with a form asking for player names. For now, there is no option for AI to play. This is a game just between human players. During entering values & after submitting form, values are validated. If values satisfy validation, game is started with a random user among two. Users have the option to select a move on board as well as end game prematurely as well as replay game after a draw or win etc. Necessary checks have been implemented to prevent same position moves, making moves after gaming ending etc etc. Once a game is ended via explicitly choosing to quit or a player wins or its a draw, no more moves are allowed & result is displayed.

Talking about internal working, when the game page is loaded, first all event listeners are called from an `IIFE(Immediately Invoked Function Expression)`. After that `module patterns(Factory Fucntions in IIFE)` are run automatically to create three main objects `boardObj`, `displayObj`, `gameObj` & `validationObj`. Coming from OOP perspective, these main objects work like classes. Using module patterns also secure the main factory functions as further objects can't be instantiated from factory functions. Above mentioned module patterns also house other functions, factory functions, variables etc. A few of event listeners can call functions inside game object, which is also the main object for controlling the flow of game. No other objects can communicate to each other directly. Game Object `gameObj` directs all other objects. Almost all functions are written as function expressions, does not matter factory functions or not, not for any particular reason though.

## Thouhts

Through this project, I incorporated factory functions, module patterns & IIFE's for the first time. Although I must say, classes in JS, even though they were only syntactic sugar for prototypes, are quite easier to work with than factory functions personally. In classes, I didn't  worry about what to keep in module patterns, factory functions & what not etc. Just made classes & put functions in it, either public or private. Making class functions private was just a matter of using `#` before them. Though its a personal & opinionated choice, as all things in life often are. Nonetheless, it is quite a pleasure to be introduced to factory functions & module patterns, specially for privacy & ease to create objects reasons. This syntax used elsewhere will be strange no more.  

## Future Ideas / Intentions

- Option for an AI player
- Sound effects on game results etc
- CSS Animations on certain actions.
