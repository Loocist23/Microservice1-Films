const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database/database')

const Genre = sequelize.define('Genre', {
    label: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'genres',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'modified_at',
    underscored: true
});

module.exports = Genre
