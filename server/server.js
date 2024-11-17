const express = require('express');

const loginRoutes = require('./routes/login');

const PORT = 3001;
const app = express();

app.use(express.json());

app.use('/api/login', loginRoutes);

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});