const express = require("express");
const cookieParser = require("cookie-parser")
const cors = require('cors');
const { SQL_MULT_RESULT_SETS } = require("ibm_db/lib/climacros");

require("dotenv").config();
const app = express();
app.use(cors({
  origin: process.env.IP_FRONT,
  credentials: true
}))
//Procesar datos enviados desde forms
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(cookieParser())

app.use('/', require("./routes/peripherals.routes.js"));
app.use('/', require("./routes/roles.routes.js"));


module.exports = app;