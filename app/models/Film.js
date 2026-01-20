const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');

const Film = sequelize.define('Film', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    synopsis: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ageRatingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'age_rating_id'
    }
}, {
    tableName: 'films',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'modified_at',
    underscored: true
});

module.exports = Film;
