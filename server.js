const express = require('express');
require('./app/database/database');

const { PORT } = require('./app/config/env');
const genreRoutes = require('./app/routes/genre.routes');
const corsMiddleware = require('./app/middlewares/cors');
const notFoundMiddleware = require('./app/middlewares/notFound');
const errorHandler = require('./app/middlewares/errorHandler');

const app = express();

app.disable('x-powered-by');
app.use(corsMiddleware);
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.use('/api/genres', genreRoutes);

app.use(notFoundMiddleware);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
