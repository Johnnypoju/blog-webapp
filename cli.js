require('dotenv').config()
const { Sequelize, Model, DataTypes } = require('sequelize')
const express = require('express')
const app = express()

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres'
});

class Blog extends Model {}
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

    }
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'blog'
});

const main = async () => {
    const blogs = await Blog.findAll();
    blogs.map(blog => {
        console.log(`${blog.dataValues.author}: '${blog.dataValues.title}', ${blog.dataValues.likes} likes`)
    });
};

main();