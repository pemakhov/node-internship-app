import { Schema, SchemaDefinition, SchemaOptions } from 'mongoose';
import Connection from '../../config/Connection';

export default class Model {
    private bookSchema: Schema;

    private connection;

    private booksModel;

    private schemaDefinition: SchemaDefinition = {
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

    private schemaOptions: SchemaOptions = {
        collection: 'booksmodel',
        versionKey: false,
    };

    constructor() {
        this.bookSchema = new Schema(this.schemaDefinition, this.schemaOptions);
        this.connection = new Connection().connection;
        this.booksModel = this.connection.model('BooksModel', this.bookSchema);
    }

    public get model() {
        return this.booksModel;
    }
}
