const Sequelize = require('sequelize');
const { DATABASE_URL } = require('./config')

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres'
});

const connectToDatabase = async () => {
    try {
        await sequelize.authenticate()
        console.log('Connected to the database');
    } catch (error) {
        console.log('Failed to connect to the database');
        return process.exit(1);
    }

    return null
}

module.exports = { connectToDatabase, sequelize };