const { Sequelize } = require('sequelize');
const { DATABASE_URL, NODE_ENV } = require('../config/env');

const sequelize = new Sequelize(DATABASE_URL, {
    logging: NODE_ENV !== 'production',
    dialect: 'mysql',
    define: {
        timestamps: true,
        underscored: true,
        createdAt: 'created_at',
        updatedAt: 'modified_at'
    }
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connexion à la base de données réussie');
    } catch (error) {
        console.error('Impossible de se connecter à la base de données :', error.message);
        process.exit(1);
    }
})();

module.exports = sequelize;
