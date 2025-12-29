const dotenv = require('dotenv');

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;
const DATABASE_URL = process.env.DATABASE_URL;
const NODE_ENV = process.env.NODE_ENV || 'development';

if (!DATABASE_URL) {
    throw new Error('DATABASE_URL must be defined in the environment configuration');
}

module.exports = {
    DATABASE_URL,
    NODE_ENV,
    PORT
};
