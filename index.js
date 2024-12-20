const express = require('express');
require('dotenv').config();
const app = express();
const mongoose = require('mongoose');

const PORT = 5003;

const userRoutes = require('./routes/userRoute');


mongoose
.connect('mongodb://127.0.0.1:27017/BMS')
.then(() => console.log('Connected to MongoDB'))
.catch((err) => { 
    console.log(err);
});

app.use(express.json())
app.use(express.urlencoded())

app.use('/api/users', userRoutes);

app.listen(PORT, () => {
    console.log('Server is running');
});