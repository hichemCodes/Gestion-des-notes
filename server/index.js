const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require("body-parser");
const mysqlConnection = require("./connection");
const cors = require('cors');
const app = express();


//importation des routes
const etuRoutes = require('./routes/etu');
const adminRoutes = require('./routes/admin');
const ensRoutes = require('./routes/ens');

app.use(cors());


app.use(bodyParser.json());

app.use('', etuRoutes);
app.use('', adminRoutes);
app.use('', ensRoutes);


app.listen(3001, () => console.log('Server started ...'));
