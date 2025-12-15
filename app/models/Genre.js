const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database/database')

const Genre = sequelize.define('Genre', {
    label: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

module.exports = Genre