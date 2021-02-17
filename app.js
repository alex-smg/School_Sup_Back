const express = require('express');
const app = express();
const port = 3000;
const dotenv = require('dotenv');
const AuthController = require('./auth/AuthController');
const db = require('./db');
dotenv.config();
app.use(express.json());
app.use('/api/auth', AuthController);


app.listen(process.env.PORT, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


module.exports = app;