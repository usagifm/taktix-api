require('dotenv').config()

module.exports = {
    development: {
        database: 'taktix_db',
        use_env_variable: 'DATABASE_DEV_URL',
        dialect: 'mysql',
        define: {
            underscored: true,
          }

    },
    production: {
        database: 'taktix_db',
        use_env_variable: 'DATABASE_URL',
        dialect: 'mysql',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },

    },
}
