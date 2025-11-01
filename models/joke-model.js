// Name: Matthew Burden
// Date: 11/01/2025
// CSC 372-01

// This is the joke model that handles database operations related to jokes.

"use strict";
const pool = require("./db.js");

/**
 * Fetches joke categories.
 * @returns A promise that resolves to the joke categories.
 */
async function getCategories() {
    const query = 'SELECT DISTINCT joke_type FROM jokes';
    const result = await pool.query(query);
    return result.rows;
}

/**
 * Fetches jokes by category.
 * @param {*} category The category of jokes to fetch.
 * @param {*} limit The maximum number of jokes to fetch.
 * @returns A promise that resolves to the jokes in the specified category.
 */
async function getJokesByCategory(category, limit) {
    const query = 'SELECT * FROM jokes WHERE joke_type = $1' + (limit ? ' LIMIT $2' : '');
    const values = [category];
    if (limit) {
        values.push(limit);
    }

    const result = await pool.query(query, values);
    return result.rows;
}

/**
 * Fetches a random joke.
 * @returns A promise that resolves to a random joke.
 */
async function getRandomJoke() {
    const query = 'SELECT * FROM jokes ORDER BY RANDOM() LIMIT 1';
    const result = await pool.query(query);
    return result.rows;
}

/**
 * Adds a new joke.
 * @param {*} setup Setup of the joke.
 * @param {*} delivery Delivery of the joke.
 * @param {*} joke_type Type of the joke (e.g., "funny", "lame").
 * @returns A promise that resolves to the newly added joke.
 */
async function addJoke(setup, delivery, joke_type) {
    const query = 'INSERT INTO jokes (setup, delivery, joke_type) VALUES ($1, $2, $3) RETURNING *';
    const values = [setup, delivery, joke_type];
    const result = await pool.query(query, values);
    return getJokesByCategory(joke_type);
}

module.exports = {
    getCategories,
    getJokesByCategory,
    getRandomJoke,
    addJoke
};