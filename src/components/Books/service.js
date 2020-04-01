const BooksModel = require('./model');

/**
 * @method getChartData
 * @param {any}
 * @returns {any}
 */
const getChartData = async () => {
    const agg = await BooksModel.aggregate([
        {
            $match: {},
        },
        {
            $group: {
                _id: '$code3',
                value: { $sum: 1 },
            },
        },
        {
            $project: {
                code3: '$code3',
                value: '$value',
            },
        },
    ]);
    console.log(agg);
    return [];
};

module.exports = {
    getChartData,
};
