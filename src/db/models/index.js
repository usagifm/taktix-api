'use strict'

const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const basename = path.basename(__filename)
const env = process.env.NODE_ENV || 'development'
const config = require(__dirname + '/../config.js')[env]
const db = {}

let sequelize
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config,
        {
            pool: {
                max: 200, // default connection pool size
                min: 0,
                acquire: 30000,
                idle: 10000
            }
        })
    
} else {
    sequelize = new Sequelize(
        config.database,
        config.username,
        config.password,
        config,
        {
            pool: {
                max: 200, // default connection pool size
                min: 0,
                acquire: 30000,
                idle: 10000
            }
        }
    )
}

fs.readdirSync(__dirname)
    .filter((file) => {
        return (
            file.indexOf('.') !== 0 &&
            file !== basename &&
            file.slice(-3) === '.js'
        )
    })
    .forEach((file) => {
        const model = require(path.join(__dirname, file))(
            sequelize,
            Sequelize.DataTypes
        )
        db[model.name] = model
    })

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db)
    }
})

db.sequelize = sequelize
db.Sequelize = Sequelize
// sequelize.sync({alter: true})

module.exports = db
