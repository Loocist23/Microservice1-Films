const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');

const AgeRating = sequelize.define('AgeRating', {
    value: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'age_rating',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'modified_at',
    underscored: true
});

module.exports = AgeRating;
