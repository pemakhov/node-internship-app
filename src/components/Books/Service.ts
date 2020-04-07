import BooksModel from './Model';

interface Books {
    [index: number]: { code3: string; value: number };
}

export default class Service {
    private booksModel;

    constructor() {
        this.booksModel = new BooksModel().model;
    }

    /**
     * Gets the number of books by country
     * @method getChartData
     * @param {any}
     * @returns {Promise}
     */
    public getChartData(): Books {
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
