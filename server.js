const express = require('express');
const sequelize = require('./app/database/database')

// Routes
const genreRoutes = require('./app/routes/genre.routes');

const app = express();
const port = 3000;
app.use(express.json());

app.use('/genre', genreRoutes);

app.listen(port, () => console.log(`Server running on port ${port}`));