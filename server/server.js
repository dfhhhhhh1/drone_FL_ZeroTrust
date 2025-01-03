require('dotenv').config('./.env');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const loginRoutes = require('./routes/login');
const projectRoutes = require('./routes/project');
const emailRoutes = require('./routes/email');

const PORT = 3001;
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/login', loginRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/email', emailRoutes);

mongoose.connect(process.env.MONGODB)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Listening on ${PORT}`);
        });
    })
    .catch((error) => console.log(error));