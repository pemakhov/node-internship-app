const BooksModel = require('./model');

/**
 * @method getChartData
 * @param {any}
 * @returns {any}
 */
const getChartData = async () => {
    BooksModel.aggregate([{ $group: { _id: { code3: '$code3' }, count: { $sum: 1 } } }],
        (error, data) => {
            if (error) {
                console.error('An error happened');
            }
            console.log(data.length);
        });
};

module.exports = {
    getChartData,
};
