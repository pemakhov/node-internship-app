const csvToJson = require('csvtojson');

const DATA_PATH = '../books.csv';
const COLLECTION_NAME = 'BooksModel';

module.exports = {
    async up(db) {
        // TODO write your migration here.
        // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
        // Example:
        // await db.collection('albums').updateOne({artist: 'The Beatles'},
        // {$set: {blacklisted: true}});
        try {
            const books = await csvToJson().fromFile(DATA_PATH);
            books.forEach((book) => {
                book.createdAt = Date().toString();
                book.versionKey = 0;
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
