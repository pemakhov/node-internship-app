// ? Gave up setting the propper chart const.
// ? There should be Promise, but it crashes the app.
/* eslint-disable @typescript-eslint/typedef */
import express from 'express';
import Service from './Service';
import IBooks from './IBooks';

/**
 * Class containing methods serving routs
 */
export default class BooksComponet {
    private booksService: Service;

    /**
     * Class constructor
     */
    constructor() {
        this.booksService = new Service();
    }

    /**
     * Gets the numbers of books per country and passes them in the JSON format
     * @param {express.Request} req
     * @param {express.Response} res
     * @param {express.NextFunction} next
     * @returns {Promise < void >}
     */
    public chart = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction): Promise<unknown> => {
        try {
            /**
             * Database search result
             */
            const data: IBooks = await this.booksService.getChartData();
            return res.status(200).json({ data });
        } catch (error) {
            res.status(500).json({
                message: error.name,
                details: error.message,
            });

            return next(error);
        }
    }
}
