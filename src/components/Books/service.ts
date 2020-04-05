import BooksModel from './model';

/**
 * Gets the number of books by country
 * @method getChartData
 * @param {any}
 * @returns {Promise}
 */
const getChartData = async () => BooksModel.aggregate([
    {
        $match: {},
    },
    {
        $group: {
            _id: '$code3',
            code3: { $first: '$code3' },
            value: { $sum: 1 },
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

export default {
    getChartData,
};
