"use strict";
const express = require("express");
const router = express.Router();
const controller = require("../controllers/jokeController.js");

router.get("/categories", controller.fetchJokeCategories);
router.get("/category/:category", controller.fetchJokesByCategory);
router.get("/random", controller.fetchRandomJoke);
router.post("/joke/add", controller.addJoke);
module.exports = router;