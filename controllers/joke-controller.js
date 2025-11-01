// Name: Matthew Burden
// Date: 11/01/2025
// CSC 372-01

// This is the joke controller that handles requests related to jokes.

"use strict";
const model = require("../models/joke-model.js");

/**
 * Fetches joke categories.
 * @param {*} req 
 * @param {*} res 
 */
async function fetchJokeCategories(req, res) {
    try {
        const categories = await model.getCategories();
        res.status(200).json({ categories: categories });
    }
    catch (error) {
        console.error("Error fetching joke categories:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

/**
 * Fetches jokes by category.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function fetchJokesByCategory(req, res) {
    try {
        const category = req.params.category;
        const limit = parseInt(req.query.limit) || 10;

        if(category !== "funny" && category !== "lame"){
            return  res.status(400).json({ error: "Invalid category. Must be 'funny' or 'lame'" });
        }

        const jokes = await model.getJokesByCategory(category, limit);
        res.status(200).json({ jokes: jokes });
    }
    catch (error) {
        console.error("Error fetching joke categories:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

/**
 * Fetches a random joke.
 * @param {*} req 
 * @param {*} res 
 */
async function fetchRandomJoke(req, res) {
    try {
        const joke = await model.getRandomJoke();
        res.status(200).json({ joke: joke });
    }
    catch (error) {
        console.error("Error fetching random joke:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

/**
 * Adds a new joke.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function addJoke(req, res) {
    try {
        const { setup, delivery, joke_type } = req.body;

        if(!setup){
            return res.status(400).json({ error: "Setup is required" });
        }
        if(!delivery){
            return res.status(400).json({ error: "Delivery is required" });
        }
        if(!joke_type){
            return res.status(400).json({ error: "Joke type is required" });
        }
        if(joke_type !== "funny" && joke_type !== "lame"){
            return res.status(400).json({ error: "Joke type must be either 'funny' or 'lame'" });
        }
        const newJoke = await model.addJoke(setup, delivery, joke_type);
        res.status(201).json({ jokes: newJoke });
    }
    catch (error) {
        console.error("Error adding new joke:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = {
    fetchJokeCategories,
    fetchJokesByCategory,
    fetchRandomJoke,
    addJoke
};