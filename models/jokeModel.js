"use strict";
const pool = require("./db.js");

async function getCategories() {
    const query = 'SELECT DISTINCT joke_type FROM jokes';
    const result = await pool.query(query);
    return result.rows;
}

async function getJokesByCategory(category, limit) {
    const query = 'SELECT * FROM jokes WHERE joke_type = $1 LIMIT $2';
    const values = [category, limit];
    const result = await pool.query(query, values);
    return result.rows;
}

async function getRandomJoke() {
    const query = 'SELECT * FROM jokes ORDER BY RANDOM() LIMIT 1';
    const result = await pool.query(query);
    return result.rows;
}

async function addJoke(setup, delivery, joke_type) {
    const query = 'INSERT INTO jokes (setup, delivery, joke_type) VALUES ($1, $2, $3) RETURNING *';
    const values = [setup, delivery, joke_type];
    const result = await pool.query(query, values);
    return result.rows[0];
}

module.exports = {
    getCategories,
    getJokesByCategory,
    getRandomJoke,
    addJoke
};