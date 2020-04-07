import mongoose from 'mongoose';
import Connection from '../../config/Connection';

/**
 * Class containing the model, describing data stored in the database
 */
export default class Model {
    /**
     * Mongoose schema
     */
    private bookSchema: mongoose.Schema;

    /**
     * Mongoose connection
     */
    private connection: mongoose.Connection;

    /**
     * Model for the data of component Books
     */
    private booksModel: Model | mongoose.Model<mongoose.Document, {}>;

    /**
     * Schema definition
     */
    private schemaDefinition: mongoose.SchemaDefinition = {
        title: {
            type: String,
            trim: true,
        },
        titleLength: {
            type: Number,
            required: false,
        },
        description: {
            type: String,
            required: true,
        },
        code3: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            required: true,
        },
        updatedAt: {
            type: Date,
            required: true,
        },
    };

    /**
     * Schema options
     */
    private schemaOptions: mongoose.SchemaOptions = {
        collection: 'booksmodel',
        versionKey: false,
    };

    /**
     * Class constructor
     */
    constructor() {
        this.bookSchema = new mongoose.Schema(this.schemaDefinition, this.schemaOptions);
        this.connection = new Connection().connection;
        this.booksModel = this.connection.model('BooksModel', this.bookSchema);
    }

    /**
     * Getter for the Books Model
     */
    public get model(): Model | mongoose.Model<mongoose.Document, {}> {
        return this.booksModel;
    }
}
