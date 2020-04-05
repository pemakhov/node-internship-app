import { Schema } from 'mongoose';
import connections from '../../config/connection';

const BooksSchema = new Schema(
    {
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
    },
    {
        collection: 'booksmodel',
        versionKey: false,
    },
);

export default connections.model('BooksModel', BooksSchema);
