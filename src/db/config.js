require('dotenv').config()

module.exports = {
    development: {
        database: 'taktix_db',
        use_env_variable: 'DATABASE_DEV_URL',
        dialect: 'mysql',
        define: {
            underscored: true,
          },
        
            pool: {
                max: 200, // default connection pool size
                min: 0,
                acquire: 30000,
                idle: 10000
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
        
        pool: {
            max: 200, // default connection pool size
            min: 0,
            acquire: 30000,
            idle: 10000
        }

    },
}
