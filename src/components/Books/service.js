// const BooksModel = require('./model');

/**
 * @method getChartData
 * @param {any}
 * @returns {any}
 */
const getChartData = async () => {
    // const agg = BooksModel.aggregate([{ $match: { code3: { $gte: 'CHL' } } }]);
    console.log('works');
    // for await (const doc of agg) {
    //     console.log(doc);
    // }
    return [];
};

// const { MongoClient } = require('mongodb');

// const MONGODB_URI = 'mongodb://localhost:27017/';
// const DB_MAIN = 'books_db';


// /**
//  * @method getChartData
//  * @param {any}
//  * @returns {any}
//  */
// const getChartData = () => {
//     MongoClient.connect(MONGODB_URI,
//         { useNewUrlParser: true, useUnifiedTopology: true },
//         (error, database) => {
//             if (error) {
//                 console.error('Database connection error');
//             }
//             console.log('Connected!');
//             const db = database.db(DB_MAIN);
//             db.collection('BooksModel').findOne({},
//                 (error, result) => {
//                     if (error) {
//                         console.error('There is an error in db processing');
//                     }
//                     console.log(result);
//                 });
//         });
//     return [];
// };

module.exports = {
    getChartData,
};
