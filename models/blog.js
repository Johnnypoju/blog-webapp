const { Model, DataTypes, DatabaseError } = require('sequelize');

const { sequelize } = require('../util/db');


class Blog extends Model {};

Blog.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    author: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    url: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    title: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0

    },
    userId: {
        type: DataTypes.INTEGER,
        
    }
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'blog'
});

module.exports = Blog;