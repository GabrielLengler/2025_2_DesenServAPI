const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

// *** ESSENCIAL ***
app.use(express.json());

// rotas
const wavesRotas = require('./src/rotas/wavesRotas');
app.use('/waves', wavesRotas);

const authRotas = require('./src/rotas/authRotas');
app.use('/auth', authRotas);

module.exports = app;
