const BooksModel = require('./model');

/**
 * @method getChartData
 * @param {any}
 * @returns {any}
 */
const getChartData = async () => {
    return BooksModel.aggregate([
        {
            $match: {},
        },
        {
            $group: {
                _id: '$code3',
                value: { $sum: 1 },
                code3: { $first: '$code3' },
            },
        },
        {
            $project: {
                _id: 0,
                code3: 1,
                value: 1,
            },
        },
    ]);
};

module.exports = {
    getChartData,
};
