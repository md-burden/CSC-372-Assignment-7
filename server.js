// Name: Matthew Burden
// Date: 11/01/2025
// CSC 372-01

// This is the main server file that sets up the Express application.

"use strict";
const express = require("express");
const app = express();

const multer = require("multer");
app.use(multer().none());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

const jokeRoutes = require('./routes/jokes-route.js');


app.use('/jokebook', jokeRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log("Server listening on port: " + PORT + "!");
});