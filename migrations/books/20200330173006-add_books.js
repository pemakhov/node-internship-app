const csvToJson = require('csvtojson');

const DATA_PATH = '../books.csv';
const COLLECTION_NAME = 'booksmodel';

module.exports = {
    async up(db) {
        try {
            const books = await csvToJson().fromFile(DATA_PATH);
            books.forEach((book) => {
                book.createdAt = Date.now();
                book.updatedAt = Date.now();
            });
            await db.collection(COLLECTION_NAME).insertMany(books);
        } catch (error) {
            console.error(error);
        }
    },


    async down(db) {
        try {
            db.collection(COLLECTION_NAME).drop();
        } catch (error) {
            console.error(error);
        }
    },
};
