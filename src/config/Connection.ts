import mongoose from 'mongoose';

/**
 * Constants used for mongoose connection
 */
enum MongoConstant {
    MONGODB_URI = 'mongodb://localhost:27017/',
    MONGODB_DB_MAIN = 'books_db',
}

/**
 * Class creating mongoose connection
 */
export default class Connection {
    /**
     * Mongo URI string
     */
    private mongoUri: string;

    /**
     * Mongoose connection obtions
     */
    private connectionOptions: mongoose.ConnectionOptions = {
        // automatically try to reconnect when it loses connection
        autoReconnect: true,
        // reconnect every reconnectInterval milliseconds
        // for reconnectTries times
        reconnectTries: Number.MAX_VALUE,
        reconnectInterval: 1000,
        // flag to allow users to fall back to the old
        // parser if they find a bug in the new parse
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    /**
     * Mongoose connection instance
     */
    private mongoConnection: mongoose.Connection;

    /**
     * Class constructor
     */
    constructor() {
        this.mongoUri = `${MongoConstant.MONGODB_URI}${MongoConstant.MONGODB_DB_MAIN}`;
        this.mongoConnection = mongoose.createConnection(this.mongoUri, this.connectionOptions);
    }

    /**
     * @returns mongoose connection
     */
    public get connection(): mongoose.Connection {
        return this.mongoConnection;
    }
}
