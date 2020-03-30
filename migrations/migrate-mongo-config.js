/* migrate-mongo configuration */
const config = {
    mongodb: {
        /* The url to MongoDB */
        url: 'mongodb://localhost:27017',

        /* Database name */
        databaseName: 'books_db',

        options: {
            useNewUrlParser: true, // removes a deprecation warning when connecting
            useUnifiedTopology: true, // removes a deprecating warning when connecting
            //   connectTimeoutMS: 3600000, // increase connection timeout to 1 hour
            //   socketTimeoutMS: 3600000, // increase socket timeout to 1 hour
        },
    },

    /* The migrations dir */
    migrationsDir: 'books',

    // The mongodb collection where the applied changes are stored.
    // Only edit this when really necessary.
    changelogCollectionName: 'changelog',
};

// Return the config as a promise
module.exports = config;
