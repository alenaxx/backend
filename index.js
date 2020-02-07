require('dotenv').config()

const express = require('express');
const fetch = require('node-fetch');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
const port = 3001;

String.prototype.alphaNumeric = function() {
    return this.replace(/[^a-z0-9A-ZА-Яа-я\-\ ]/gi,'');
};

const conn = mysql.createPool({
    host:  'onther6h.beget.tech',
    user: 'onther6h_weblab',
    database: 'onther6h_weblab',
    password: '123456'

}).promise();

app.get('/', (req, res) => {
    res.send('Backend work!');
});

app.get('/weather', (req, res) => {
    console.log(req.query.city);
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(req.query.city)}&appid=62f9557ec5538f764b5db71ca76f9a13&units=metric&lang=ru`)
        .then((response => response.json()))
        .then((text) => res.status(text.cod).send(text))
        .catch((e) => res.send(`Error:  ${e.toString()}`));

});

app.get('/weather/coordinates', (req, res) => {

    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${req.query.lat}&lon=${req.query.lon}&appid=62f9557ec5538f764b5db71ca76f9a13&units=metric&lang=ru`)
        .then((response => response.json()))
        .then((text) => res.status(text.cod).send(text))
        .catch((e) => res.send(`Error: ${e.toString()}`));
});

app.get('/favourites', (req, res) => {
    conn.query("SELECT * FROM `favoriteCities`")
        .then(result => {
            res.send(result[0]);
        })
        .catch((e) => res.status(500).send(e));
});

app.post('/favourites', (req, res) => {
    console.log();
    conn.execute('insert into `favoriteCities` (`NAME`) VALUES (?)', [req.body.city.alphaNumeric()])
        .then(() => res.send("200 OK POSTED"))
        .catch((e) => res.status(500).send({"error":e}))
});

app.delete('/favourites', (req, res) => {
    console.log();
    conn.execute('delete from `favoriteCities` WHERE (`NAME`) = (?)', [req.body.city.alphaNumeric()])
        .then(() => res.send("200 OK DELETED"))
        .catch((e) => res.status(500).send({"error":e}))
});

app.listen(port, () => console.log('Listen port ', port));