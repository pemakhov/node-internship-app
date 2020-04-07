import BooksModel from './Model';
import IBooks from './IBooks';

/**
 * Class containing methods for database queries
 */
export default class Service {
    /**
     * Model of Books component
     */
    // ? If I take type from usage, I get the error that property
    // ? 'aggregate' doesn't exist in Model (!)
    // eslint-disable-next-line @typescript-eslint/typedef
    private booksModel;

    /**
     * Class constructor
     */
    constructor() {
        this.booksModel = new BooksModel().model;
    }

    /**
     * Gets the number of books by country
     * @method getChartData
     * @param {any}
     * @returns {Promise}
     */
    public getChartData(): IBooks {
        return this.booksModel.aggregate([
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
    }
}
