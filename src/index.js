"use strict";
var express = require('express');
var mongoose = require('mongoose');
var app = express();
var path = require('path');
app.listen(3000, function () {
    console.log('Server is running...');
});
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '.index.html'));
});
